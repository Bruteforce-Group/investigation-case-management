# User Interface Design Specification
## Investigation Case Management Application for macOS

### Overview

This document outlines the user interface design for the Investigation Case Management application for macOS on Apple Silicon. The design follows Apple's Human Interface Guidelines for macOS and utilizes SwiftUI for implementation. The UI is designed to be intuitive, efficient, and visually clear for investigators managing complex cases.

### Design Principles

1. **Clarity**: Information hierarchy is clear and content is easily scannable
2. **Efficiency**: Common tasks are streamlined and require minimal steps
3. **Consistency**: UI patterns are consistent throughout the application
4. **Flexibility**: Interface adapts to different screen sizes and user preferences
5. **Feedback**: System provides clear feedback for user actions
6. **Security**: UI elements support secure handling of sensitive information

### Color Palette

- **Primary**: #0055D4 (Deep Blue) - Main actions, headers
- **Secondary**: #00A3E0 (Light Blue) - Secondary elements, highlights
- **Accent**: #FF9500 (Orange) - Important actions, alerts
- **Success**: #34C759 (Green) - Positive feedback, completed actions
- **Warning**: #FFCC00 (Yellow) - Warnings, cautions
- **Error**: #FF3B30 (Red) - Errors, critical alerts
- **Background**: #F2F2F7 (Light Gray) - Main background
- **Surface**: #FFFFFF (White) - Cards, dialogs, content areas
- **Text Primary**: #000000 (Black) - Primary text
- **Text Secondary**: #6C6C70 (Dark Gray) - Secondary text

### Typography

- **Headings**: SF Pro Display Bold
- **Subheadings**: SF Pro Display Semibold
- **Body Text**: SF Pro Text Regular
- **Captions**: SF Pro Text Regular, smaller size
- **Buttons**: SF Pro Text Medium

### Main UI Components

#### 1. Main Window Layout

The main window follows a three-panel layout:

- **Left Panel**: Navigation sidebar with case list and main sections
- **Middle Panel**: Context-specific content (case details, evidence list, etc.)
- **Right Panel**: Details panel for selected item (can be collapsed)

#### 2. Navigation Sidebar

- Case list with status indicators
- Main navigation sections:
  - Dashboard
  - Cases
  - Evidence
  - Timeline
  - Persons
  - Analysis
  - Reports
  - Settings

#### 3. Dashboard

- Case statistics and metrics
- Recent activity feed
- Quick access to active cases
- Notifications and alerts
- AI-generated insights

#### 4. Case Management

- Case list with filtering and sorting options
- Case creation form
- Case detail view with tabs:
  - Overview
  - Evidence
  - Timeline
  - Persons
  - Notes
  - Analysis
  - Reports

#### 5. Evidence Management

- Evidence grid/list view with thumbnails
- Evidence detail view
- Evidence upload interface
- OCR processing status
- Evidence tagging and categorization
- Chain of custody tracking

#### 6. Timeline Visualization

- Interactive timeline with zoom controls
- Event filtering by type, importance, and confidence
- Event creation and editing
- Connection visualization between events
- AI-suggested timeline events (visually distinct)

#### 7. Person Management

- Person list with role indicators
- Person detail view
- Relationship visualization
- Contact information and history

#### 8. Analysis Tools

- AI-powered analysis interface
- Query builder for Claude API
- Analysis results visualization
- Saved analyses library

#### 9. Search Interface

- Global search bar
- Advanced search with filters
- Vector search capabilities
- Search results with context
- Recent searches

#### 10. Reports

- Report templates
- Report builder
- Export options (PDF, DOCX, etc.)
- Print preview

### Interaction Patterns

#### 1. Drag and Drop

- Evidence files into case
- Timeline events for reordering
- Persons to create relationships
- Items to create connections

#### 2. Context Menus

- Right-click context menus for common actions
- Customizable context menu items

#### 3. Keyboard Shortcuts

- Standard macOS shortcuts
- Application-specific shortcuts for common actions
- Customizable keyboard shortcuts

#### 4. Touch Bar Support

- Context-specific controls in Touch Bar
- Quick actions based on current view

### Accessibility Considerations

- Support for VoiceOver
- Keyboard navigation for all functions
- Customizable text size
- High contrast mode
- Support for system-wide accessibility features

### Responsive Design

The UI adapts to different window sizes and configurations:

- **Compact**: Sidebar collapses to icons, detail panel auto-hides
- **Regular**: Three-panel layout with adjustable dividers
- **Expanded**: Full-width views for timeline and analysis tools

### UI Mockups

#### Dashboard View

```
+-----------------------------------------------+
|  [Logo] Investigation Case Management         |
+-----------------------------------------------+
| + New Case |  Search...         | User ▼      |
+-----------------------------------------------+
| NAVIGATION |     DASHBOARD                    |
|            |                                  |
| Dashboard  | Active Cases (5)                 |
| Cases      | +-------------------+            |
| Evidence   | | Case #12345       |            |
| Timeline   | | Robbery Inv.      |            |
| Persons    | | Priority: High    |            |
| Analysis   | | Last updated: 2h  |            |
| Reports    | +-------------------+            |
| Settings   |                                  |
|            | Recent Activity                  |
|            | • Evidence added to Case #12345  |
|            | • New timeline event created     |
|            | • OCR completed for 3 documents  |
|            |                                  |
|            | AI Insights                      |
|            | "Possible connection between..."  |
|            |                                  |
+------------+----------------------------------+
```

