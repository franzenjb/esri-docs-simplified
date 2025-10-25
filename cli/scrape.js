#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { Command } = require('commander');
const pdfParse = require('pdf-parse');

const program = new Command();

// Configuration
const config = {
  outputDir: path.join(__dirname, '../data/raw'),
  userAgent: 'Mozilla/5.0 (compatible; EsriDocsScraper/1.0)',
  delay: 1000, // milliseconds between requests
  maxRetries: 3
};

// Ensure output directory exists
fs.ensureDirSync(config.outputDir);

/**
 * Delay function to avoid overwhelming servers
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Download a file with retry logic
 */
async function downloadFile(url, outputPath, retries = config.maxRetries) {
  try {
    console.log(`Downloading: ${url}`);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': config.userAgent
      }
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry ${config.maxRetries - retries + 1}/${config.maxRetries} for ${url}`);
      await delay(config.delay * 2);
      return downloadFile(url, outputPath, retries - 1);
    }
    throw error;
  }
}

/**
 * Scrape a web page and extract content
 */
async function scrapePage(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': config.userAgent
      }
    });

    const $ = cheerio.load(response.data);

    // Extract different types of content
    const content = {
      url: url,
      title: $('title').text() || $('h1').first().text(),
      headers: [],
      paragraphs: [],
      codeBlocks: [],
      links: [],
      images: [],
      metadata: {
        scraped: new Date().toISOString(),
        source: 'esri-community'
      }
    };

    // Extract headers
    $('h1, h2, h3, h4').each((i, el) => {
      content.headers.push({
        level: el.name,
        text: $(el).text().trim()
      });
    });

    // Extract paragraphs
    $('p').each((i, el) => {
      const text = $(el).text().trim();
      if (text) {
        content.paragraphs.push(text);
      }
    });

    // Extract code blocks
    $('pre, code').each((i, el) => {
      const code = $(el).text().trim();
      if (code) {
        content.codeBlocks.push(code);
      }
    });

    // Extract links
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href) {
        content.links.push({
          href: href.startsWith('http') ? href : new URL(href, url).href,
          text: text
        });
      }
    });

    // Extract images
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src) {
        content.images.push({
          src: src.startsWith('http') ? src : new URL(src, url).href,
          alt: alt
        });
      }
    });

    return content;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    throw error;
  }
}

/**
 * Process PDF files
 */
async function processPDF(filePath) {
  try {
    console.log(`Processing PDF: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text,
      pages: data.numpages,
      metadata: data.metadata,
      info: data.info
    };
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Main scraping function for Experience Builder docs
 */
async function scrapeExperienceBuilderDocs(url) {
  console.log('Starting Experience Builder documentation scrape...');

  const manifest = {
    mainUrl: url,
    scraped: new Date().toISOString(),
    content: [],
    resources: []
  };

  try {
    // Scrape main page
    const mainContent = await scrapePage(url);
    manifest.content.push(mainContent);

    // Save main content
    const mainOutput = path.join(config.outputDir, 'main-page.json');
    await fs.writeJson(mainOutput, mainContent, { spaces: 2 });
    console.log(`Saved main page content to ${mainOutput}`);

    // Find and download PDFs
    const pdfLinks = mainContent.links.filter(link => link.href.endsWith('.pdf'));
    console.log(`Found ${pdfLinks.length} PDF files`);

    for (const pdfLink of pdfLinks) {
      await delay(config.delay);
      const pdfName = path.basename(pdfLink.href);
      const pdfPath = path.join(config.outputDir, pdfName);

      try {
        await downloadFile(pdfLink.href, pdfPath);
        console.log(`Downloaded PDF: ${pdfName}`);

        // Process PDF content
        const pdfContent = await processPDF(pdfPath);
        const pdfJsonPath = path.join(config.outputDir, `${pdfName}.json`);
        await fs.writeJson(pdfJsonPath, pdfContent, { spaces: 2 });

        manifest.resources.push({
          type: 'pdf',
          name: pdfName,
          url: pdfLink.href,
          localPath: pdfPath,
          processed: true
        });
      } catch (error) {
        console.error(`Failed to process PDF ${pdfName}:`, error.message);
        manifest.resources.push({
          type: 'pdf',
          name: pdfName,
          url: pdfLink.href,
          error: error.message,
          processed: false
        });
      }
    }

    // Find and scrape related pages
    const relatedLinks = mainContent.links.filter(link =>
      link.href.includes('esri.com') &&
      !link.href.endsWith('.pdf') &&
      !link.href.includes('#')
    ).slice(0, 10); // Limit to avoid too many requests

    console.log(`Found ${relatedLinks.length} related pages to scrape`);

    for (const link of relatedLinks) {
      await delay(config.delay);
      try {
        const content = await scrapePage(link.href);
        const fileName = `page-${Date.now()}.json`;
        const filePath = path.join(config.outputDir, fileName);
        await fs.writeJson(filePath, content, { spaces: 2 });

        manifest.content.push({
          url: link.href,
          file: fileName
        });
      } catch (error) {
        console.error(`Failed to scrape ${link.href}:`, error.message);
      }
    }

    // Save manifest
    const manifestPath = path.join(config.outputDir, 'manifest.json');
    await fs.writeJson(manifestPath, manifest, { spaces: 2 });
    console.log(`\nScraping complete! Manifest saved to ${manifestPath}`);

    // Print summary
    console.log('\n=== Scraping Summary ===');
    console.log(`Pages scraped: ${manifest.content.length}`);
    console.log(`PDFs downloaded: ${manifest.resources.filter(r => r.type === 'pdf' && r.processed).length}`);
    console.log(`Output directory: ${config.outputDir}`);

  } catch (error) {
    console.error('Scraping failed:', error);
    process.exit(1);
  }
}

// CLI Setup
program
  .name('esri-scraper')
  .description('Scrape and download Esri documentation')
  .version('1.0.0');

program
  .command('scrape <url>')
  .description('Scrape Esri documentation from a URL')
  .option('-o, --output <dir>', 'Output directory', config.outputDir)
  .action(async (url, options) => {
    if (options.output) {
      config.outputDir = options.output;
      fs.ensureDirSync(config.outputDir);
    }
    await scrapeExperienceBuilderDocs(url);
  });

program
  .command('pdf <file>')
  .description('Process a single PDF file')
  .action(async (file) => {
    const content = await processPDF(file);
    console.log(JSON.stringify(content, null, 2));
  });

// Default command
if (process.argv.length === 2) {
  // Use the Experience Builder URL as default
  const defaultUrl = 'https://community.esri.com/t5/esri-training-documents/arcgis-experience-builder-advanced-techniques/ta-p/1651520';
  console.log(`No URL provided. Using default: ${defaultUrl}`);
  scrapeExperienceBuilderDocs(defaultUrl);
} else {
  program.parse(process.argv);
}