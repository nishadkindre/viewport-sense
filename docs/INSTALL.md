# Installation & Setup Guide

This guide provides comprehensive instructions for setting up the viewport-sense development environment and using the package in your projects.

## Installation for Users

### NPM
```bash
npm install viewport-sense
```

### Yarn
```bash
yarn add viewport-sense
```

### PNPM
```bash
pnpm add viewport-sense
```

## Basic Usage

### Vanilla JavaScript/TypeScript

```typescript
import { createBreakpointJS } from 'viewport-sense';

const viewport = createBreakpointJS();

// Get current breakpoint
console.log(viewport.getBreakpoint()); // 'lg'

// Check device type
console.log(viewport.isMobile()); // false

// Listen for changes
viewport.addEventListener('change', (state) => {
  console.log('Viewport changed:', state.breakpoint);
});
```

### React Integration

```tsx
import { useBreakpoint, useViewport } from 'viewport-sense/react';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  const { isMobile, isTablet } = useViewport();

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      <p>Is mobile: {isMobile ? 'Yes' : 'No'}</p>
      <p>Is tablet: {isTablet ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## Development Setup

This section is for contributors and developers who want to work on the viewport-sense package itself.

### Prerequisites

- **Node.js**: >= 14.0.0 (recommended: latest LTS)
- **npm**: >= 6.0.0 (comes with Node.js)
- **Git**: For version control

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/nishadkindre/viewport-sense.git
cd viewport-sense

# Install dependencies
npm install
```

### Development Dependencies

The project uses these main development tools:

- **TypeScript**: For type safety and modern JavaScript features
- **Rollup**: For building multiple module formats (ESM, CJS, UMD)
- **Jest**: For testing with jsdom environment
- **ESLint + Prettier**: For code quality and formatting
- **Husky**: For git hooks and pre-commit quality checks

### Available Scripts

#### Building

```bash
# Build all formats (ESM, CJS, UMD)
npm run build

# Build in watch mode for development
npm run build:dev
```

#### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without building
npm run type-check
```

#### Utility Scripts

```bash
# Clean build directory
npm run clean

# Run build in development mode
npm run dev

# Pre-publish checks (clean + build + test)
npm run prepublishOnly
```

### Build Output

The build process creates the following files in the `dist/` directory:

```
dist/
├── index.js          # CommonJS build
├── index.mjs         # ES Module build
├── index.umd.js      # UMD build for browsers
├── react.js          # React integration (CJS)
├── react.mjs         # React integration (ESM)
└── types/            # TypeScript declarations
    ├── index.d.ts
    └── integrations/
        └── react.d.ts
```

### Testing Configuration

Tests are configured with:

- **jsdom environment** for browser API simulation
- **TypeScript support** via ts-jest
- **Coverage reporting** with HTML and LCOV formats
- **Setup file** for global test configuration

### Code Quality Standards

The project enforces:

- **TypeScript strict mode** with comprehensive type checking
- **Prettier formatting** with consistent style
- **ESLint rules** for code quality and best practices
- **80% test coverage** target
- **Pre-commit hooks** for automatic quality checks

### Troubleshooting

#### Common Issues

1. **Build fails with module errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Tests fail with DOM API errors**
   - Ensure jsdom is properly configured in jest.config.js
   - Check that setup.ts is properly loaded

3. **ESLint TypeScript version warnings**
   - These are warnings only and don't affect functionality
   - The project uses newer TypeScript features that work fine

4. **Windows line ending issues**
   ```bash
   # Auto-fix with prettier
   npm run format
   ```

#### Environment Variables

```bash
# Production build
NODE_ENV=production npm run build

# Development mode
NODE_ENV=development npm run build:dev
```

### Contributing Workflow

1. **Fork and clone** the repository
2. **Create a feature branch** from main
3. **Install dependencies** with `npm install`
4. **Make your changes** following the code style
5. **Run tests** with `npm test`
6. **Check code quality** with `npm run lint`
7. **Build the project** with `npm run build`
8. **Commit with conventional commits** format
9. **Push and create a pull request**

### Package Structure

```
viewport-sense/
├── src/                    # Source code
│   ├── core/              # Core viewport and event classes
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── integrations/      # Framework integrations
│   ├── breakpoints/       # Breakpoint presets and management
│   └── __tests__/         # Test files
├── examples/              # Usage examples
│   ├── vanilla/           # Vanilla JS examples
│   └── react/             # React examples
├── docs/                  # Documentation
├── dist/                  # Build output (generated)
└── [config files]        # Various configuration files
```

### Compatibility

- **Node.js**: >= 14.0.0
- **TypeScript**: >= 4.5.0
- **React**: >= 16.8.0 (optional peer dependency)
- **Browsers**: Modern browsers with ES2018+ support

### Support

For questions or issues:

1. Check this installation guide
2. Review the [API documentation](./docs/API.md)
3. Look at [examples](./examples/)
4. Create an issue on GitHub with detailed reproduction steps

## License

MIT License - see [LICENSE](./LICENSE) file for details.