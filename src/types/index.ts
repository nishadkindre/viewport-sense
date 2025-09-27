/**
 * Core viewport state interface
 */
export interface ViewportState {
  /** Current viewport width in pixels */
  width: number;
  /** Current viewport height in pixels */
  height: number;
  /** Current breakpoint name */
  breakpoint: string;
  /** True if device is classified as mobile */
  isMobile: boolean;
  /** True if device is classified as tablet */
  isTablet: boolean;
  /** True if device is classified as desktop */
  isDesktop: boolean;
  /** True if device supports touch input */
  isTouch: boolean;
  /** Current device orientation */
  orientation: 'portrait' | 'landscape';
  /** Device pixel ratio */
  pixelRatio: number;
  /** Available screen width (excludes system UI) */
  availableWidth: number;
  /** Available screen height (excludes system UI) */
  availableHeight: number;
}

/**
 * Viewport configuration options
 */
export interface ViewportConfig {
  /** Custom breakpoint definitions */
  breakpoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  /** Debounce delay for resize events in milliseconds */
  debounceDelay?: number;
  /** Enable touch detection */
  enableTouch?: boolean;
  /** Enable high DPI detection */
  enableHighDPI?: boolean;
  /** Custom breakpoint definitions with any names */
  customBreakpoints?: Record<string, number>;
}

/**
 * Device information interface
 */
export interface DeviceInfo {
  /** Browser name (Chrome, Firefox, Safari, Edge, etc.) */
  browser: string;
  /** Browser version string */
  browserVersion: string;
  /** Operating system name */
  os: string;
  /** Operating system version */
  osVersion: string;
  /** True if running in a WebView */
  isWebView: boolean;
  /** True if running as a PWA */
  isPWA: boolean;
  /** Screen density classification */
  screenDensity: 'low' | 'medium' | 'high' | 'ultra';
  /** Maximum number of touch points */
  touchPoints: number;
  /** Number of logical processors */
  hardwareConcurrency: number;
  /** Color depth in bits */
  colorDepth: number;
  /** Color gamut capability */
  colorGamut: string;
}

/**
 * Accessibility preferences interface
 */
export interface AccessibilityPreferences {
  /** User prefers reduced motion */
  prefersReducedMotion: boolean;
  /** User's color scheme preference */
  colorScheme: 'light' | 'dark' | 'no-preference';
  /** User prefers high contrast */
  prefersHighContrast: boolean;
  /** User prefers reduced data usage */
  prefersReducedData: boolean;
  /** System is using forced colors mode */
  forcedColors: boolean;
  /** Approximate screen reader detection */
  hasScreenReader: boolean;
}

/**
 * Safe area insets interface
 */
export interface SafeAreaInsets {
  /** Top safe area inset in pixels */
  top: number;
  /** Right safe area inset in pixels */
  right: number;
  /** Bottom safe area inset in pixels */
  bottom: number;
  /** Left safe area inset in pixels */
  left: number;
}

/**
 * Breakpoint system configuration
 */
export interface BreakpointSystem {
  /** System name for identification */
  name: string;
  /** Breakpoint definitions */
  breakpoints: Record<string, number>;
  /** Unit used for breakpoints */
  unit: 'px' | 'em' | 'rem';
}

/**
 * Scroll position interface
 */
export interface ScrollPosition {
  /** Horizontal scroll position */
  x: number;
  /** Vertical scroll position */
  y: number;
  /** Scroll direction on X axis */
  directionX: 'left' | 'right' | 'none';
  /** Scroll direction on Y axis */
  directionY: 'up' | 'down' | 'none';
  /** Scroll velocity in pixels per second */
  velocity: number;
  /** True if near top of scrollable area */
  isNearTop: boolean;
  /** True if near bottom of scrollable area */
  isNearBottom: boolean;
}

/**
 * Element visibility information
 */
export interface VisibilityInfo {
  /** True if element is visible in viewport */
  isVisible: boolean;
  /** Intersection ratio (0-1) */
  intersectionRatio: number;
  /** Intersection rectangle */
  intersectionRect: DOMRectReadOnly;
  /** Target element bounds */
  boundingClientRect: DOMRectReadOnly;
  /** Root bounds (usually viewport) */
  rootBounds: DOMRectReadOnly | null;
}

/**
 * Main configuration interface for BreakpointJS
 */
export interface BreakpointJSConfig {
  // Breakpoint system
  /** Predefined breakpoint system to use */
  breakpointSystem?: 'bootstrap' | 'tailwind' | 'material' | 'foundation' | 'custom';
  /** Custom breakpoint definitions */
  customBreakpoints?: Record<string, number>;
  /** Unit for breakpoint values */
  breakpointUnit?: 'px' | 'em' | 'rem';

  // Performance
  /** Debounce delay for resize events */
  debounceDelay?: number;
  /** Enable RequestAnimationFrame for smooth updates */
  enableRAF?: boolean;
  /** Use passive event listeners where possible */
  enablePassiveListeners?: boolean;

  // Features
  /** Enable touch detection */
  enableTouch?: boolean;
  /** Enable high DPI detection */
  enableHighDPI?: boolean;
  /** Enable accessibility features */
  enableA11y?: boolean;
  /** Enable safe area detection */
  enableSafeArea?: boolean;
  /** Enable device detection */
  enableDeviceDetection?: boolean;

