# 📖 Detailed Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Scraping Documentation](#scraping-documentation)
3. [Processing Content](#processing-content)
4. [Running the Website](#running-the-website)
5. [Deployment](#deployment)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements
- Node.js 18.0 or higher
- npm 8.0 or higher
- 2GB free disk space
- Internet connection for scraping

### Initial Setup

1. **Install dependencies**
```bash
# Run the setup script
./setup.sh

# Or manually install
npm install
cd web && npm install && cd ..
```

2. **Configure environment (optional)**
```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
nano .env
```

Key environment variables:
- `OPENAI_API_KEY`: For AI-powered content transformation
- `MAX_PAGES_TO_SCRAPE`: Limit scraping (default: 10)
- `PROCESSING_DELAY_MS`: Delay between requests (default: 1000)

## Scraping Documentation

### Basic Scraping

**Default (Experience Builder docs):**
```bash
npm run scrape
```

**Custom URL:**
```bash
npm run scrape https://doc.arcgis.com/en/experience-builder/
```

### Scraper Options

```bash
# Scrape with custom output directory
node cli/scrape.js scrape <url> -o ./custom-output

# Process a single PDF
node cli/scrape.js pdf ./path/to/file.pdf
```

### What Gets Scraped

The scraper extracts:
- ✅ Main page content
- ✅ Headers and navigation
- ✅ Code samples
- ✅ PDF files (automatically downloaded)
- ✅ Related pages (configurable limit)
- ✅ Images and diagrams

### Scraping Output

Check `data/raw/` after scraping:
```
data/raw/
├── manifest.json          # Index of all content
├── main-page.json        # Main page content
├── page-*.json           # Related pages
├── *.pdf                 # Downloaded PDFs
└── *.pdf.json           # Extracted PDF content
```

## Processing Content

### Basic Processing

```bash
npm run process
```

### Processing Modes

**1. With AI (OpenAI API key required):**
- Intelligent content rewriting
- Context-aware examples
- Humanitarian use cases added
- Technical jargon simplified

**2. Fallback mode (no API key):**
- Basic formatting
- Structure preservation
- Link organization
- Code highlighting

### Processing Output

Check `data/processed/` after processing:
```
data/processed/
└── content.json          # Transformed content
```

The content is also copied to `web/public/content/` for the website.

### Content Categories

Processed content is automatically categorized:
- 🚀 **Getting Started**: Introductions, basics
- 📚 **Core Concepts**: Fundamental knowledge
- 🧩 **Widgets**: Component documentation
- 📊 **Data Sources**: Data management
- ⚡ **Actions & Triggers**: Interactions
- 🌐 **Deployment**: Publishing apps
- 🏥 **Humanitarian**: Real-world use cases

## Running the Website

### Development Server

```bash
# Start the development server
npm run dev

# Or directly from web directory
cd web && npm run dev
```

Visit: http://localhost:3000

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Website Features

**Navigation:**
- Sidebar with all sections
- Search functionality
- Mobile-responsive menu

**Content Display:**
- Markdown rendering
- Code syntax highlighting
- Image support
- External link indicators

**Special Sections:**
- Home dashboard
- Humanitarian examples
- Resource links
- Original documentation references

## Deployment

### Vercel Deployment (Recommended)

**1. Prepare your code:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Deploy with Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project name? esri-docs-simplified
# - Which directory? ./web
# - Override settings? No
```

**3. Auto-deployment:**
- Connect GitHub repo to Vercel
- Every push to main deploys automatically

### Manual Deployment

**1. Build the project:**
```bash
cd web
npm run build
```

**2. Deploy the `.next` folder to any Node.js host**

### Custom Domain

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your domain
3. Follow DNS configuration

## Advanced Configuration

### Customize Scraping

Edit `cli/scrape.js`:
```javascript
const config = {
  outputDir: path.join(__dirname, '../data/raw'),
  delay: 1000,        // Milliseconds between requests
  maxRetries: 3,      // Retry failed requests
  userAgent: 'Custom' // Custom user agent
};
```

### Customize Processing

Edit `processor/process.js`:
```javascript
const config = {
  maxTokens: 2000,    // AI response limit
  temperature: 0.7,   // AI creativity (0-1)
  model: 'gpt-4'      // AI model selection
};
```

### Customize Website

**Theme (web/tailwind.config.js):**
```javascript
colors: {
  primary: '#yourcolor',
  secondary: '#yourcolor'
}
```

**Layout (web/pages/index.js):**
- Modify navigation structure
- Add new sections
- Customize templates

### Add New Content Sources

1. Create new scraper in `cli/scrapers/`:
```javascript
// cli/scrapers/custom.js
module.exports = async function scrapeCustom(url) {
  // Your scraping logic
}
```

2. Register in main scraper:
```javascript
// cli/scrape.js
const customScraper = require('./scrapers/custom');
```

## Troubleshooting

### Common Issues

**1. Scraping fails:**
- Check internet connection
- Verify URL is accessible
- Increase delay between requests
- Check for rate limiting

**2. Processing doesn't transform content:**
- Verify OpenAI API key in .env
- Check API quota/credits
- Falls back to basic processing automatically

**3. Website won't start:**
```bash
# Clear Next.js cache
rm -rf web/.next

# Reinstall dependencies
cd web && rm -rf node_modules && npm install
```

**4. Deployment fails:**
- Check Node.js version compatibility
- Verify all dependencies installed
- Check Vercel logs for errors

### Debug Mode

Enable verbose logging:
```bash
# Set debug environment variable
DEBUG=* npm run scrape
DEBUG=* npm run process
```

### Getting Help

1. Check existing issues: [GitHub Issues](https://github.com/franzenjb/esri-docs-simplified/issues)
2. Create new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details

## Tips & Best Practices

### For Humanitarian Organizations

1. **Focus on essentials:**
   - Scrape only needed documentation
   - Process with humanitarian context
   - Test on mobile devices

2. **Optimize for field use:**
   - Enable offline mode
   - Minimize bandwidth usage
   - Simplify navigation

3. **Customize examples:**
   - Add your organization's use cases
   - Include local context
   - Translate key sections

### Performance Optimization

1. **Limit scraping scope:**
```bash
# Set maximum pages
export MAX_PAGES_TO_SCRAPE=5
npm run scrape
```

2. **Cache processed content:**
- Processed content is cached
- Reuse for multiple deployments
- Update only when source changes

3. **Optimize images:**
- Compress before deployment
- Use appropriate formats
- Lazy load when possible

### Security Considerations

1. **API Keys:**
- Never commit .env file
- Use environment variables in production
- Rotate keys regularly

2. **Content validation:**
- Review scraped content
- Verify transformations
- Test before deployment

3. **Access control:**
- Consider authentication for sensitive docs
- Use Vercel's edge functions for protection
- Monitor usage analytics

---

For more help, see the [README](README.md) or create an issue on GitHub!