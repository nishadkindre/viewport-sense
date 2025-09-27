# Examples

This directory contains example projects demonstrating how to use viewport-sense in different environments and frameworks.

## Available Examples

### 1. Vanilla JavaScript
- **Location**: `./vanilla/`
- **Description**: Pure HTML, CSS, and JavaScript implementation
- **Features**: Complete demo with all viewport-sense features
- **Run**: Open `index.html` in your browser

### 2. React
- **Location**: `./react/`
- **Description**: React application using viewport-sense hooks
- **Features**: All React hooks with TypeScript support
- **Setup**: `cd react && npm install && npm run dev`



## Common Features Demonstrated

All examples demonstrate these core features:

- ✅ **Viewport Detection** - Real-time viewport dimensions and breakpoint detection
- ✅ **Device Classification** - Mobile, tablet, desktop detection
- ✅ **Browser Detection** - Browser type, version, and capabilities
- ✅ **Accessibility Support** - Color scheme, reduced motion, high contrast
- ✅ **Safe Area Detection** - Mobile device safe areas (notches, home indicators)
- ✅ **Scroll Tracking** - Position, direction, and velocity
- ✅ **Element Visibility** - Intersection Observer-based visibility detection
- ✅ **Responsive Values** - Breakpoint-based value switching
- ✅ **CSS Integration** - Automatic CSS custom properties and utility classes
- ✅ **Performance Features** - Debounced events, RequestAnimationFrame optimization

## Quick Start

1. **Vanilla JavaScript**:
   ```bash
   # No setup required
   open ./vanilla/index.html
   ```

2. **React**:
   ```bash
   cd react
   npm install
   npm run dev
   ```



## Code Patterns

### Responsive Design
```javascript
// Vanilla JS
if (breakpoint.above('md')) {
  // Desktop layout
}

// React
const fontSize = useBreakpointValue({
  xs: '14px',
  md: '18px',
  xl: '24px'
});


```

### Device Detection
```javascript
// Vanilla JS
const device = breakpoint.getDevice();
if (device.isMobile) { /* mobile logic */ }

// React
const { isMobile, isTablet } = useViewport();


```

### Element Visibility
```javascript
// Vanilla JS
const visibility = new VisibilityManager();
visibility.observe(element, (info) => {
  console.log('Visible:', info.isVisible);
});

// React
const ref = useRef();
const isVisible = useElementVisibility(ref);


```

## Production Tips

1. **Bundle Size**: Import only what you need for optimal bundle size
2. **Performance**: Use the built-in debouncing and RAF optimizations
3. **SSR**: All examples are SSR-safe
4. **TypeScript**: Full type support in all examples
5. **Accessibility**: Examples demonstrate a11y best practices

## Contributing

Found an issue or want to add a new example? Please see our [Contributing Guide](../CONTRIBUTING.md).

## Support

- [Documentation](../docs/API.md)
- [GitHub Issues](https://github.com/yourusername/viewport-sense/issues)
- [Discussion Forum](https://github.com/yourusername/viewport-sense/discussions)