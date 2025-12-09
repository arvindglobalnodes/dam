# DAM Platform - Digital Asset Management with Workflow Builder

A comprehensive React application for managing digital assets with a visual workflow builder, task management, and tenant onboarding.

## Project Structure

```
dam-platform/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── index.js                    # Application entry point
│   ├── index.css                   # Global styles and animations
│   ├── App.js                      # Main application component
│   ├── components/
│   │   ├── TenantOnboarding/
│   │   │   ├── TenantOnboarding.jsx
│   │   │   └── index.js
│   │   ├── WorkflowBuilder/
│   │   │   ├── WorkflowBuilder.jsx  # Visual workflow state machine editor
│   │   │   ├── ComponentList.jsx    # Reusable form field builder
│   │   │   └── index.js
│   │   ├── WorkflowPreview/
│   │   │   ├── WorkflowPreview.jsx  # Interactive workflow simulator
│   │   │   └── index.js
│   │   └── common/
│   │       ├── Icons.jsx            # 33 SVG icon components
│   │       └── index.js
│   ├── constants/
│   │   ├── styles.js                # Button, input, label, card styles
│   │   ├── componentTypes.js        # Form field type definitions
│   │   ├── colors.js                # State color palette
│   │   └── index.js
│   ├── utils/
│   │   └── demoData.js              # Initial workflows and asset types
│   └── hooks/                       # (Future custom hooks)
```

## Features

### 1. Tenant Onboarding Wizard
- Multi-step brand portal creation
- Company branding (name, domain, colors, logo)
- Asset type management
- Workflow configuration
- Deployment simulation

### 2. Workflow Builder
- Visual state machine editor with SVG canvas
- Drag-and-drop state management
- Action transitions with custom colors
- Task management within actions
- Form component builder (8 field types)
- Connection types: forward, backward, skip, terminal
- Real-time position calculation

### 3. Task Management
- Sequential task execution during state transitions
- Multiple completion behaviors:
  - Continue to next task/state
  - Jump to specific state
  - Trigger another action
- Task-specific form components
- Progress tracking

### 4. Workflow Preview
- Interactive workflow simulator
- State transition visualization
- Action execution with forms
- Task completion flow
- Execution log tracking
- Reset capability

### 5. Form Components
- Text Input
- Text Area
- Checklist
- File Upload
- Image Upload
- Dropdown
- User Picker
- Date Picker

## Installation

```bash
# Install dependencies
npm install

# Start development server (runs on port 3001)
npm start

# Build for production
npm run build
```

The app will open at `http://localhost:3001`

### Port Configuration

The app is configured to run on port **3001** by default (via `.env` file). To use a different port:

1. Edit the `.env` file in the project root
2. Change `PORT=3001` to your desired port
3. Restart the development server

## Technology Stack

- **React 18** - UI library
- **React Hooks** - State management (useState, useEffect)
- **Inline Styles** - Component styling with dark theme
- **SVG** - Visual workflow canvas rendering
- **DM Sans Font** - Typography

## Component Architecture

### TenantOnboarding
4-step wizard for creating brand portals:
1. Brand Information (name, domain, color, logo)
2. Asset Types (define categories)
3. Workflows (configure approval flows)
4. Deployment (simulate production launch)

### WorkflowBuilder
Three-panel layout:
- **Left Panel**: States and Actions list with tabs
- **Canvas**: Visual state machine with SVG connections
- **Right Panel**: Configuration panel for selected item

CRUD operations for:
- States (initial, intermediate, terminal)
- Actions (transitions between states)
- Action Components (form fields)
- Tasks (sub-workflows during transitions)
- Task Components (task-specific form fields)

### WorkflowPreview
Interactive simulator with:
- Current state display
- Available actions
- Form modals
- Task modals with progress
- Execution log sidebar

### ComponentList
Reusable form builder component:
- Add/update/delete form fields
- 8 component types
- Required field toggle
- Checklist items configuration
- Type selector dropdown

## Data Structures

### State
```javascript
{
  id: string,
  name: string,
  type: 'initial' | 'intermediate' | 'terminal',
  color: string (hex),
  order: number
}
```

### Action
```javascript
{
  id: string,
  name: string,
  fromState: string,
  toState: string,
  buttonColor: string (hex),
  components: Component[],
  hasTasks: boolean,
  tasks: Task[]
}
```

### Task
```javascript
{
  id: string,
  name: string,
  description: string,
  components: Component[],
  onComplete: 'continue' | 'goto_state' | 'goto_action',
  onCompleteTarget: string | null
}
```

### Component
```javascript
{
  id: string,
  type: 'text' | 'textarea' | 'checklist' | 'file' | 'image' | 'select' | 'user' | 'date',
  label: string,
  required: boolean,
  items?: string[] (for checklist)
}
```

## Customization

### Adding New Component Types
1. Add type definition to `src/constants/componentTypes.js`
2. Update `ComponentList.jsx` rendering logic
3. Add preview rendering in `WorkflowPreview.jsx`

### Styling
- Update global styles in `src/index.css`
- Modify component styles in `src/constants/styles.js`
- Adjust color palette in `src/constants/colors.js`

### State Position Algorithm
The workflow canvas calculates state positions dynamically:
- Non-terminal states: Vertical stack
- Terminal states: Horizontal row at bottom
- Spacing adjusts based on state type

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Alternative: Run with Different Port

If you prefer not to use a `.env` file, you can run the app with a custom port directly:

```bash
# Windows
set PORT=3001 && npm start

# macOS/Linux
PORT=3001 npm start
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