#### Case Detail View

```
+-----------------------------------------------+
|  [Logo] Investigation Case Management         |
+-----------------------------------------------+
| + New Case |  Search...         | User ▼      |
+-----------------------------------------------+
| NAVIGATION |     CASE #12345                  |
|            |                                  |
| Dashboard  | Overview | Evidence | Timeline | Persons | Notes | Analysis |
| Cases      |                                  |
| Evidence   | Case Title: Robbery Investigation|
| Timeline   | Status: Active                   |
| Persons    | Priority: High                   |
| Analysis   | Created: April 2, 2025           |
| Reports    | Assigned to: John Smith          |
| Settings   |                                  |
|            | Description:                     |
|            | Armed robbery at First National  |
|            | Bank on Main Street. Two suspects|
|            | fled in a blue sedan.            |
|            |                                  |
|            | Tags: robbery, armed, bank       |
|            |                                  |
+------------+----------------------------------+
```

#### Evidence View

```
+-----------------------------------------------+
|  [Logo] Investigation Case Management         |
+-----------------------------------------------+
| + New Case |  Search...         | User ▼      |
+-----------------------------------------------+
| NAVIGATION |     EVIDENCE                     |
|            |                                  |
| Dashboard  | + Add Evidence | Filter ▼ | Sort ▼|
| Cases      |                                  |
| Evidence   | [□] [□] [□] [□] Select All       |
| Timeline   |                                  |
| Persons    | +------------+ +------------+    |
| Analysis   | | [Image]    | | [Document] |    |
| Reports    | | Security   | | Witness    |    |
| Settings   | | Camera #1  | | Statement  |    |
|            | +------------+ +------------+    |
|            |                                  |
|            | +------------+ +------------+    |
|            | | [Audio]    | | [Image]    |    |
|            | | 911 Call   | | Crime Scene|    |
|            | |            | | Photo #1   |    |
|            | +------------+ +------------+    |
|            |                                  |
+------------+----------------------------------+
```

#### Timeline View

```
+-----------------------------------------------+
|  [Logo] Investigation Case Management         |
+-----------------------------------------------+
| + New Case |  Search...         | User ▼      |
+-----------------------------------------------+
| NAVIGATION |     TIMELINE                     |
|            |                                  |
| Dashboard  | + Add Event | Filter ▼ | Zoom ◀▶ |
| Cases      |                                  |
| Evidence   | April 2, 2025                    |
| Timeline   | |                                |
| Persons    | | 09:15 - Bank opens             |
| Analysis   | |                                |
| Reports    | | 10:30 - Suspects enter bank    |
| Settings   | |   ↓                            |
|            | | 10:32 - Robbery occurs         |
|            | |   ↓                            |
|            | | 10:35 - Suspects flee in sedan |
|            | |   ↓                            |
|            | | 10:37 - 911 call received      |
|            | |                                |
|            | | 10:45 - Police arrive on scene |
|            |                                  |
+------------+----------------------------------+
```

#### Analysis View

```
+-----------------------------------------------+
|  [Logo] Investigation Case Management         |
+-----------------------------------------------+
| + New Case |  Search...         | User ▼      |
+-----------------------------------------------+
| NAVIGATION |     ANALYSIS                     |
|            |                                  |
| Dashboard  | New Analysis | Saved Analyses ▼  |
| Cases      |                                  |
| Evidence   | Query:                           |
| Timeline   | [Find connections between the    ]|
| Persons    | [suspect and the vehicle         ]|
| Analysis   |                                  |
| Reports    | Include:                         |
| Settings   | [x] Evidence  [x] Timeline       |
|            | [x] Persons   [x] Notes          |
|            |                                  |
|            | [      Run Analysis      ]       |
|            |                                  |
|            | Results:                         |
|            | "Analysis suggests a connection  |
|            | between suspect John Doe and the |
|            | blue sedan seen in evidence #4..." |
|            |                                  |
+------------+----------------------------------+
```

### Mobile Adaptations

While the primary focus is on macOS, the design considers future adaptations for iOS:

- Tabbed navigation instead of sidebar
- Stack navigation for detail views
- Touch-optimized controls
- Simplified layouts for smaller screens

### Implementation Guidelines

1. Use SwiftUI for all UI components
2. Follow MVVM architecture pattern
3. Implement responsive layouts using GeometryReader and size classes
4. Use SF Symbols for consistent iconography
5. Implement dark mode support
6. Create reusable components for common UI elements
7. Use animations judiciously for state transitions
8. Implement proper error handling and user feedback

### Next Steps

1. Create detailed wireframes for each main view
2. Develop interactive prototypes for key user flows
3. Conduct usability testing with investigators
4. Refine designs based on feedback
5. Create component library for implementation
6. Develop UI style guide for developers
