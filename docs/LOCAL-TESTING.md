# Local Testing Guide

Quick guide to test this package in a local React project before publishing.

## Method 1: npm link (Recommended)

### 1. Link the package
```bash
# In your viewport-sense directory
npm run build
npm link
```

### 2. Use in your React project
```bash
# In your React project directory
npm link viewport-sense
```

### 3. Test in your React component
```tsx
// App.tsx
import { 
  useBreakpoint, 
  useViewport, 
  useDevice,
  useScrollPosition 
} from 'viewport-sense/react';

function App() {
  const breakpoint = useBreakpoint();
  const viewport = useViewport();
  const device = useDevice();
  const scroll = useScrollPosition();
  
  // ✅ Correct: Destructure individual properties with fallbacks
  const { isMobile, isTablet, isDesktop, width, height } = viewport;

  return (
    <div>
      <h1>Testing viewport-sense</h1>
      <p>Current breakpoint: {breakpoint}</p>
      <p>Is mobile: {isMobile ? 'Yes' : 'No'}</p>
      <p>Is tablet: {isTablet ? 'Yes' : 'No'}</p>
      <p>Is desktop: {isDesktop ? 'Yes' : 'No'}</p>
      <p>Viewport: {width} x {height}</p>
      
      {/* ✅ Safe object property access */}
      <p>Browser: {device?.browser || 'Unknown'}</p>
      <p>Scroll Y: {Math.round(scroll?.y || 0)}px</p>
      
      {/* ❌ Wrong: Don't render objects directly */}
      {/* <p>{viewport}</p> This will cause an error! */}
      {/* <p>{device}</p> This will also cause an error! */}
    </div>
  );
}
```

### 4. Clean up when done
```bash
# In your React project
npm unlink viewport-sense

# In viewport-sense directory
npm unlink
```

## Method 2: File path install

### 1. Build the package
```bash
# In viewport-sense directory
npm run build
```

### 2. Install from file path
```bash
# In your React project directory
npm install ../path/to/viewport-sense
```

## Testing Tips

- **Resize your browser** to test different breakpoints
- **Use developer tools** to simulate mobile devices
- **Check console** for any errors or warnings
- **Test TypeScript** intellisense and auto-completion

## Troubleshooting

### Common Issues

**"Objects are not valid as a React child" error:**
```tsx
// ❌ Wrong - renders object directly
const viewport = useViewport();
return <p>{viewport}</p>; // Error!

// ✅ Correct - use individual properties
const { isMobile } = useViewport();
return <p>Mobile: {isMobile ? 'Yes' : 'No'}</p>; // Works!
```

**"Expected ref to be a function, an object returned by React.createRef(), or undefined/null" error:**
```tsx
// ❌ Wrong - calling hooks inside map/loops
const refs = [useRef(null), useRef(null)]; // Error!
const visibilities = refs.map(ref => useElementVisibility(ref)); // Error!

// ✅ Correct - call hooks at top level
const ref1 = useRef(null);
const ref2 = useRef(null);
const isVisible1 = useElementVisibility(ref1);
const isVisible2 = useElementVisibility(ref2);
```

**Other Issues:**
- If changes don't reflect, run `npm run build` again
- For npm link issues, try `npm unlink` and `npm link` again
- Make sure React version is compatible (>= 16.8.0)
- Check browser console for detailed error messages