import type {
  ViewportState,
  ViewportConfig,
  ViewportCore as IViewportCore,
  EventType,
  EventCallback,
  UnsubscribeFunction,
} from '../types';
import { EventManager } from './events';

/**
 * Default breakpoint configuration (Bootstrap-style)
 */
const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<ViewportConfig> = {
  breakpoints: DEFAULT_BREAKPOINTS,
  debounceDelay: 100,
  enableTouch: true,
  enableHighDPI: true,
  customBreakpoints: {},
};

/**
 * Core viewport detection and management class
 */
export class ViewportCore implements IViewportCore {
  private config: Required<ViewportConfig>;
  private eventManager: EventManager;
  private currentState: ViewportState | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mediaQueryLists: Map<string, MediaQueryList> = new Map();
  private isDestroyed = false;

  constructor(config: ViewportConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.eventManager = new EventManager();

    this.initialize();
  }

  /**
   * Initialize viewport detection
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      return; // SSR safety
    }

    this.setupEventListeners();
    this.setupMediaQueries();
    this.updateState();
  }

  /**
   * Set up event listeners for viewport changes
   */
  private setupEventListeners(): void {
    const debouncedUpdate = this.eventManager.debounce(
      () => this.updateState(),
      this.config.debounceDelay
    );

    // Resize observer for more accurate resize detection
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.eventManager.scheduleRAF(() => this.updateState());
      });
      this.resizeObserver.observe(document.documentElement);
    } else {
      // Fallback to resize event
      window.addEventListener('resize', debouncedUpdate, { passive: true });
    }

    // Orientation change
    window.addEventListener(
      'orientationchange',
      () => {
        // Delay to allow for orientation change to complete
        setTimeout(() => this.updateState(), 100);
      },
      { passive: true }
    );

    // Visual viewport changes (mobile keyboards, etc.)
    if (
      typeof VisualViewport !== 'undefined' &&
      'visualViewport' in window &&
      window.visualViewport
    ) {
      (window.visualViewport as VisualViewport).addEventListener('resize', debouncedUpdate, {
        passive: true,
      });
    }
  }

  /**
   * Set up media query listeners for breakpoint changes
   */
  private setupMediaQueries(): void {
    const allBreakpoints = { ...this.config.breakpoints, ...this.config.customBreakpoints };

    Object.entries(allBreakpoints).forEach(([name, value]) => {
      const mediaQuery = `(min-width: ${value}px)`;
      const mql = window.matchMedia(mediaQuery);

      mql.addEventListener('change', () => {
        this.eventManager.scheduleRAF(() => this.updateState());
      });

      this.mediaQueryLists.set(name, mql);
    });
  }

  /**
   * Update current viewport state
   */
  private updateState(): void {
    if (this.isDestroyed || typeof window === 'undefined') {
      return;
    }

    const previousState = this.currentState;
    const newState = this.calculateState();

    this.currentState = newState;

    // Emit events if state changed
    if (previousState) {
      this.emitChangeEvents(previousState, newState);
    }

    this.eventManager.emit('resize', newState);
  }

  /**
   * Calculate current viewport state
   */
  private calculateState(): ViewportState {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = this.config.enableHighDPI ? window.devicePixelRatio || 1 : 1;

    // Available dimensions (excluding browser UI)
    const availableWidth = window.screen?.availWidth ?? width;
    const availableHeight = window.screen?.availHeight ?? height;

    // Device classification
    const isMobile = this.calculateIsMobile(width);
    const isTablet = this.calculateIsTablet(width);
    const isDesktop = !isMobile && !isTablet;

    // Touch detection
    const isTouch = this.config.enableTouch ? this.detectTouch() : false;

    // Orientation
    const orientation = width > height ? 'landscape' : 'portrait';

    // Current breakpoint
    const breakpoint = this.calculateBreakpoint(width);

    return {
      width,
      height,
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      isTouch,
      orientation,
      pixelRatio,
      availableWidth,
      availableHeight,
    };
  }

  /**
   * Calculate if device is mobile based on width
   */
  private calculateIsMobile(width: number): boolean {
    const mdBreakpoint = this.config.breakpoints.md ?? DEFAULT_BREAKPOINTS.md;
    return width < mdBreakpoint;
  }

  /**
   * Calculate if device is tablet based on width
   */
  private calculateIsTablet(width: number): boolean {
    const mdBreakpoint = this.config.breakpoints.md ?? DEFAULT_BREAKPOINTS.md;
    const lgBreakpoint = this.config.breakpoints.lg ?? DEFAULT_BREAKPOINTS.lg;
    return width >= mdBreakpoint && width < lgBreakpoint;
  }

  /**
   * Detect touch capability
   */
  private detectTouch(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - Legacy IE support
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Calculate current breakpoint based on width
   */
  private calculateBreakpoint(width: number): string {
    const allBreakpoints = { ...this.config.breakpoints, ...this.config.customBreakpoints };
    const sortedBreakpoints = Object.entries(allBreakpoints).sort(([, a], [, b]) => b - a); // Sort descending

    for (const [name, value] of sortedBreakpoints) {
      if (width >= value) {
        return name;
      }
    }

    // Return the smallest breakpoint if no match
    const smallestBreakpoint = Object.entries(allBreakpoints).sort(([, a], [, b]) => a - b)[0];

    return smallestBreakpoint?.[0] ?? 'xs';
  }

  /**
   * Emit change events when state changes
   */
  private emitChangeEvents(previousState: ViewportState, newState: ViewportState): void {
    // Breakpoint change
    if (previousState.breakpoint !== newState.breakpoint) {
      this.eventManager.emit('breakpointchange', newState.breakpoint, previousState.breakpoint);
    }

    // Orientation change
    if (previousState.orientation !== newState.orientation) {
      this.eventManager.emit('orientationchange', newState.orientation);
    }

    // Touch capability change (rare but possible)
    if (previousState.isTouch !== newState.isTouch) {
      this.eventManager.emit('touchchange', newState.isTouch);
    }
  }

  /**
   * Get current viewport state
   */
  public getState(): ViewportState {
    if (!this.currentState) {
      this.updateState();
    }
    return this.currentState!;
  }

  /**
   * Check if current viewport is mobile
   */
  public isMobile(): boolean {
    return this.getState().isMobile;
  }

  /**
   * Check if current viewport is tablet
   */
  public isTablet(): boolean {
    return this.getState().isTablet;
  }

  /**
   * Check if current viewport is desktop
   */
  public isDesktop(): boolean {
    return this.getState().isDesktop;
  }

  /**
   * Check if device supports touch
   */
  public isTouch(): boolean {
    return this.getState().isTouch;
  }

  /**
   * Get current breakpoint name
   */
  public getBreakpoint(): string {
    return this.getState().breakpoint;
  }

  /**
   * Add event listener
   */
  public on(event: EventType, callback: EventCallback): UnsubscribeFunction {
    return this.eventManager.on(event, callback);
  }

  /**
   * Remove event listener
   */
  public off(event: EventType, callback: EventCallback): void {
    this.eventManager.off(event, callback);
  }

  /**
   * Clean up and destroy instance
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;

    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up media query listeners
    this.mediaQueryLists.clear();

    // Clean up event manager
    this.eventManager.destroy();

    // Clear state
    this.currentState = null;
  }

  /**
   * Check if instance is destroyed
   */
  public isDestroyed_(): boolean {
    return this.isDestroyed;
  }
}
