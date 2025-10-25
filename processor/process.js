#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const OpenAI = require('openai');
const marked = require('marked');
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const config = {
  inputDir: path.join(__dirname, '../data/raw'),
  outputDir: path.join(__dirname, '../data/processed'),
  webContentDir: path.join(__dirname, '../web/public/content'),
  maxTokens: 2000
};

// Ensure output directories exist
fs.ensureDirSync(config.outputDir);
fs.ensureDirSync(config.webContentDir);

/**
 * Transform technical content into plain English
 */
async function transformContent(content) {
  const prompt = `
You are helping transform complex Esri/ArcGIS documentation into clear, flowing prose for humanitarian workers.

Transform this technical content into plain English that's easy to understand:
- Replace developer jargon with simple explanations
- Explain the "why" not just the "how"
- Use real-world examples (especially humanitarian/Red Cross contexts)
- Create a narrative flow that builds understanding
- Keep technical accuracy while improving clarity

Original content:
${JSON.stringify(content, null, 2)}

Please provide:
1. A clear title
2. A brief overview (2-3 sentences)
3. Main concepts explained simply
4. Step-by-step instructions where applicable
5. Real-world use cases
6. Links to source materials

Format as clean markdown.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: config.maxTokens,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to basic transformation
    return fallbackTransform(content);
  }
}

/**
 * Fallback transformation without AI
 */
function fallbackTransform(content) {
  let markdown = `# ${content.title || 'Documentation'}\n\n`;

  if (content.url) {
    markdown += `> Source: [${content.url}](${content.url})\n\n`;
  }

  // Add headers
  if (content.headers && content.headers.length > 0) {
    markdown += '## Key Topics\n\n';
    content.headers.forEach(header => {
      const level = '#'.repeat(parseInt(header.level.charAt(1)) + 1);
      markdown += `${level} ${header.text}\n\n`;
    });
  }

  // Add content
  if (content.paragraphs && content.paragraphs.length > 0) {
    markdown += '## Content\n\n';
    content.paragraphs.forEach(p => {
      markdown += `${p}\n\n`;
    });
  }

  // Add code examples
  if (content.codeBlocks && content.codeBlocks.length > 0) {
    markdown += '## Code Examples\n\n';
    content.codeBlocks.forEach(code => {
      markdown += '```javascript\n' + code + '\n```\n\n';
    });
  }

  // Add resources
  if (content.links && content.links.length > 0) {
    markdown += '## Resources\n\n';
    content.links.slice(0, 10).forEach(link => {
      markdown += `- [${link.text || link.href}](${link.href})\n`;
    });
  }

  return markdown;
}

/**
 * Process PDF content
 */
function processPDFContent(pdfData) {
  const sections = [];
  const lines = pdfData.text.split('\n');
  let currentSection = { title: '', content: [] };

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Detect section headers (all caps or specific patterns)
    if (line === line.toUpperCase() && line.length > 3 && line.length < 50) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line, content: [] };
    } else {
      currentSection.content.push(line);
    }
  });

  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Create website structure
 */
