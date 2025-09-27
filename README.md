# viewport-sense

[![npm version](https://badge.fury.io/js/viewport-sense.svg)](https://www.npmjs.com/package/viewport-sense)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/viewport-sense)](https://bundlephobia.com/package/viewport-sense)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A comprehensive, lightweight viewport utility library for responsive web applications

## ✨ Key Features

- 🎯 **Viewport & Device Detection** - Real-time responsive breakpoints and device classification
- ⚛️ **React Hooks** - Complete React integration with TypeScript support
- 🔧 **Multiple Breakpoint Systems** - Bootstrap, Tailwind, Material Design, or custom
- ♿ **Accessibility Aware** - Respects user preferences for motion, contrast, and color scheme
- 📦 **Zero Dependencies** - Lightweight (~4KB gzipped) with tree-shaking support
- 💎 **TypeScript First** - Full type safety and excellent developer experience

## 📦 Installation

```bash
npm install viewport-sense
```

## 🚀 Quick Start

### Vanilla JavaScript

```javascript
import { createBreakpointJS } from 'viewport-sense';

const viewport = createBreakpointJS();

// Device detection
console.log(viewport.isMobile()); // true/false
console.log(viewport.getBreakpoint()); // 'xs', 'sm', 'md', 'lg', 'xl'

// Listen for changes
viewport.addEventListener('change', (state) => {
  console.log(`Breakpoint: ${state.breakpoint}`);
});
```

### React Hooks

```jsx
import { useViewport, useBreakpoint } from 'viewport-sense/react';

function MyComponent() {
  const { isMobile, isTablet, width } = useViewport();
  const breakpoint = useBreakpoint();

  return (
    <div>
      <p>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</p>
      <p>Breakpoint: {breakpoint} ({width}px)</p>
    </div>
  );
}
```



## ⚙️ Configuration

```javascript
import { createBreakpointJS } from 'viewport-sense';

const viewport = createBreakpointJS({
  breakpointSystem: 'tailwind', // 'bootstrap', 'tailwind', 'material', 'foundation'
  debounceDelay: 100,
  enableA11y: true,
  autoCSSVars: true,
});
```

**Breakpoint Systems:**
- `bootstrap` - xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400
- `tailwind` - sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536
- `material` - xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920
- Custom breakpoints supported

## 📖 API Overview

### Core Methods
- `viewport.getBreakpoint()` - Current breakpoint name
- `viewport.isMobile/isTablet/isDesktop()` - Device type detection
- `viewport.getState()` - Complete viewport state
- `viewport.addEventListener()` - Listen for changes

### React Hooks
- `useViewport()` - Viewport dimensions and device info
- `useBreakpoint()` - Current breakpoint
- `useDevice()` - Browser and OS detection
- `useScrollPosition()` - Scroll tracking
- `useElementVisibility()` - Intersection observer
- `useMediaQuery()` - Media query matching
- `useAccessibility()` - User preferences

> 📚 **Complete API Documentation:** [docs/API.md](./docs/API.md)



## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Reference](./docs/API.md) | Complete API documentation with examples |
| [Installation Guide](./docs/INSTALL.md) | Setup, development environment, and troubleshooting |
| [Local Testing](./docs/LOCAL-TESTING.md) | How to test the package locally before publishing |
| [Publishing Guide](./docs/PUBLISHING.md) | Step-by-step publishing instructions |
| [Examples](./examples/) | Working examples for vanilla JS and React |

## 🌍 Browser Support

Modern browsers with ES2018+ support:
- Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- Mobile: iOS Safari 12+, Android Chrome 70+

## 📦 Bundle Size

- Core: ~4KB gzipped
- Full features: ~12KB gzipped  
- Tree-shakeable for optimal bundles

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 📞 Support

- [GitHub Issues](https://github.com/nishadkindre/viewport-sense/issues) - Bug reports and feature requests
- [Documentation](./docs/API.md) - Complete API reference
- [Examples](./examples/) - Working code examples

---

Made with ❤️ for the web development community