  // CSS Integration
  /** Automatically generate CSS custom properties */
  autoCSSVars?: boolean;
  /** Prefix for CSS custom properties */
  cssVarPrefix?: string;
  /** Enable container query helpers */
  enableContainerQueries?: boolean;

  // Debug
  /** Enable debug mode */
  debug?: boolean;
  /** Logging level */
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Event listener callback types
 */
export type ViewportEventCallback = (state: ViewportState) => void;
export type BreakpointEventCallback = (breakpoint: string, previousBreakpoint: string) => void;
export type OrientationEventCallback = (orientation: 'portrait' | 'landscape') => void;
export type ScrollEventCallback = (position: ScrollPosition) => void;
export type VisibilityEventCallback = (info: VisibilityInfo) => void;

/**
 * Event types supported by the library
 */
export type EventType =
  | 'resize'
  | 'orientationchange'
  | 'breakpointchange'
  | 'touchchange'
  | 'scroll'
  | 'visibility';

/**
 * Generic event callback type
 */
export type EventCallback =
  | ViewportEventCallback
  | BreakpointEventCallback
  | OrientationEventCallback
  | ScrollEventCallback
  | VisibilityEventCallback;

/**
 * Unsubscribe function type
 */
export type UnsubscribeFunction = () => void;

/**
 * Breakpoint query methods interface
 */
export interface BreakpointQueries {
  /** Check if current breakpoint matches */
  is(breakpoint: string): boolean;
  /** Check if viewport is above breakpoint */
  above(breakpoint: string): boolean;
  /** Check if viewport is below breakpoint */
  below(breakpoint: string): boolean;
  /** Check if viewport is between two breakpoints */
  between(min: string, max: string): boolean;
  /** Generate CSS media query for breakpoint */
  mediaQuery(breakpoint: string): string;
}

/**
 * CSS utilities interface
 */
export interface CSSUtilities {
  /** Generate CSS custom properties */
  generateCustomProperties(): Record<string, string>;
  /** Update CSS custom properties in document */
  updateCustomProperties(): void;
  /** Generate container query helper classes */
  generateContainerQueries(): string;
  /** Generate responsive utility classes */
  generateUtilityClasses(): string;
}

/**
 * Main BreakpointJS instance interface
 */
export interface BreakpointJSInstance {
  /** Core viewport functionality */
  readonly viewport: ViewportCore;
  /** Device detection utilities */
  readonly device: DeviceDetector;
  /** Accessibility feature detection */
  readonly accessibility: AccessibilityDetector;
  /** Safe area management */
  readonly safeArea: SafeAreaManager;
  /** Breakpoint management */
  readonly breakpoints: BreakpointManager;
  /** Scroll utilities */
  readonly scroll: ScrollManager;
  /** Visibility management */
  readonly visibility: VisibilityManager;
  /** CSS integration utilities */
  readonly css: CSSUtilities;

  /** Get current viewport state */
  getState(): ViewportState;
  /** Clean up instance and remove listeners */
  destroy(): void;
}

/**
 * Forward declarations for core classes
 */
export interface ViewportCore {
  getState(): ViewportState;
  isMobile(): boolean;
  isTablet(): boolean;
  isDesktop(): boolean;
  isTouch(): boolean;
  getBreakpoint(): string;
  on(event: EventType, callback: EventCallback): UnsubscribeFunction;
  off(event: EventType, callback: EventCallback): void;
  destroy(): void;
}

export interface DeviceDetector {
  getDeviceInfo(): DeviceInfo;
  getBrowser(): { name: string; version: string };
  getOS(): { name: string; version: string };
  isWebView(): boolean;
  isPWA(): boolean;
  getScreenDensity(): 'low' | 'medium' | 'high' | 'ultra';
}

export interface AccessibilityDetector {
  getPreferences(): AccessibilityPreferences;
  prefersReducedMotion(): boolean;
  getColorScheme(): 'light' | 'dark' | 'no-preference';
  prefersHighContrast(): boolean;
  prefersReducedData(): boolean;
  hasForcedColors(): boolean;
  hasScreenReader(): boolean;
}

export interface SafeAreaManager {
  getInsets(): SafeAreaInsets;
  hasNotch(): boolean;
  hasDynamicIsland(): boolean;
  on(event: 'change', callback: (insets: SafeAreaInsets) => void): UnsubscribeFunction;
}

export interface BreakpointManager extends BreakpointQueries {
  getBreakpoints(): Record<string, number>;
  getCurrentBreakpoint(): string;
  watchBreakpoint(name: string, callback: (matches: boolean) => void): UnsubscribeFunction;
}

export interface ScrollManager {
  getPosition(): ScrollPosition;
  on(event: 'scroll', callback: ScrollEventCallback): UnsubscribeFunction;
  isNearTop(threshold?: number): boolean;
  isNearBottom(threshold?: number): boolean;
}

export interface VisibilityManager {
  observe(element: Element, callback: VisibilityEventCallback): UnsubscribeFunction;
  unobserve(element: Element): void;
  isVisible(element: Element): boolean;
  getVisibilityInfo(element: Element): VisibilityInfo | null;
}
