# AI Agents Guide - Ecuador Contrapunto

## Project Context

**Ecuador Contrapunto** is a React-based web application for dialog and dashboard management. The application allows users to create, manage, and generate video content from text dialogs, featuring a modern interface with real-time video generation capabilities.

### Key Features
- Dialog creation and management
- Video generation from text or existing videos
- User authentication and authorization
- Real-time video processing and merging
- Responsive dashboard interface

## Rules and Guidelines for AI Agents

### Core Principles
1. **Always prioritize user requirements** - Focus on delivering functional, user-centric solutions
2. **Maintain code quality** - Follow established patterns and best practices
3. **Ensure type safety** - Leverage TypeScript for robust, error-free code
4. **Promote reusability** - Create modular, composable components
5. **Follow React 19 patterns** - Use modern React features and hooks appropriately

### Development Workflow
1. **Analyze requirements** thoroughly before implementation
2. **Create/update todo lists** for complex tasks using `update_todo_list`
3. **Apply changes incrementally** using targeted diffs
4. **Test functionality** after each significant change
5. **Document changes** clearly in commit messages

## Tools and Technologies

### Core Technologies
- **React 19** - Modern React with concurrent features and improved performance
- **TypeScript** - Static type checking for robust development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling

### Development Tools
- **ESLint** - Code linting and style enforcement
- **pnpm** - Fast, disk-efficient package manager
- **Vitest** - Modern testing framework (when applicable)

### External Services
- **PocketBase** - Backend-as-a-Service for authentication and data
- **N8N** - Workflow automation for video processing

## Frontend Architecture Best Practices

### React 19 and TypeScript Guidelines

#### Component Structure
```typescript
interface ComponentProps {
  // Define all props with proper types
  id: string
  onAction: (data: SomeType) => void
  children?: ReactNode
}

function ComponentName({ id, onAction, children }: ComponentProps) {
  // Component implementation
}
```

#### Hook Usage
- Use `useState` for local component state
- Use `useEffect` for side effects with proper dependency arrays
- Prefer custom hooks for reusable logic
- Avoid over-using effects; consider computed values

#### Event Handling
```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  // Handle click logic
}
```

### Folder Structure

```
src/
├── components/     # Reusable UI components
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── icons.tsx
├── pages/         # Page-level components
│   ├── Dashboard.tsx
│   └── Login.tsx
├── hooks/         # Custom React hooks
│   └── useAuth.ts
├── services/      # External API integrations
│   ├── n8n/
│   └── pocketbase/
├── routes/        # Routing configuration
└── assets/        # Static assets
```

## Component Management

### Component Design Principles
1. **Single Responsibility** - Each component should have one clear purpose
2. **Props Interface** - Always define TypeScript interfaces for props
3. **Default Props** - Use sensible defaults where appropriate
4. **Error Boundaries** - Implement for critical user flows

### Portal Integration
- Use `createPortal` for modals, tooltips, and floating elements
- Always clean up portal roots to prevent memory leaks
- Position portals appropriately using `fixed` or `absolute` positioning

## Tailwind CSS Styling Practices

### Utility Classes Usage
- Use semantic class combinations: `flex items-center justify-between`
- Leverage Tailwind's responsive prefixes: `md:flex-col lg:grid`
- Apply backdrop effects: `backdrop-blur-sm` for overlays
- Use z-index utilities: `z-50` for modals, `z-10` for tooltips

### Common Patterns
```tsx
// Modal backdrop
<div className="fixed inset-0 z-50 backdrop-blur-sm" />

// Floating panels
<div className="absolute z-10 bg-white border rounded-lg shadow-lg" />

// Responsive layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
```

## State Management

### Local State with Hooks
```typescript
const [dialogs, setDialogos] = useState<Dialogo[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

### State Update Patterns
- Use functional updates for state based on previous values
- Prefer immutable updates for complex state
- Handle loading and error states consistently

## Diff Application Best Practices

### Targeted Changes
1. **Read files first** - Always examine current code before applying diffs
2. **Exact matching** - Ensure SEARCH content matches exactly (including whitespace)
3. **Minimal changes** - Apply only necessary modifications
4. **Test after changes** - Verify functionality works as expected

### Diff Structure
```
<<<<<<< SEARCH
:start_line:X
-------
// Existing code to replace
=======
// New code to insert
>>>>>>> REPLACE
```

## Todo List Management

### When to Use Todo Lists
- Complex multi-step tasks
- Features requiring multiple components
- Tasks spanning multiple files
- Any work requiring systematic tracking

### Todo Format
```markdown
- [ ] Task description (pending)
- [x] Task description (completed)
- [-] Task description (in progress)
```

### Update Frequency
- Update status after completing each major step
- Add new todos as dependencies are discovered
- Mark tasks complete only when fully implemented and tested

## Code Quality and Standards

### JavaScript Standard Style
- Use 2 spaces for indentation
- Single quotes for strings
- No semicolons (except where required)
- Space after keywords: `if (condition)`
- Space before function parentheses: `function name ()`

### TypeScript Best Practices
- Strict null checks enabled
- Explicit return types for functions
- Interface definitions for complex objects
- Generic constraints where appropriate
- Avoid `any` type; use proper type definitions

### Naming Conventions
- PascalCase for components and types
- camelCase for variables and functions
- kebab-case for file names
- UPPER_CASE for constants

## Commit Rules

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing related changes
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add login functionality
fix(modal): prevent background scroll when open
docs(readme): update installation instructions
```

## Performance Optimization

### React Performance Tips
1. **Memoization** - Use `React.memo` for expensive components
2. **Callback optimization** - Use `useCallback` for event handlers
3. **Effect optimization** - Proper dependency arrays in `useEffect`
4. **Lazy loading** - Use `React.lazy` for route-based code splitting

### Bundle Optimization
- Tree shaking with modern bundlers
- Dynamic imports for large components
- Image optimization and lazy loading
- Minimize CSS and JavaScript bundles

### Runtime Performance
- Virtual scrolling for large lists
- Debounced search inputs
- Optimized re-renders with proper key props
- Efficient state updates

## Development Workflow

### File Operations
1. **Read before modify** - Always examine existing code
2. **Apply targeted changes** - Use precise diffs for modifications
3. **Test functionality** - Verify changes work as intended
4. **Clean up** - Remove unused imports and dead code

### Error Handling
- Implement proper error boundaries
- Provide user-friendly error messages
- Log errors for debugging
- Graceful fallbacks for failed operations

### Testing Strategy
- Unit tests for utility functions
- Integration tests for component interactions
- E2E tests for critical user flows
- Accessibility testing for inclusive design

## Security Considerations

### Frontend Security
- Sanitize user inputs
- Use HTTPS for all communications
- Implement proper authentication flows
- Avoid storing sensitive data in localStorage
- Validate API responses

### Best Practices
- Regular dependency updates
- Code reviews for security implications
- Proper error message handling
- Secure token management

---

This guide serves as a comprehensive reference for maintaining code quality, following best practices, and ensuring consistent development across the Ecuador Contrapunto project. All AI agents should reference this document when making changes or implementing new features.