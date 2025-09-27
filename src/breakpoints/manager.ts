import type {
  BreakpointManager as IBreakpointManager,
  BreakpointSystem,
  UnsubscribeFunction,
} from '../types';
import { PRESET_BREAKPOINTS, getBreakpointSystem } from './presets';

/**
 * Breakpoint management system
 */
export class BreakpointManager implements IBreakpointManager {
  private breakpointSystem: BreakpointSystem;
  private mediaQueryLists: Map<string, MediaQueryList> = new Map();
  private watchers: Map<string, Set<(matches: boolean) => void>> = new Map();
  private currentBreakpoint: string | null = null;

  constructor(system?: BreakpointSystem | keyof typeof PRESET_BREAKPOINTS) {
    if (typeof system === 'string') {
      this.breakpointSystem = getBreakpointSystem(system);
    } else if (system) {
      this.breakpointSystem = system;
    } else {
      this.breakpointSystem = PRESET_BREAKPOINTS.bootstrap;
    }

    this.initialize();
  }

  /**
   * Initialize breakpoint manager
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      return; // SSR safety
    }

    this.setupMediaQueries();
    this.updateCurrentBreakpoint();
  }

  /**
   * Set up media query listeners
   */
  private setupMediaQueries(): void {
    Object.entries(this.breakpointSystem.breakpoints).forEach(([name, value]) => {
      const mediaQuery = this.generateMediaQuery(name, value);
      const mql = window.matchMedia(mediaQuery);

      mql.addEventListener('change', event => {
        this.handleMediaQueryChange(name, event.matches);
      });

      this.mediaQueryLists.set(name, mql);
    });
  }

  /**
   * Generate media query string for breakpoint
   */
  private generateMediaQuery(_name: string, value: number): string {
    const unit = this.breakpointSystem.unit;

    // For the smallest breakpoint (usually 0), we don't need a min-width
    if (value === 0) {
      return 'all';
    }

    return `(min-width: ${value}${unit})`;
  }

  /**
   * Handle media query changes
   */
  private handleMediaQueryChange(breakpointName: string, matches: boolean): void {
    // Update current breakpoint
    this.updateCurrentBreakpoint();

    // Notify watchers
    const watchers = this.watchers.get(breakpointName);
    if (watchers) {
      watchers.forEach(callback => {
        try {
          callback(matches);
        } catch (error) {
          console.error(`Error in breakpoint watcher for '${breakpointName}':`, error);
        }
      });
    }
  }

  /**
   * Update current breakpoint based on window width
   */
  private updateCurrentBreakpoint(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const width = window.innerWidth;
    const sortedBreakpoints = Object.entries(this.breakpointSystem.breakpoints).sort(
      ([, a], [, b]) => b - a
    ); // Sort descending

    for (const [name, value] of sortedBreakpoints) {
      if (width >= value) {
        this.currentBreakpoint = name;
        return;
      }
    }

    // Fallback to smallest breakpoint
    const smallestBreakpoint = Object.entries(this.breakpointSystem.breakpoints).sort(
      ([, a], [, b]) => a - b
    )[0];

    this.currentBreakpoint = smallestBreakpoint?.[0] ?? null;
  }

  /**
   * Get all breakpoints
   */
  public getBreakpoints(): Record<string, number> {
    return { ...this.breakpointSystem.breakpoints };
  }

  /**
   * Get current breakpoint name
   */
  public getCurrentBreakpoint(): string {
    if (!this.currentBreakpoint) {
      this.updateCurrentBreakpoint();
    }
    return this.currentBreakpoint ?? '';
  }

  /**
   * Check if current breakpoint matches
   */
  public is(breakpoint: string): boolean {
    return this.getCurrentBreakpoint() === breakpoint;
  }

