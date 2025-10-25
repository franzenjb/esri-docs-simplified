#!/bin/bash

echo "🚀 Setting up Esri Docs Simplified..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install main dependencies
npm install

# Install web dependencies
cd web
npm install
cd ..

# Create necessary directories
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p data/raw data/processed web/public/content

# Create .gitkeep files to preserve empty directories
touch data/raw/.gitkeep
touch data/processed/.gitkeep
touch web/public/content/.gitkeep

# Copy environment file
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your API keys${NC}"
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env file with your API keys (optional, for AI processing)"
echo "2. Run 'npm run scrape <url>' to scrape Esri documentation"
echo "3. Run 'npm run process' to transform the content"
echo "4. Run 'npm run dev' to start the development server"
echo "5. Visit http://localhost:3000 to view your site"
echo ""
echo "🚀 Quick start (using default Experience Builder docs):"
echo "   npm run scrape"
echo "   npm run process"
echo "   npm run dev"