async function createWebsiteStructure(processedContent) {
  const structure = {
    sections: [],
    navigation: [],
    metadata: {
      generated: new Date().toISOString(),
      totalSections: 0
    }
  };

  // Group content by topic
  const topics = {
    'getting-started': {
      title: 'Getting Started',
      description: 'Begin your journey with Experience Builder',
      content: [],
      icon: '🚀'
    },
    'core-concepts': {
      title: 'Core Concepts',
      description: 'Understand the fundamental building blocks',
      content: [],
      icon: '📚'
    },
    'widgets': {
      title: 'Widgets & Components',
      description: 'Learn about available widgets and how to use them',
      content: [],
      icon: '🧩'
    },
    'data-sources': {
      title: 'Data Sources',
      description: 'Connect and manage your data',
      content: [],
      icon: '📊'
    },
    'actions-triggers': {
      title: 'Actions & Triggers',
      description: 'Create interactive experiences',
      content: [],
      icon: '⚡'
    },
    'deployment': {
      title: 'Deployment',
      description: 'Share your applications with the world',
      content: [],
      icon: '🌐'
    },
    'humanitarian': {
      title: 'Humanitarian Use Cases',
      description: 'Real-world applications for disaster response',
      content: [],
      icon: '🏥'
    }
  };

  // Categorize content
  processedContent.forEach((content, index) => {
    const contentLower = content.toLowerCase();
    let category = 'core-concepts'; // default

    if (contentLower.includes('getting started') || contentLower.includes('introduction') || contentLower.includes('basics')) {
      category = 'getting-started';
    } else if (contentLower.includes('widget')) {
      category = 'widgets';
    } else if (contentLower.includes('data') || contentLower.includes('source') || contentLower.includes('layer')) {
      category = 'data-sources';
    } else if (contentLower.includes('action') || contentLower.includes('trigger') || contentLower.includes('event')) {
      category = 'actions-triggers';
    } else if (contentLower.includes('deploy') || contentLower.includes('publish') || contentLower.includes('share')) {
      category = 'deployment';
    } else if (contentLower.includes('humanitarian') || contentLower.includes('disaster') || contentLower.includes('emergency') || contentLower.includes('red cross')) {
      category = 'humanitarian';
    }

    topics[category].content.push({
      id: `section-${index}`,
      content: content
    });
  });

  // Build structure
  Object.entries(topics).forEach(([key, topic]) => {
    if (topic.content.length > 0) {
      structure.sections.push({
        id: key,
        ...topic
      });
      structure.navigation.push({
        id: key,
        title: topic.title,
        icon: topic.icon
      });
    }
  });

  structure.metadata.totalSections = structure.sections.length;

  return structure;
}

/**
 * Main processing function
 */
async function processDocumentation() {
  console.log('Starting documentation processing...');

  try {
    // Read manifest
    const manifestPath = path.join(config.inputDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      console.error('No manifest found. Please run the scraper first.');
      return;
    }

    const manifest = await fs.readJson(manifestPath);
    const processedContent = [];

    // Process main content
    console.log('Processing main page content...');
    const mainContent = await fs.readJson(path.join(config.inputDir, 'main-page.json'));

    if (process.env.OPENAI_API_KEY) {
      const transformed = await transformContent(mainContent);
      processedContent.push(transformed);
    } else {
      console.log('No OpenAI API key found. Using fallback transformation.');
      const transformed = fallbackTransform(mainContent);
      processedContent.push(transformed);
    }

    // Process PDF content
    const pdfFiles = manifest.resources.filter(r => r.type === 'pdf' && r.processed);
    console.log(`Processing ${pdfFiles.length} PDF files...`);

    for (const pdf of pdfFiles) {
      const pdfJsonPath = path.join(config.inputDir, `${pdf.name}.json`);
      if (fs.existsSync(pdfJsonPath)) {
        const pdfData = await fs.readJson(pdfJsonPath);
        const sections = processPDFContent(pdfData);

        for (const section of sections.slice(0, 5)) { // Limit sections to avoid too many API calls
          if (process.env.OPENAI_API_KEY) {
            const transformed = await transformContent({
              title: section.title,
              paragraphs: section.content
            });
            processedContent.push(transformed);
          } else {
            const transformed = fallbackTransform({
              title: section.title,
              paragraphs: section.content
            });
            processedContent.push(transformed);
          }
        }
      }
    }

    // Create website structure
    console.log('Creating website structure...');
    const structure = await createWebsiteStructure(processedContent);

    // Save processed content
    const outputPath = path.join(config.outputDir, 'content.json');
    await fs.writeJson(outputPath, {
      manifest: manifest,
      content: processedContent,
      structure: structure
    }, { spaces: 2 });

    // Copy to web directory
    const webPath = path.join(config.webContentDir, 'content.json');
    await fs.copy(outputPath, webPath);

    console.log('\n=== Processing Complete ===');
    console.log(`Processed ${processedContent.length} content pieces`);
    console.log(`Created ${structure.sections.length} website sections`);
    console.log(`Output saved to: ${outputPath}`);
    console.log(`Web content copied to: ${webPath}`);

    // Generate index file for web
    const indexContent = {
      title: 'Esri Experience Builder - Simplified',
      description: 'Clear, flowing documentation for ArcGIS Experience Builder',
      lastUpdated: new Date().toISOString(),
      sections: structure.sections.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        contentCount: s.content.length
      }))
    };

    await fs.writeJson(path.join(config.webContentDir, 'index.json'), indexContent, { spaces: 2 });

  } catch (error) {
    console.error('Processing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  processDocumentation();
}

module.exports = {
  transformContent,
  processPDFContent,
  createWebsiteStructure
};