  /**
   * Check if viewport is above breakpoint
   */
  public above(breakpoint: string): boolean {
    const breakpointValue = this.breakpointSystem.breakpoints[breakpoint];
    if (breakpointValue === undefined) {
      console.warn(`Breakpoint '${breakpoint}' not found`);
      return false;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth > breakpointValue;
  }

  /**
   * Check if viewport is below breakpoint
   */
  public below(breakpoint: string): boolean {
    const breakpointValue = this.breakpointSystem.breakpoints[breakpoint];
    if (breakpointValue === undefined) {
      console.warn(`Breakpoint '${breakpoint}' not found`);
      return false;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    return window.innerWidth < breakpointValue;
  }

  /**
   * Check if viewport is between two breakpoints
   */
  public between(min: string, max: string): boolean {
    const minValue = this.breakpointSystem.breakpoints[min];
    const maxValue = this.breakpointSystem.breakpoints[max];

    if (minValue === undefined) {
      console.warn(`Breakpoint '${min}' not found`);
      return false;
    }

    if (maxValue === undefined) {
      console.warn(`Breakpoint '${max}' not found`);
      return false;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    const width = window.innerWidth;
    return width >= minValue && width < maxValue;
  }

  /**
   * Generate CSS media query for breakpoint
   */
  public mediaQuery(breakpoint: string): string {
    const breakpointValue = this.breakpointSystem.breakpoints[breakpoint];
    if (breakpointValue === undefined) {
      console.warn(`Breakpoint '${breakpoint}' not found`);
      return '';
    }

    return this.generateMediaQuery(breakpoint, breakpointValue);
  }

  /**
   * Watch specific breakpoint for changes
   */
  public watchBreakpoint(name: string, callback: (matches: boolean) => void): UnsubscribeFunction {
    if (!this.breakpointSystem.breakpoints[name]) {
      console.warn(`Breakpoint '${name}' not found`);
      return (): void => {
        // No-op
      };
    }

    if (!this.watchers.has(name)) {
      this.watchers.set(name, new Set());
    }

    this.watchers.get(name)!.add(callback);

    // Call immediately with current state
    const mql = this.mediaQueryLists.get(name);
    if (mql) {
      callback(mql.matches);
    }

    return (): void => {
      const watchers = this.watchers.get(name);
      if (watchers) {
        watchers.delete(callback);
        if (watchers.size === 0) {
          this.watchers.delete(name);
        }
      }
    };
  }

  /**
   * Get breakpoint value by name
   */
  public getBreakpointValue(name: string): number | undefined {
    return this.breakpointSystem.breakpoints[name];
  }

  /**
   * Get sorted breakpoints (ascending)
   */
  public getSortedBreakpoints(): Array<{ name: string; value: number }> {
    return Object.entries(this.breakpointSystem.breakpoints)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.value - b.value);
  }

  /**
   * Get breakpoint system info
   */
  public getSystemInfo(): BreakpointSystem {
    return { ...this.breakpointSystem };
  }

  /**
   * Update breakpoint system
   */
  public updateSystem(system: BreakpointSystem | keyof typeof PRESET_BREAKPOINTS): void {
    // Clean up existing media queries
    this.destroy();

    // Set new system
    if (typeof system === 'string') {
      this.breakpointSystem = getBreakpointSystem(system);
    } else {
      this.breakpointSystem = system;
    }

    // Reinitialize
    this.initialize();
  }

  /**
   * Generate CSS classes for all breakpoints
   */
  public generateCSSClasses(prefix = 'bp'): string {
    const classes: string[] = [];

    Object.entries(this.breakpointSystem.breakpoints).forEach(([name]) => {
      const mediaQuery = this.mediaQuery(name);
      if (mediaQuery && mediaQuery !== 'all') {
        classes.push(`@media ${mediaQuery} { .${prefix}-${name} { display: block; } }`);
        classes.push(`@media ${mediaQuery} { .${prefix}-${name}-hidden { display: none; } }`);
      }
    });

    return classes.join('\n');
  }

  /**
   * Get all matching breakpoints for current viewport
   */
  public getMatchingBreakpoints(): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const width = window.innerWidth;
    return Object.entries(this.breakpointSystem.breakpoints)
      .filter(([, value]) => width >= value)
      .map(([name]) => name);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Clear media query listeners
    // Note: We can't remove specific listeners without references,
    // but MediaQueryList objects will be garbage collected
    this.mediaQueryLists.clear();
    this.watchers.clear();
    this.currentBreakpoint = null;
  }
}
