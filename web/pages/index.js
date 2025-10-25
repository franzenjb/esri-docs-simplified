import { useState, useEffect } from 'react';
import Head from 'next/head';
import { marked } from 'marked';
import {
  Menu, X, Search, BookOpen, Home as HomeIcon, Layers,
  Zap, Globe, Heart, ChevronRight, ExternalLink,
  FileText, Download, Star
} from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [content, setContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigation structure
  const navigation = [
    { id: 'home', title: 'Home', icon: HomeIcon },
    { id: 'latest-updates', title: '🔥 Latest Updates (Oct 25)', icon: Star },
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'core-concepts', title: 'Core Concepts', icon: Layers },
    { id: 'advanced-techniques', title: 'Advanced Techniques', icon: Zap },
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

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim() || !content?.structure?.sections) {
      setSearchResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    content.structure.sections.forEach(section => {
      // Search in section title and description
      const titleMatch = section.title.toLowerCase().includes(searchTerm);
      const descMatch = section.description?.toLowerCase().includes(searchTerm);

      // Search in section content
      section.content?.forEach(item => {
        const contentText = item.content || '';
        const contentLower = contentText.toLowerCase();

        if (titleMatch || descMatch || contentLower.includes(searchTerm)) {
          // Find context snippet
          const index = contentLower.indexOf(searchTerm);
          let snippet = '';

          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(contentText.length, index + searchTerm.length + 50);
            snippet = contentText.substring(start, end);

            // Clean up markdown and formatting
            snippet = snippet
              .replace(/[#*`]/g, '')
              .replace(/\n/g, ' ')
              .trim();

            if (start > 0) snippet = '...' + snippet;
            if (end < contentText.length) snippet = snippet + '...';
          } else if (titleMatch || descMatch) {
            snippet = section.description || section.title;
          }

          results.push({
            sectionId: section.id,
            sectionTitle: section.title,
            snippet: snippet,
            icon: section.icon
          });
        }
      });
    });

    setSearchResults(results);
  };

  const loadContent = async () => {
    try {
      // Try to load processed content
      const response = await fetch('/content/content.json');
      if (response.ok) {
        const data = await response.json();
        // Check if the loaded content has all necessary sections
        // If not, use default content
        if (data?.structure?.sections?.length > 1) {
          setContent(data);
        } else {
          // Content is incomplete, use default
          setContent(getDefaultContent());
        }
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
          id: 'latest-updates',
          title: 'Latest Updates - October 25, 2024',
          description: 'Breaking changes, new features, and important updates',
          icon: '🔥',
          content: [
            {
              id: 'october-updates',
              content: `# Experience Builder Updates - October 25, 2024

## ⚠️ Breaking Changes - Action Required

> **CRITICAL**: These changes may break existing applications. Review and test immediately.

### 1. Filter Widget - GlobalID/GUID Fields
- **Change**: GlobalID and GUID fields no longer allow partial matches
- **Impact**: Filters using these fields will only return exact matches
- **Action**: Review and update any filters using GlobalID or GUID fields

### 2. Search Widget - URL Parameters Renamed
- **Old**: \`serviceEnabledList\` → **New**: \`enabledList\`
- **Old**: \`searchText\` → **New**: \`text\`
- **Impact**: Bookmarked searches and shared URLs will break
- **Action**: Update all saved URLs and documentation

## 💰 Credit Usage Warning

> **BUSINESS ANALYST ALERT**: Creating, viewing, and exporting Infographics costs Credits - potentially more than you realize!

### Credit Consumption Areas:
- Creating Infographics in Business Analyst widget
- Viewing Infographics (each view)
- Exporting Infographics to PDF/Excel
- **Recommendation**: Monitor credit usage closely or disable for public apps

## 🎨 Major Theme System Revamp

### What's New:
- **Expanded Color Customization**: Beyond just Primary Color
- **Google Fonts Integration**: Import fonts directly from Google Fonts library
- **Accessibility Warnings**: Automatic alerts for unreadable text combinations
- **New Controls**:
  - Border radius settings
  - Text input colors
  - Link underline options (recommended for accessibility)

### How to Use:
1. Navigate to Theme settings
2. Use Typography tab for font imports
3. Check contrast warnings when changing colors
4. Test with screen readers

## ♿ Accessibility Improvements

### New A11Y Panel
- **Location**: Bottom bar of Builder
- **Features**:
  - Screen reader text configuration
  - Priority settings for focus order
  - Announcement customization

### Widgets with New Accessibility:
- Widget Controller
- List Widget
- Search Widget
- Chronology, Frame, Preface, and Ribbon Templates

## 🔒 Access Control Features

### Page-Level Restrictions
Configure page access based on:
- **User Types**: Public, Organization, etc.
- **Group Membership**: Specific teams only
- **Admin Override**: Administrators bypass all restrictions

### Implementation:
\`\`\`javascript
// In General Settings
pageAccess: {
  userTypes: ['Organization'],
  groups: ['Emergency Response Team'],
  adminOverride: true
}
\`\`\`

## 🆕 New Widgets

### 1. Image Collection Explorer
- View Dynamic Imagery Layers
- Create new Imagery Layers
- **Use Case**: Satellite imagery analysis for disaster assessment

### 2. Login Widget
- User authentication interface
- Configurable sign-out redirect
- **Use Case**: Secure internal dashboards

## 🔧 Enhanced Widget Features

### Map Widget
- **Zoom Level Restrictions**: Prevent users from zooming too far in/out
- **Scale Bar Styles**: Multiple display options
- **URL Parameters**: Set initial zoom level via URL
- **Locate Tool Integration**: Can trigger Near Me widget

### Edit Widget - Full Feature Parity
- **Batch Editing**: Edit multiple features at once
- **Split Tool**: Divide features
- **Merge Tool**: Combine features
- **Status**: Complete functional parity with WebAppBuilder!

### Table Widget Improvements
- **Bulk Configuration**: Apply settings to all layers
- **Map Extent Restrictions**: Show only visible features
- **Display Options**: Choose scrolling vs pagination
- **Sticky Rows**: Pin headers/footers

### Near Me Widget
- **Calculate Geometry**: Get length/area of intersecting features
- **Export Support**: Download results
- **Use Case**: "Show all shelters within 5km and their capacity"

### Filter Widget Enhancements
- **URL Parameter Support**: Set filters via URL
- **Expanded List Input**: Better UI for multiple selections
- **Pill Selector**: Visual tag-based selection

### Chart Widget - Time Intelligence
- **Rolling Windows**: Intervals aligned to first/last data point
- **Calendar-Based Units**: Standard time periods
- **Label Preferences**: Sort by alias or field name

## 🎯 UI/UX Improvements

### Window Management
- **Resizable Windows**: Drag to resize
- **Nested Widget Controllers**: Controllers within controllers
- **Customizable Sizing**: Button size, icon size, spacing

### Grid Widget
- **Insert Before/After**: Easier widget placement
- **Visual Guides**: Better alignment tools

### Map Layers
- **Runtime Removal**: Remove layers dynamically
- **Auto-Expansion**: Group layers expand in search results
- **Mosaic Sub-layers**: Customize individual layers

## 🚀 Quick Implementation Guide

### For Humanitarian Organizations:

1. **Update Authentication**:
   - Add Login widget for secure access
   - Configure page restrictions for sensitive data

2. **Enhance Accessibility**:
   - Enable A11Y panel settings
   - Test with screen readers
   - Verify color contrast

3. **Optimize Performance**:
   - Use new Table pagination for large datasets
   - Enable Map zoom restrictions
   - Configure Filter URL parameters for bookmarkable views

4. **Monitor Costs**:
   - Review Business Analyst usage
   - Disable credit-consuming features for public apps
   - Set up usage alerts

## 📋 Migration Checklist

- [ ] Review and update Filter widgets using GlobalID/GUID
- [ ] Update bookmarked URLs with new Search parameters
- [ ] Test theme changes with accessibility warnings
- [ ] Configure page access restrictions
- [ ] Enable new accessibility features
- [ ] Review Business Analyst credit usage
- [ ] Test in multiple browsers and devices

## 📚 Resources

- [Experience Builder Documentation](https://developers.arcgis.com/experience-builder/)
- [Experience Builder Community](https://community.esri.com/t5/arcgis-experience-builder/ct-p/arcgis-experience-builder)
- [ArcGIS Blog - Experience Builder Updates](https://www.esri.com/arcgis-blog/products/experience-builder/)

> 💡 **Pro Tip**: Test all changes in a development environment before deploying to production!`
            }
          ]
        },
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
          id: 'advanced-techniques',
          title: 'Advanced Techniques',
          description: 'Arcade, URL parameters, responsive design, and power features',
          icon: '⚡',
          content: [
            {
              id: 'advanced-guide',
              content: `# Advanced Techniques

*Everything you need to build sophisticated, professional applications*

## 🎨 Using Arcade to Enhance Your Apps

### What is Arcade?

Arcade is Esri's expression language - think of it as "Excel formulas for maps." It lets you calculate values, format text, and make decisions on the fly without touching your source data.

### Why Use Arcade in Experience Builder?

**Real-World Example**: You have shelter capacity data, but you need to show:
- "75% Full" instead of "75 out of 100"
- Color coding: Green (available), Yellow (limited), Red (full)
- Dynamic labels: "25 spaces remaining"

Arcade does this **without** creating new fields in your data.

### Common Arcade Use Cases

#### 1. Dynamic Labeling

**Scenario**: Show shelter status dynamically

\`\`\`javascript
// Calculate percentage and format nicely
var total = $feature.total_capacity
var occupied = $feature.current_occupancy
var percent = Round((occupied / total) * 100)
var available = total - occupied

return \`\${percent}% Full - \${available} spaces available\`
\`\`\`

**Result**: "75% Full - 25 spaces available"

#### 2. Conditional Styling

**Scenario**: Color shelters by availability

\`\`\`javascript
var percent = ($feature.current_occupancy / $feature.total_capacity) * 100

if (percent >= 90) {
  return "critical"  // Red
} else if (percent >= 75) {
  return "limited"   // Yellow
} else {
  return "available" // Green
}
\`\`\`

#### 3. Data Enrichment

**Scenario**: Calculate distance without a new field

\`\`\`javascript
var userLocation = Geometry($dataContext.userCoordinates)
var shelterLocation = Geometry($feature)
var distanceMeters = Distance(userLocation, shelterLocation)
var distanceKm = Round(distanceMeters / 1000, 1)

return distanceKm + " km away"
\`\`\`

### Where to Use Arcade in Experience Builder

1. **List Widget** - Custom attribute displays
2. **Chart Widget** - Calculated values
3. **Map Pop-ups** - Rich formatted content
4. **Filter Widget** - Dynamic filter expressions
5. **Text Widget** - Data-driven content

### Step-by-Step: Adding Arcade to a Widget

**Example: List Widget showing shelter status**

1. **Open List Widget Settings**
2. **Go to "Arrange"** tab
3. **Click on a field** you want to customize
4. **Select "Expression"** instead of field name
5. **Click "New Expression"**
6. **Write your Arcade code**:

\`\`\`javascript
// Get capacity data
var total = $feature.total_capacity
var current = $feature.current_occupancy
var available = total - current
var percent = Round((current / total) * 100)

// Determine status
var status =
  When(
    percent >= 90, "🔴 FULL",
    percent >= 75, "🟡 LIMITED",
    "🟢 AVAILABLE"
  )

// Return formatted string
return status + " - " + available + " beds"
\`\`\`

7. **Name it**: "Shelter Status"
8. **Click OK**

**Result**: Each shelter shows: "🟢 AVAILABLE - 45 beds"

### Arcade Quick Reference

#### Common Functions

\`\`\`javascript
// Math
Round(number, decimals)
Ceil(number)
Floor(number)
Abs(number)

// Text
Concatenate(text1, text2)
Upper(text)
Lower(text)
Replace(text, searchText, replacement)

// Logic
IIf(condition, trueValue, falseValue)
When(condition1, value1, condition2, value2, defaultValue)

// Geometry
Distance(geometry1, geometry2)
Area(polygon)
Length(line)

// Date
Now()
DateDiff(date1, date2, "days")
Text(date, "MMM D, YYYY")
\`\`\`

### Humanitarian Examples

#### Emergency Contact Display

\`\`\`javascript
var phone = $feature.emergency_phone
var available = $feature.is_staffed

return IIf(
  available == "Yes",
  "☎️ " + phone + " (STAFFED NOW)",
  "☎️ " + phone + " (Message only)"
)
\`\`\`

#### Resource Priority Indicator

\`\`\`javascript
var food = $feature.food_supply_days
var water = $feature.water_supply_days
var medical = $feature.medical_supply_days

var critical = Min([food, water, medical])

When(
  critical < 2, "🔴 CRITICAL: " + critical + " days",
  critical < 5, "🟡 LOW: " + critical + " days",
  "🟢 ADEQUATE: " + critical + " days"
)
\`\`\`

## 🔗 URL Parameters - Deep Linking & Bookmarkable Views

### Why URL Parameters Matter

**The Problem**: Users can't bookmark specific views
- Can't share "Show all shelters in Dallas with availability"
- Can't link directly to filtered maps
- Can't pre-configure apps for specific scenarios

**The Solution**: URL parameters let you set everything via URL

### Basic URL Structure

\`\`\`
https://your-app.com/experience-id?param1=value1&param2=value2
\`\`\`

### Common URL Parameters

#### 1. Set Initial Map Extent

\`\`\`
?center=-96.8,32.7&level=12
\`\`\`

**Use Case**: Link directly to disaster area
\`\`\`
?center=-90.0715,29.9511&level=11  // Hurricane zone
\`\`\`

#### 2. Pre-Apply Filters

\`\`\`
?filter=accessibility:wheelchair&filter=status:available
\`\`\`

**Use Case**: "Show only wheelchair-accessible available shelters"

#### 3. Search for Specific Features

\`\`\`
?text=Red+Cross+Shelter
\`\`\`

#### 4. Enable Specific Widgets

\`\`\`
?enabledList=shelters,food-banks,medical
\`\`\`

### Creating Bookmarkable Views

**Scenario**: Create links for different emergency scenarios

#### Hurricane Preparation
\`\`\`
https://your-app.com?
  center=-90.0715,29.9511&
  level=10&
  filter=shelter_type:hurricane&
  filter=status:available&
  enabledList=shelters
\`\`\`

#### Medical Emergency Response
\`\`\`
https://your-app.com?
  center=-96.8,32.7&
  level=12&
  filter=service:medical&
  filter=hours:24-hour&
  enabledList=medical-facilities
\`\`\`

### Configuring Widgets to Accept URL Parameters

#### Map Widget

1. Open Map Widget settings
2. Go to "Map Options" → "Initial View"
3. Enable "Allow URL to override"
4. Users can now use \`?center=X,Y&level=Z\`

#### Filter Widget

1. Open Filter Widget settings
2. Enable "URL Parameters"
3. Set parameter name: "filter"
4. Now \`?filter=field:value\` works

#### Search Widget

1. Open Search Widget settings
2. Enable "URL Parameters"
3. Set parameter name: "text"
4. Now \`?text=search+term\` works

### Practical Implementation

**Create a "Quick Links" page for your team**:

\`\`\`html
<!-- Emergency Response Quick Links -->
<h3>Dallas Emergency Resources</h3>

<a href="https://app.com?filter=type:shelter&filter=city:dallas">
  Available Shelters in Dallas
</a>

<a href="https://app.com?filter=type:food&filter=open:now">
  Food Banks Open Now
</a>

<a href="https://app.com?center=-96.8,32.7&level=15&filter=urgent:yes">
  Critical Needs - Dallas County
</a>
\`\`\`

## 📱 Responsive Design - One App, All Devices

### The Mobile-First Approach

Most disaster victims access information on phones. Design for mobile first, then enhance for desktop.

### Key Responsive Principles

#### 1. Size & Position Settings

**For Each Widget**:
- **Small (Phone)**: Stack vertically, full width
- **Medium (Tablet)**: 2-column layout
- **Large (Desktop)**: Multi-column, sidebars

**Example: Shelter List Widget**

| Device | Width | Position |
|--------|-------|----------|
| Phone | 100% | Top, below map |
| Tablet | 50% | Right side |
| Desktop | 30% | Fixed right panel |

#### 2. Using REM Units

**What are REM units?**
- REM = "Root EM" - scales with user's font settings
- Improves accessibility for vision-impaired users
- Makes layouts more flexible

**When to Use**:
- Text: Always use REM
- Spacing: Use REM for padding/margins
- Fixed elements: Use pixels for borders

**Example**:
\`\`\`css
font-size: 1rem;      /* Base text - scales */
padding: 2rem;        /* Spacing - scales */
border: 1px solid;    /* Fixed border */
\`\`\`

### Mobile-Optimized Widget Settings

#### Map Widget
- Enable "Mobile Pan/Zoom" for touch
- Larger tap targets (minimum 44px)
- Simplified basemap for faster loading

#### List Widget
- Reduce columns on mobile (1-2 max)
- Larger text (1.2rem minimum)
- Card layout instead of table

#### Filter Widget
- Collapsible on mobile
- Large tap targets for selections
- Clear, visible "Apply" button

### Testing Responsive Design

1. **Browser Tools**: Use Chrome DevTools (F12)
   - Toggle device toolbar
   - Test iPhone, iPad, Desktop sizes

2. **Real Devices**: Always test on:
   - iPhone (iOS)
   - Android phone
   - Tablet
   - Desktop browser

3. **Accessibility**: Test with:
   - Screen reader (VoiceOver, NVDA)
   - High contrast mode
   - Large text settings

## ♿ Comprehensive Accessibility Guide

### Why Accessibility Matters in Humanitarian Work

Disasters affect everyone, including people with disabilities. Your app MUST work for:
- Vision impairments (screen readers, low vision)
- Motor disabilities (keyboard-only navigation)
- Cognitive disabilities (clear, simple interfaces)
- Temporary disabilities (injured hands, bright sunlight)

### The A11Y Panel

**Location**: Bottom toolbar in Experience Builder

**Key Settings**:

#### 1. Screen Reader Text
- Every widget needs a descriptive label
- Not "Map" but "Emergency Shelter Locations Map"
- Not "List" but "Available Shelters List with Capacity"

#### 2. Focus Order
- Set tab order to match visual importance
- Critical actions first (search, filter)
- Navigation follows logical flow

#### 3. Announcements
- Alert users to dynamic changes
- "Filter applied: 5 shelters found"
- "Map updated: Showing Dallas area"

### Widget-Specific Accessibility

#### Map Widget
\`\`\`
Screen Reader Text: "Interactive map showing emergency shelter locations. Use arrow keys to pan, plus/minus to zoom."
Focus Order: 1
Announce Updates: Yes
\`\`\`

#### Filter Widget
\`\`\`
Screen Reader Text: "Filter shelters by availability, accessibility features, and services. Use space to select options."
Keyboard Shortcuts: Enter to apply, Escape to clear
\`\`\`

#### List Widget
\`\`\`
Screen Reader Text: "List of emergency shelters. Use arrow keys to navigate. Press Enter to view details."
Row Headers: Yes
Sortable: Yes (with keyboard)
\`\`\`

### Color Contrast Requirements

**WCAG AA Standard** (minimum):
- Normal text: 4.5:1 contrast
- Large text (18pt+): 3:1 contrast
- Interactive elements: 3:1 contrast

**Testing**: Use browser contrast checker
- Chrome: Lighthouse audit
- Firefox: Accessibility inspector

**Common Fixes**:
- ❌ Light gray on white: 2.1:1 (fails)
- ✅ Dark gray on white: 7:1 (passes)
- ❌ Yellow on white: 1.8:1 (fails)
- ✅ Dark orange on white: 4.6:1 (passes)

### Keyboard Navigation Checklist

- [ ] All widgets accessible via Tab key
- [ ] Visible focus indicators
- [ ] Enter/Space activates buttons
- [ ] Escape closes dialogs
- [ ] Arrow keys navigate lists
- [ ] Skip links for repeated content

### Screen Reader Best Practices

1. **Meaningful Labels**:
   - ❌ "Button 1"
   - ✅ "Apply Filters and Search"

2. **Status Messages**:
   - ❌ Silent updates
   - ✅ "Loading complete. 12 shelters found."

3. **Error Messages**:
   - ❌ Red text only
   - ✅ "Error: Please select at least one filter option"

## 🖨️ Printing & Reports

### Basic Printing Setup

1. Add **Print Widget** to your app
2. Configure layout:
   - Letter (8.5" x 11")
   - Tabloid (11" x 17")
   - Custom sizes

3. Set print options:
   - Include map at current extent
   - Include attribute table
   - Add title, date, legend

### Custom Print Templates

**Create in ArcGIS Pro**:

1. Open ArcGIS Pro
2. Create layout with your branding
3. Add dynamic text elements
4. Share as Print Service
5. Connect to Experience Builder

**Example Template Elements**:
- Organization logo
- "Shelter Status Report - {DATE}"
- Map at current view
- Table of features
- Summary statistics
- Emergency contact info

### Generating Reports

**Use Case**: Daily shelter capacity report

**Setup**:
1. Configure Near Me widget for analysis
2. Add Table widget with selected features
3. Add Chart widget showing trends
4. Print widget with custom template
5. Schedule or trigger manually

**Result**: PDF report with:
- Map showing all shelters
- Table of capacity by location
- Chart of occupancy trends
- Automatically dated and branded

## 💡 Pro Tips for Advanced Users

### Performance Optimization

1. **Limit Query Results**
   - Set max records to 1,000
   - Use extent-based filtering
   - Enable clustering for dense data

2. **Optimize Images**
   - Compress logos/photos
   - Use web-optimized formats (WebP)
   - Lazy-load non-critical images

3. **Reduce Widget Count**
   - Each widget = HTTP request
   - Combine functionality when possible
   - Load widgets on-demand

### Power User Shortcuts

- **Ctrl + Z**: Undo
- **Ctrl + C/V**: Copy/paste widgets
- **Alt + Drag**: Duplicate widget
- **Shift + Drag**: Constrain movement
- **Delete**: Remove selected widget

### Debugging Common Issues

#### "Widget not loading data"
1. Check data source connection
2. Verify field names match
3. Check filter expressions
4. Review browser console (F12)

#### "Actions not triggering"
1. Verify source/target widgets
2. Check message action configuration
3. Test trigger event
4. Review action chain order

#### "Layout broken on mobile"
1. Check size/position for small breakpoint
2. Test in device mode (F12)
3. Verify overflow settings
4. Check parent container constraints

> 💡 **Remember**: Advanced techniques make your apps more powerful, but always prioritize clarity and usability. The best app is one that works when people need it most.`
            }
          ]
        },
        {
          id: 'widgets',
          title: 'Widgets & Components',
          description: 'Learn about available widgets and how to use them',
          icon: '🧩',
          content: [
            {
              id: 'widgets-guide',
              content: `# Widgets & Components Guide

## Essential Widgets for Humanitarian Apps

### Map Widget
The foundation of any geographic application. Shows your data on an interactive map.

**Key Settings:**
- **Initial Extent**: Set to your area of operations
- **Basemap**: Choose appropriate for your region (satellite for rural, streets for urban)
- **Pop-ups**: Configure to show essential information only

### List Widget
Displays your data in a searchable, sortable table format.

**Best for:**
- Shelter inventories
- Resource tracking
- Beneficiary lists

### Chart Widget
Visualizes statistics and trends in your data.

**Common Uses:**
- Resource distribution over time
- Population demographics
- Incident reports by category

### Filter Widget
Allows users to narrow down data based on criteria.

**Example Filters:**
- Wheelchair accessible shelters only
- Resources within 5km radius
- Services available today

### Text Widget
Adds context, instructions, and information.

**Tips:**
- Keep text concise
- Use bullet points for clarity
- Include emergency contact info

## Widget Interactions

### Connecting Widgets
Make widgets work together:
1. Click on shelter in map → Highlights in list
2. Select date range in filter → Updates all widgets
3. Hover on chart segment → Shows related map points

### Mobile Optimization
- Stack widgets vertically on mobile
- Use collapsible panels for secondary info
- Ensure touch targets are at least 44px
- Test on actual devices, not just browser

## Performance Tips
- Limit visible features to improve speed
- Use clustering for dense point data
- Enable lazy loading for lists
- Cache static data when possible`
            }
          ]
        },
        {
          id: 'data-sources',
          title: 'Data Sources',
          description: 'Connect and manage your data',
          icon: '📊',
          content: [
            {
              id: 'data-guide',
              content: `# Working with Data Sources

## Quick Start with CSV Files

The fastest way to get data into Experience Builder:

1. **Prepare Your CSV**
   - First row must be column headers
   - Include latitude/longitude for map points
   - Keep file under 10MB for best performance

2. **Upload to ArcGIS Online**
   - Drag and drop your CSV
   - Choose field types (text, number, date)
   - Enable editing if field updates needed

3. **Connect to Experience Builder**
   - Add data source in app
   - Select your uploaded layer
   - Configure refresh interval if needed

## Data Types Explained

### Feature Layers
Your primary data storage - think of it as a smart spreadsheet with location.

### Map Services
Pre-styled map data ready to display.

### CSV/Excel Files
Simple tabular data that can be geocoded.

### Live Feeds
Real-time data from sensors or APIs.

## Data Best Practices

### For Emergency Response
- Update critical data at least hourly
- Include timestamp fields
- Maintain data backup strategy
- Document data sources and update frequency

### Field Data Collection
- Use Survey123 for structured collection
- Enable offline sync for poor connectivity
- Validate data entry at source
- Include photo attachments when helpful

### Data Security
- Control sharing settings appropriately
- Anonymize sensitive beneficiary data
- Use groups for team access
- Regular audit of data access logs`
            }
          ]
        },
        {
          id: 'actions-triggers',
          title: 'Actions & Triggers',
          description: 'Make your apps interactive',
          icon: '⚡',
          content: [
            {
              id: 'actions-guide',
              content: `# Actions & Triggers Explained

## Understanding the Basics

**Trigger**: Something that happens (user clicks, data loads, time passes)
**Action**: What your app does in response (zoom map, filter list, show message)

## Common Patterns

### Click to Select
**Trigger**: User clicks feature on map
**Action**:
- Highlight the selected feature
- Show details panel
- Zoom to feature extent

### Auto-Refresh Dashboard
**Trigger**: Timer (every 5 minutes)
**Action**:
- Refresh data sources
- Update statistics
- Show last updated timestamp

### Linked Navigation
**Trigger**: Select item in list
**Action**:
- Pan map to item location
- Flash the feature
- Update related charts

## Setting Up Actions

1. Select your trigger widget
2. Choose "Add Action"
3. Pick trigger event (click, hover, load)
4. Select target widget
5. Choose action type
6. Configure action settings

## Troubleshooting Actions

**Actions not working?**
- Check data source is properly connected
- Verify field names match
- Test in preview mode
- Check browser console for errors

**Performance issues?**
- Reduce number of simultaneous actions
- Use debounce for frequent triggers
- Limit data queried by actions`
            }
          ]
        },
        {
          id: 'deployment',
          title: 'Deployment',
          description: 'Share your applications',
          icon: '🌍',
          content: [
            {
              id: 'deployment-guide',
              content: `# Deployment Guide

## Publishing Your App

### 1. Final Checks
Before deploying:
- ✓ Test all functionality
- ✓ Verify mobile responsiveness
- ✓ Check load times
- ✓ Review sharing permissions
- ✓ Update documentation

### 2. Publish Settings
- **Title**: Clear, descriptive name
- **Description**: What the app does and who should use it
- **Tags**: Include "humanitarian", "emergency", your org name
- **Thumbnail**: Representative screenshot

### 3. Sharing Options

**Public**: Anyone can access
- Good for public information portals
- Awareness campaigns
- Community resources

**Organization**: Your ArcGIS org members only
- Internal dashboards
- Operational tools
- Sensitive data applications

**Groups**: Specific teams
- Partner coordination
- Project-specific tools
- Limited stakeholder access

## URL Management

### Custom URL
Instead of: \`arcgis.com/apps/experiencebuilder/experience/?id=abc123\`
Create: \`yourorg.maps.arcgis.com/apps/shelter-tracker\`

### Embedding
Add to your website:
\`\`\`html
<iframe src="your-app-url"
        width="100%"
        height="600"
        frameborder="0">
</iframe>
\`\`\`

## Maintenance

### Regular Updates
- Weekly: Check data freshness
- Monthly: Review usage analytics
- Quarterly: Gather user feedback
- Yearly: Major feature updates

### Monitoring
- Set up alerts for data failures
- Track performance metrics
- Monitor user feedback
- Document known issues`
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
                        {section?.description || 'Begin your journey with Experience Builder'}
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
      console.log('Active section:', activeSection);
      console.log('Available sections:', content?.structure?.sections?.map(s => s.id));
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Loading content...</h2>
          <p className="text-gray-500">Please select a section from the menu</p>
        </div>
      );
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
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6 max-h-96 overflow-y-auto">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.sectionId}-${index}`}
                  onClick={() => {
                    setActiveSection(result.sectionId);
                    setSearchQuery('');
                    setSearchResults([]);
                    setSidebarOpen(false);
                  }}
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:border-esri-blue cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{result.icon}</span>
                    <span className="font-semibold text-sm text-gray-900">
                      {result.sectionTitle}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {result.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show message when search has no results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">No results found for "{searchQuery}"</p>
            <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
          </div>
        )}

        {/* Navigation - Only show when not searching */}
        {!searchQuery && (
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
        )}

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