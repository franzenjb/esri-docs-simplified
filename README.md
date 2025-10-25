# 🗺️ Esri Docs Simplified

Transform complex Esri documentation into clear, flowing websites designed for humanitarian work and rapid deployment scenarios.

## 🎯 Purpose

Esri's documentation is powerful but often overwhelming. This tool:
- **Scrapes** technical documentation from Esri sources
- **Transforms** developer jargon into plain English
- **Organizes** content into intuitive categories
- **Presents** information in a clean, searchable website
- **Focuses** on humanitarian use cases (Red Cross, disaster response)

## ✨ Features

- 📱 **Mobile-responsive design** for field workers
- 🔍 **Smart search** across all documentation
- 🏥 **Humanitarian examples** throughout
- 🎨 **Clean, modern interface** with Esri & Red Cross branding
- ⚡ **Fast performance** with Next.js
- 🤖 **AI-powered translation** of technical content (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- GitHub account (for version control)
- Vercel account (for deployment)
- OpenAI API key (optional, for enhanced content processing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/franzenjb/esri-docs-simplified.git
cd esri-docs-simplified
```

2. **Run setup**
```bash
./setup.sh
```

3. **Configure API keys (optional)**
```bash
cp .env.example .env
# Edit .env with your OpenAI API key for AI processing
```

### Usage

#### Default: Experience Builder Documentation

```bash
# Scrape the default Experience Builder docs
npm run scrape

# Process and transform the content
npm run process

# Start the development server
npm run dev
```

Visit http://localhost:3000 to see your documentation site!

#### Custom Documentation

```bash
# Scrape any Esri documentation page
npm run scrape https://your-esri-doc-url.com

# Process and deploy
npm run process
npm run build
```

## 📂 Project Structure

```
esri-docs-simplified/
├── cli/                 # Scraping tools
│   └── scrape.js       # Main scraper
├── processor/          # Content transformation
│   └── process.js      # AI/fallback processor
├── web/                # Next.js website
│   ├── pages/          # Website pages
│   ├── styles/         # Tailwind CSS
│   └── public/         # Static assets
├── data/               # Scraped content
│   ├── raw/           # Original content
│   └── processed/     # Transformed content
└── docs/              # Documentation
```

## 🛠️ How It Works

### 1. Scraping Phase
The CLI tool visits Esri documentation pages and:
- Extracts main content, headers, code samples
- Downloads PDF files and processes them
- Follows related links to build comprehensive coverage
- Saves everything to `data/raw/`

### 2. Processing Phase
The processor transforms raw content by:
- Using AI to rewrite in plain English (if API key provided)
- Categorizing content into logical sections
- Adding humanitarian context and examples
- Creating navigation structure

### 3. Website Generation
The Next.js app:
- Loads processed content
- Provides interactive navigation
- Enables search functionality
- Offers mobile-responsive design

## 🎨 Customization

### Themes
Edit `web/tailwind.config.js` to customize colors:
- Esri blue theme (default)
- Red Cross branding
- Your organization's colors

### Content Categories
Modify `processor/process.js` to add new categories:
- Current: Getting Started, Core Concepts, Widgets, etc.
- Add your own based on your needs

### Humanitarian Examples
The processor automatically adds context for:
- Disaster response
- Field operations
- Resource distribution
- Emergency shelters

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel:
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Deploy automatically

3. Your site will be live at:
`https://esri-docs-simplified.vercel.app`

## 📚 Examples

### Use Case: Hurricane Response Dashboard

The documentation includes step-by-step guides for:
1. Setting up evacuation route maps
2. Marking shelter locations
3. Displaying real-time weather data
4. Tracking resource distribution

### Use Case: Vaccination Campaign

Learn how to build:
1. Interactive maps of vaccination centers
2. Availability tracking by location
3. Demographics visualization
4. Appointment scheduling integration

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Focus areas:
- More humanitarian use cases
- Additional language support
- Improved mobile experience
- Offline capabilities

## 📄 License

MIT License - Use freely for humanitarian work!

## 🙏 Acknowledgments

- **Esri** for their powerful GIS platform
- **American Red Cross** for humanitarian focus
- **OpenAI** for content transformation capabilities
- **Vercel** for hosting and deployment

## 📞 Support

- Issues: [GitHub Issues](https://github.com/franzenjb/esri-docs-simplified/issues)
- Documentation: See `/docs` folder
- Original Esri docs: [Esri Community](https://community.esri.com)

## 🎯 Roadmap

- [ ] Offline mode for field deployment
- [ ] Multi-language support
- [ ] Video tutorial integration
- [ ] Interactive code examples
- [ ] Export to PDF/EPUB
- [ ] Integration with ArcGIS Online

---

**Built with ❤️ for humanitarian organizations worldwide**