import { useState, useEffect } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import {
  Menu, X, Search, BookOpen, Home, Layers,
  Zap, Globe, Heart, ChevronRight, ExternalLink,
  FileText, Download, Star
} from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [content, setContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Navigation structure
  const navigation = [
    { id: 'home', title: 'Home', icon: Home },
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'core-concepts', title: 'Core Concepts', icon: Layers },
    { id: 'widgets', title: 'Widgets & Components', icon: FileText },
    { id: 'data-sources', title: 'Data Sources', icon: Layers },
    { id: 'actions-triggers', title: 'Actions & Triggers', icon: Zap },
    { id: 'deployment', title: 'Deployment', icon: Globe },
    { id: 'humanitarian', title: 'Humanitarian Use Cases', icon: Heart }
  ];

  // Load content
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Try to load processed content
      const response = await fetch('/content/content.json');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Use default content if processed content not available
        setContent(getDefaultContent());
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = () => ({
    structure: {
      sections: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          description: 'Begin your journey with Experience Builder',
          icon: '🚀',
          content: [
            {
              id: 'intro',
              content: `# Getting Started with Experience Builder

## What is Experience Builder?

Think of Experience Builder as your visual tool for creating web applications with maps and data. Instead of writing code, you drag and drop components to build powerful applications.

### Why Use Experience Builder?

**For Humanitarian Work:**
- **Rapid Response**: Build disaster response dashboards in minutes, not days
- **Field-Ready**: Create mobile-friendly apps for field workers
- **Data Visualization**: Show impact through interactive maps and charts
- **Stakeholder Communication**: Build public-facing dashboards for transparency

### Real-World Example: Hurricane Response

Imagine a hurricane is approaching. You need to:
1. Show evacuation routes
2. Mark shelter locations
3. Display real-time weather data
4. Track resource distribution

Experience Builder lets you create this application quickly:
- Drag a map widget onto your canvas
- Add your shelter locations layer
- Connect a weather service feed
- Add charts showing shelter capacity
- Publish and share with emergency responders

### First Steps

1. **Access Experience Builder**
   - Log in to your ArcGIS Online account
   - Click "Content" → "Create" → "App" → "Experience Builder"

2. **Choose a Template**
   - Start with "Blank" for full control
   - Or select "Dashboard" for data monitoring
   - "Mobile" template for field applications

3. **Add Your First Widget**
   - Drag a Map widget from the panel
   - Click "Select Map" to choose your data
   - Resize and position as needed

### Key Concepts Made Simple

**Widgets** = Building blocks (maps, charts, text)
**Data Sources** = Your information (CSV files, map services)
**Actions** = Interactions (click shelter → show details)
**Triggers** = Events that start actions (page loads → update data)

> 💡 **Pro Tip**: Start simple! Add one widget at a time and test frequently.`
            }
          ]
        },
        {
          id: 'core-concepts',
          title: 'Core Concepts',
          description: 'Understand the fundamental building blocks',
          icon: '📚',
          content: [
            {
              id: 'concepts',
              content: `# Core Concepts Explained Simply

## The Building Blocks

### 1. Widgets - Your App Components

Think of widgets like LEGO blocks. Each one does something specific:
- **Map Widget**: Shows geographic data
- **Chart Widget**: Displays statistics
- **List Widget**: Shows data in rows
- **Text Widget**: Adds explanations

### 2. Data Sources - Your Information

Data sources are like filing cabinets containing your information:
- **Feature Layers**: Points on a map (shelters, incidents)
- **CSV Files**: Spreadsheets with data
- **Web Services**: Live data feeds (weather, traffic)

### 3. Pages - Your App Structure

Pages organize your content:
- **Single Page**: Everything on one screen (good for dashboards)
- **Multi-Page**: Separate screens for different tasks
- **Scrolling Page**: Long-form content with maps and data

### 4. Themes - Your App's Look

Themes control appearance:
- **Colors**: Match your organization's branding
- **Fonts**: Ensure readability
- **Spacing**: Create clean, professional layouts

## How They Work Together

**Example: Emergency Shelter Tracker**

1. **Data Source**: CSV file with shelter addresses and capacity
2. **Map Widget**: Shows shelter locations as pins
3. **List Widget**: Displays shelter details in a table
4. **Action**: Click a shelter pin → highlights row in list
5. **Theme**: Red Cross colors for instant recognition

## Common Patterns

### Dashboard Pattern
- Multiple widgets showing different data views
- Real-time updates
- Used for: Operations centers, monitoring

### Story Pattern
- Scrolling narrative with embedded maps
- Progressive information reveal
- Used for: Public communication, reports

### Collection Pattern
- Grid of related items
- Click to explore details
- Used for: Resource libraries, project showcases`
            }
          ]
        },
        {
          id: 'humanitarian',
          title: 'Humanitarian Use Cases',
          description: 'Real-world applications for disaster response',
          icon: '🏥',
          content: [
            {
              id: 'use-cases',
              content: `# Humanitarian Applications

## Real-World Use Cases

### 1. Disaster Response Dashboard

**Scenario**: Flooding in urban area
**Need**: Coordinate rescue operations

**Solution Built with Experience Builder:**
- Live map showing flood extent
- List of affected neighborhoods
- Chart of resources by location
- Emergency contact information

**Key Features Used:**
- Near-real-time data refresh (every 5 minutes)
- Mobile-responsive for field teams
- Offline capability for poor connectivity areas

### 2. Vaccination Campaign Tracker

**Scenario**: COVID-19 vaccination rollout
**Need**: Show progress and find vaccination sites

**Solution:**
- Map of vaccination centers
- Availability by location
- Demographics served
- Appointment scheduling links

### 3. Supply Distribution Network

**Scenario**: Food distribution during crisis
**Need**: Track supplies and distribution points

**Solution:**
- Interactive map of distribution points
- Inventory levels at each location
- Route optimization for delivery trucks
- Beneficiary registration status

## Building Your First Humanitarian App

### Quick Start: Shelter Locator

**Goal**: Help people find nearest emergency shelter

**Step 1: Prepare Your Data**
- Create spreadsheet with shelter info
- Include: Name, Address, Capacity, Services
- Save as CSV file

**Step 2: Build the App**
1. Upload CSV to ArcGIS Online
2. Create new Experience Builder app
3. Add Map widget
4. Add your shelter data to map
5. Add List widget showing shelter details
6. Connect map clicks to list highlights

**Step 3: Enhance**
- Add filter for wheelchair accessible shelters
- Include directions link to Google Maps
- Add phone numbers for each shelter
- Create mobile-friendly layout

### Best Practices for Humanitarian Apps

✅ **DO:**
- Keep interfaces simple and intuitive
- Test on mobile devices
- Provide offline capabilities when possible
- Include multiple languages
- Make text large and readable

❌ **DON'T:**
- Overload with too much information
- Require high-bandwidth connections
- Use complex interactions
- Forget accessibility features

## Templates for Common Needs

### Emergency Operations Center
- Multi-panel dashboard
- Real-time data feeds
- Resource tracking
- Communication logs

### Public Information Portal
- Simple map interface
- Clear action buttons
- Multi-language support
- Social media integration

### Field Assessment Tool
- Mobile-first design
- Offline data collection
- Photo uploads
- GPS integration`
            }
          ]
        }
      ]
    },
    content: [],
    manifest: {}
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading documentation...</div>
        </div>
      );
    }

    if (activeSection === 'home') {
      return (
        <div className="animate-fade-in">
          <div className="bg-gradient-to-br from-esri-blue to-esri-darkBlue text-white rounded-2xl p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Esri Experience Builder - Simplified
            </h1>
            <p className="text-xl mb-6">
              Transform complex documentation into clear, actionable knowledge
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('getting-started')}
                className="bg-white text-esri-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </button>
              <a
                href="https://community.esri.com/t5/esri-training-documents/arcgis-experience-builder-advanced-techniques/ta-p/1651520"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-esri-blue transition-colors inline-flex items-center"
              >
                Original Docs <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigation.slice(1).map((item) => {
              const Icon = item.icon;
              const section = content?.structure?.sections?.find(s => s.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="card cursor-pointer hover:border-esri-blue transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-esri-blue bg-opacity-10 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-esri-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {section?.description || 'Explore this topic'}
                      </p>
                      <div className="mt-4 flex items-center text-esri-blue font-medium">
                        Explore <ChevronRight className="ml-1 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-redcross-red bg-opacity-5 border border-redcross-red border-opacity-20 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-redcross-red">
              Built for Humanitarian Work
            </h2>
            <p className="text-gray-700 mb-4">
              This simplified documentation is designed with humanitarian organizations in mind,
              particularly the Red Cross and disaster response teams. Every example and explanation
              focuses on real-world applications that matter in crisis situations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-redcross-red" />
                <span className="text-gray-700">Rapid deployment focus</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-redcross-red" />
                <span className="text-gray-700">Mobile-first examples</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-redcross-red" />
                <span className="text-gray-700">Field-tested patterns</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const section = content?.structure?.sections?.find(s => s.id === activeSection);
    if (!section) {
      return <div>Section not found</div>;
    }

    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{section.icon}</span>
            <h1 className="section-title">{section.title}</h1>
          </div>
          <p className="section-description">{section.description}</p>
        </div>

        <div className="space-y-8">
          {section.content.map((item) => (
            <div key={item.id} className="card">
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{
                  __html: marked(item.content || 'Content loading...')
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ExternalLink className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-blue-900">Need the original documentation?</p>
              <a
                href="https://community.esri.com/t5/esri-training-documents/arcgis-experience-builder-advanced-techniques/ta-p/1651520"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View original Esri documentation →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Esri Docs Simplified - Experience Builder Made Clear</title>
        <meta name="description" content="Clear, flowing documentation for ArcGIS Experience Builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-esri-blue">Esri Simplified</h2>
          <p className="text-sm text-gray-600 mt-1">Experience Builder Docs</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-esri-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
            );
          })}
        </nav>

        {/* Resources */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Resources</h3>
          <div className="space-y-2">
            <a
              href="https://www.esri.com/en-us/arcgis/products/arcgis-experience-builder/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-esri-blue"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Official Esri Site</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Download feature coming soon!');
              }}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-esri-blue"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}