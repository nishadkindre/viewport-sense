# API Documentation

## Table of Contents

- [Core API](#core-api)
- [React Hooks](#react-hooks)

- [Configuration](#configuration)
- [TypeScript Types](#typescript-types)
- [CSS Integration](#css-integration)

## Core API

### Factory Functions

#### `breakpoint(config?: ViewportConfig)`

Creates a global breakpoint instance with the specified configuration.

```typescript
import { breakpoint } from 'viewport-sense';

const state = breakpoint.getState();
```

#### `createBreakpointJS(config?: ViewportConfig)`

Creates a new breakpoint instance with custom configuration.

```typescript
import { createBreakpointJS } from 'viewport-sense';

const bp = createBreakpointJS({
  breakpointSystem: 'tailwind',
  debounceDelay: 50,
});
```

### ViewportCore

The core class that manages viewport state and breakpoint detection.

#### Methods

##### `getState(): ViewportState`

Returns the current viewport state.

```typescript
const state = breakpoint.getState();
// {
//   width: 1024,
//   height: 768,
//   breakpoint: 'lg',
//   isMobile: false,
//   isTablet: false,
//   isDesktop: true,
//   isTouch: false,
//   orientation: 'landscape',
//   pixelRatio: 1,
//   safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
// }
```

##### `isMobile(): boolean`

Returns true if the current viewport is considered mobile.

```typescript
if (breakpoint.isMobile()) {
  console.log('Mobile device detected');
}
```

##### `isTablet(): boolean`

Returns true if the current viewport is considered tablet.

##### `isDesktop(): boolean`

Returns true if the current viewport is considered desktop.

##### `isTouch(): boolean`

Returns true if touch input is available.

##### `on(event: string, handler: Function): () => void`

Subscribes to viewport events. Returns an unsubscribe function.

```typescript
const unsubscribe = breakpoint.on('breakpointchange', (newBp, oldBp) => {
  console.log(`Breakpoint changed: ${oldBp} → ${newBp}`);
});

// Later...
unsubscribe();
```

**Available Events:**
- `resize`: Viewport dimensions changed
- `breakpointchange`: Active breakpoint changed
- `orientationchange`: Device orientation changed

##### `destroy(): void`

Cleans up event listeners and resources.

### BreakpointManager

Manages breakpoint queries and media queries.

#### Methods

##### `is(breakpoint: string): boolean`

Checks if the current breakpoint matches the specified one.

```typescript
if (breakpoint.is('lg')) {
  console.log('Large breakpoint active');
}
```

##### `above(breakpoint: string): boolean`

Checks if the current viewport is above the specified breakpoint.

```typescript
if (breakpoint.above('md')) {
  console.log('Viewport is larger than medium');
}
```

##### `below(breakpoint: string): boolean`

Checks if the current viewport is below the specified breakpoint.

```typescript
if (breakpoint.below('xl')) {
  console.log('Viewport is smaller than extra large');
}
```

##### `between(min: string, max: string): boolean`

Checks if the current viewport is between two breakpoints.

```typescript
if (breakpoint.between('sm', 'lg')) {
  console.log('Viewport is between small and large');
}
```

##### `mediaQuery(breakpoint: string): string`

Generates a media query string for the specified breakpoint.

```typescript
const query = breakpoint.mediaQuery('md');
// Returns: "(min-width: 768px)"
```

### DeviceDetector

Provides detailed device and browser information.

#### Methods

##### `getDevice(): DeviceInfo`

Returns comprehensive device information.

```typescript
const device = breakpoint.getDevice();
// {
//   browser: 'Chrome',
//   browserVersion: '91.0.4472.124',
//   os: 'Windows',
//   osVersion: '10.0',
//   isWebView: false,
//   isPWA: false,
//   screenDensity: 'medium',
//   touchPoints: 0,
//   hardwareConcurrency: 8,
//   colorDepth: 24,
//   colorGamut: 'srgb'
// }
```

### AccessibilityDetector

Detects user accessibility preferences.

#### Methods

##### `getA11y(): AccessibilityPreferences`

Returns accessibility preferences.

```typescript
const a11y = breakpoint.getA11y();
// {
//   prefersReducedMotion: false,
//   colorScheme: 'dark',
//   prefersHighContrast: false,
//   prefersReducedData: false,
//   forcedColors: false,
//   hasScreenReader: false
// }
```

## React Hooks

### useViewport()

Returns the current viewport state.

```tsx
import { useViewport } from 'viewport-sense/react';

function MyComponent() {
  const viewport = useViewport();
  
  return (
    <div>
      <p>Width: {viewport.width}px</p>
      <p>Breakpoint: {viewport.breakpoint}</p>
      <p>Is Mobile: {viewport.isMobile ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### useBreakpoint()

Returns the current breakpoint name.

```tsx
import { useBreakpoint } from 'viewport-sense/react';

function MyComponent() {
  const breakpoint = useBreakpoint();
  
  return <div className={`container-${breakpoint}`}>Content</div>;
}
```

### useDevice()

Returns device information.

```tsx
import { useDevice } from 'viewport-sense/react';

function MyComponent() {
  const device = useDevice();
  
  return (
    <div>
      <p>Browser: {device.browser}</p>
      <p>OS: {device.os}</p>
      <p>Is PWA: {device.isPWA ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### useMediaQuery(query: string)

Matches a media query.

```tsx
import { useMediaQuery } from 'viewport-sense/react';

function MyComponent() {
  const isWideScreen = useMediaQuery('(min-width: 1200px)');
  
  return (
    <div>
      {isWideScreen ? 'Wide screen content' : 'Standard content'}
    </div>
  );
}
```

### useBreakpointValue(values: Record<string, T>)

Returns responsive values based on the current breakpoint.

```tsx
import { useBreakpointValue } from 'viewport-sense/react';

function MyComponent() {
  const fontSize = useBreakpointValue({
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px'
  });
  
  return <div style={{ fontSize }}>Responsive text</div>;
}
```

### useElementVisibility(ref: RefObject<Element>)

Tracks element visibility using Intersection Observer.

```tsx
import { useElementVisibility } from 'viewport-sense/react';
import { useRef } from 'react';

function MyComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useElementVisibility(ref);
  
  return (
    <div ref={ref} className={isVisible ? 'fade-in' : 'fade-out'}>
      Content that fades based on visibility
    </div>
  );
}
```

### useScrollPosition()

Tracks scroll position and velocity.

```tsx
import { useScrollPosition } from 'viewport-sense/react';

function MyComponent() {
  const scroll = useScrollPosition();
  
  return (
    <div>
      <p>Scroll Y: {scroll.y}px</p>
      <p>Direction: {scroll.directionY}</p>
      <p>Velocity: {scroll.velocity}px/s</p>
    </div>
  );
}
```

### Additional React Hooks

- `useDeviceType()`: Returns device type (mobile/tablet/desktop)
- `useOrientation()`: Returns screen orientation
- `useColorScheme()`: Returns color scheme preference
- `useReducedMotion()`: Returns reduced motion preference
- `useAccessibility()`: Returns accessibility preferences
- `useSafeArea()`: Returns safe area insets



## Configuration

### ViewportConfig

```typescript
interface ViewportConfig {
  // Breakpoint system to use
  breakpointSystem?: 'bootstrap' | 'tailwind' | 'material' | 'foundation';
  
  // Custom breakpoint definitions
  customBreakpoints?: Record<string, number>;
  
  // Performance settings
  debounceDelay?: number;
  enableRAF?: boolean;
  
  // Feature toggles
  enableTouch?: boolean;
  enableA11y?: boolean;
  enableSafeArea?: boolean;
  
  // CSS integration
  autoCSSVars?: boolean;
  cssVarPrefix?: string;
  cssUtilities?: boolean;
  
  // Device detection
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  
  // Debug mode
  debug?: boolean;
}
```

### Default Configuration

```typescript
const defaultConfig: ViewportConfig = {
  breakpointSystem: 'bootstrap',
  debounceDelay: 100,
  enableRAF: true,
  enableTouch: true,
  enableA11y: true,
  enableSafeArea: true,
  autoCSSVars: true,
  cssVarPrefix: 'bp',
  cssUtilities: true,
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  debug: false,
};
```

### Breakpoint Systems

#### Bootstrap (default)
```typescript
{
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
}
```

#### Tailwind CSS
```typescript
{
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}
```

#### Material Design
```typescript
{
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
}
```

#### Foundation
```typescript
{
  small: 0,
  medium: 640,
  large: 1024,
  xlarge: 1200,
  xxlarge: 1440
}
```

## TypeScript Types

### ViewportState

```typescript
interface ViewportState {
  width: number;
  height: number;
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  safeArea: SafeAreaInsets;
}
```

### DeviceInfo

```typescript
interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  isWebView: boolean;
  isPWA: boolean;
  screenDensity: 'low' | 'medium' | 'high' | 'ultra-high';
  touchPoints: number;
  hardwareConcurrency: number;
  colorDepth: number;
  colorGamut: string;
}
```

### AccessibilityPreferences

```typescript
interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  colorScheme: 'light' | 'dark' | 'no-preference';
  prefersHighContrast: boolean;
  prefersReducedData: boolean;
  forcedColors: boolean;
  hasScreenReader: boolean;
}
```

### SafeAreaInsets

```typescript
interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

### ScrollInfo

```typescript
interface ScrollInfo {
  x: number;
  y: number;
  directionX: 'left' | 'right' | 'none';
  directionY: 'up' | 'down' | 'none';
  velocity: number;
  isNearTop: boolean;
  isNearBottom: boolean;
}
```

### VisibilityInfo

```typescript
interface VisibilityInfo {
  isVisible: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRectReadOnly;
  intersectionRect: DOMRectReadOnly;
  rootBounds: DOMRectReadOnly | null;
  target: Element;
  time: number;
}
```

## CSS Integration

### CSS Custom Properties

When `autoCSSVars` is enabled, viewport-sense automatically generates CSS custom properties:

```css
:root {
  /* Viewport dimensions */
  --bp-width: 1024px;
  --bp-height: 768px;
  
  /* Breakpoint information */
  --bp-breakpoint: lg;
  
  /* Device flags (0 or 1) */
  --bp-is-mobile: 0;
  --bp-is-tablet: 0;
  --bp-is-desktop: 1;
  --bp-is-touch: 0;
  
  /* Safe area insets */
  --bp-safe-top: 0px;
  --bp-safe-right: 0px;
  --bp-safe-bottom: 0px;
  --bp-safe-left: 0px;
  
  /* Device information */
  --bp-pixel-ratio: 1;
  --bp-orientation: landscape;
  
  /* Accessibility */
  --bp-color-scheme: dark;
  --bp-reduced-motion: 0;
  --bp-high-contrast: 0;
}
```

### Utility Classes

```css
/* Device visibility */
.bp-mobile-only { display: none; }
.bp-tablet-only { display: none; }
.bp-desktop-only { display: block; }

@media (max-width: 767px) {
  .bp-mobile-only { display: block; }
  .bp-tablet-only { display: none; }
  .bp-desktop-only { display: none; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .bp-mobile-only { display: none; }
  .bp-tablet-only { display: block; }
  .bp-desktop-only { display: none; }
}

/* Breakpoint utilities */
.bp-sm-up { display: block; }
.bp-md-up { display: none; }
.bp-lg-up { display: none; }

.bp-sm-down { display: block; }
.bp-md-down { display: block; }
.bp-lg-down { display: block; }

/* Safe area utilities */
.bp-safe-padding {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}

.bp-safe-margin {
  margin-top: env(safe-area-inset-top);
  margin-right: env(safe-area-inset-right);
  margin-bottom: env(safe-area-inset-bottom);
  margin-left: env(safe-area-inset-left);
}
```

## Performance Considerations

- **Debouncing**: All resize events are debounced by default (100ms)
- **RequestAnimationFrame**: Enabled by default for smooth updates
- **Passive Event Listeners**: Used where possible for better scroll performance
- **Cleanup**: All event listeners are properly cleaned up
- **Tree Shaking**: Import only what you need to minimize bundle size

## Error Handling

All methods are designed to be safe and handle edge cases gracefully:

- Invalid breakpoint names return sensible defaults
- Missing browser APIs are polyfilled or gracefully degraded
- Network errors in PWA detection are handled silently
- All numeric values have fallbacks for edge cases