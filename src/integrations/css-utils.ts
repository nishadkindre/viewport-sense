import type { CSSUtilities } from '../types';
import { BreakpointManager } from '../breakpoints/manager';
import { ViewportCore } from '../core/viewport';
import { SafeAreaManager } from '../utils/safe-area';

/**
 * CSS integration utilities for responsive design
 */
export class CSSIntegration implements CSSUtilities {
  private breakpointManager: BreakpointManager;
  private viewport: ViewportCore;
  private safeArea: SafeAreaManager;
  private prefix: string;
  private autoUpdate: boolean;

  constructor(
    breakpointManager: BreakpointManager,
    viewport: ViewportCore,
    safeArea: SafeAreaManager,
    prefix = 'bp',
    autoUpdate = true
  ) {
    this.breakpointManager = breakpointManager;
    this.viewport = viewport;
    this.safeArea = safeArea;
    this.prefix = prefix;
    this.autoUpdate = autoUpdate;

    if (this.autoUpdate) {
      this.setupAutoUpdates();
    }
  }

  /**
   * Set up automatic CSS custom property updates
   */
  private setupAutoUpdates(): void {
    if (typeof document === 'undefined') {
      return;
    }

    // Update on viewport changes
    this.viewport.on('resize', () => {
      this.updateCustomProperties();
    });

    // Update on breakpoint changes
    this.viewport.on('breakpointchange', () => {
      this.updateCustomProperties();
    });

    // Update on safe area changes
    this.safeArea.on('change', () => {
      this.updateCustomProperties();
    });

    // Initial update
    this.updateCustomProperties();
  }

  /**
   * Generate CSS custom properties
   */
  public generateCustomProperties(): Record<string, string> {
    const properties: Record<string, string> = {};
    const viewportState = this.viewport.getState();
    const safeAreaInsets = this.safeArea.getInsets();
    const breakpoints = this.breakpointManager.getBreakpoints();

    // Viewport properties
    properties[`--${this.prefix}-width`] = `${viewportState.width}px`;
    properties[`--${this.prefix}-height`] = `${viewportState.height}px`;
    properties[`--${this.prefix}-breakpoint`] = viewportState.breakpoint;
    properties[`--${this.prefix}-orientation`] = viewportState.orientation;
    properties[`--${this.prefix}-pixel-ratio`] = `${viewportState.pixelRatio}`;

    // Device type properties
    properties[`--${this.prefix}-is-mobile`] = viewportState.isMobile ? '1' : '0';
    properties[`--${this.prefix}-is-tablet`] = viewportState.isTablet ? '1' : '0';
    properties[`--${this.prefix}-is-desktop`] = viewportState.isDesktop ? '1' : '0';
    properties[`--${this.prefix}-is-touch`] = viewportState.isTouch ? '1' : '0';

    // Breakpoint values
    Object.entries(breakpoints).forEach(([name, value]) => {
      properties[`--${this.prefix}-${name}`] = `${value}px`;
    });

    // Safe area properties
    properties[`--${this.prefix}-safe-top`] = `${safeAreaInsets.top}px`;
    properties[`--${this.prefix}-safe-right`] = `${safeAreaInsets.right}px`;
    properties[`--${this.prefix}-safe-bottom`] = `${safeAreaInsets.bottom}px`;
    properties[`--${this.prefix}-safe-left`] = `${safeAreaInsets.left}px`;

    return properties;
  }

  /**
   * Update CSS custom properties in document
   */
  public updateCustomProperties(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const properties = this.generateCustomProperties();
    const root = document.documentElement;

    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Generate container query helper classes
   */
  public generateContainerQueries(): string {
    const breakpoints = this.breakpointManager.getBreakpoints();
    const css: string[] = [];

    // Generate container query classes
    Object.entries(breakpoints).forEach(([name, value]) => {
      if (value > 0) {
        css.push(`
          @container (min-width: ${value}px) {
            .${this.prefix}-container-${name} {
              display: block;
            }
            .${this.prefix}-container-${name}-hidden {
              display: none;
            }
          }
        `);
      }
    });

    return css.join('\n');
  }

  /**
   * Generate responsive utility classes
   */
  public generateUtilityClasses(): string {
    const breakpoints = this.breakpointManager.getBreakpoints();
    const css: string[] = [];

    // Base utility classes
    css.push(`
      /* Viewport-based utilities */
      .${this.prefix}-mobile-only { display: none; }
      .${this.prefix}-tablet-only { display: none; }
      .${this.prefix}-desktop-only { display: none; }
      
      /* Touch-based utilities */
      .${this.prefix}-touch-only { display: none; }
      .${this.prefix}-no-touch-only { display: none; }
      
      /* Orientation utilities */
      .${this.prefix}-portrait-only { display: none; }
      .${this.prefix}-landscape-only { display: none; }
    `);

    // Generate breakpoint-specific classes
    Object.entries(breakpoints).forEach(([name, value]) => {
      const mediaQuery = value > 0 ? `(min-width: ${value}px)` : 'all';

      if (mediaQuery !== 'all') {
        css.push(`
          @media ${mediaQuery} {
            .${this.prefix}-${name}-up { display: block !important; }
            .${this.prefix}-${name}-up-hidden { display: none !important; }
            .${this.prefix}-${name}-down-hidden { display: block !important; }
          }
          
          @media not ${mediaQuery} {
            .${this.prefix}-${name}-down { display: block !important; }
            .${this.prefix}-${name}-down-hidden { display: none !important; }
            .${this.prefix}-${name}-up-hidden { display: block !important; }
          }
        `);
      }
    });

    // Device-specific utility classes
    css.push(`
      /* Mobile utilities */
      @media (max-width: 767px) {
        .${this.prefix}-mobile-only { display: block !important; }
        .${this.prefix}-tablet-only { display: none !important; }
        .${this.prefix}-desktop-only { display: none !important; }
      }
      
      /* Tablet utilities */
      @media (min-width: 768px) and (max-width: 1023px) {
        .${this.prefix}-mobile-only { display: none !important; }
        .${this.prefix}-tablet-only { display: block !important; }
        .${this.prefix}-desktop-only { display: none !important; }
      }
      
      /* Desktop utilities */
      @media (min-width: 1024px) {
        .${this.prefix}-mobile-only { display: none !important; }
        .${this.prefix}-tablet-only { display: none !important; }
        .${this.prefix}-desktop-only { display: block !important; }
      }
      
      /* Touch utilities */
      @media (hover: none) and (pointer: coarse) {
        .${this.prefix}-touch-only { display: block !important; }
        .${this.prefix}-no-touch-only { display: none !important; }
      }
      
      @media (hover: hover) and (pointer: fine) {
        .${this.prefix}-touch-only { display: none !important; }
        .${this.prefix}-no-touch-only { display: block !important; }
      }
      
      /* Orientation utilities */
      @media (orientation: portrait) {
        .${this.prefix}-portrait-only { display: block !important; }
        .${this.prefix}-landscape-only { display: none !important; }
      }
      
      @media (orientation: landscape) {
        .${this.prefix}-portrait-only { display: none !important; }
        .${this.prefix}-landscape-only { display: block !important; }
      }
    `);

    // Safe area utilities
    css.push(`
      /* Safe area utilities */
      .${this.prefix}-safe-padding {
        padding-top: var(--${this.prefix}-safe-top, env(safe-area-inset-top, 0px));
        padding-right: var(--${this.prefix}-safe-right, env(safe-area-inset-right, 0px));
        padding-bottom: var(--${this.prefix}-safe-bottom, env(safe-area-inset-bottom, 0px));
        padding-left: var(--${this.prefix}-safe-left, env(safe-area-inset-left, 0px));
      }
      
      .${this.prefix}-safe-padding-top {
        padding-top: var(--${this.prefix}-safe-top, env(safe-area-inset-top, 0px));
      }
      
      .${this.prefix}-safe-padding-right {
        padding-right: var(--${this.prefix}-safe-right, env(safe-area-inset-right, 0px));
      }
      
      .${this.prefix}-safe-padding-bottom {
        padding-bottom: var(--${this.prefix}-safe-bottom, env(safe-area-inset-bottom, 0px));
      }
      
      .${this.prefix}-safe-padding-left {
        padding-left: var(--${this.prefix}-safe-left, env(safe-area-inset-left, 0px));
      }
      
      .${this.prefix}-safe-margin {
        margin-top: var(--${this.prefix}-safe-top, env(safe-area-inset-top, 0px));
        margin-right: var(--${this.prefix}-safe-right, env(safe-area-inset-right, 0px));
        margin-bottom: var(--${this.prefix}-safe-bottom, env(safe-area-inset-bottom, 0px));
        margin-left: var(--${this.prefix}-safe-left, env(safe-area-inset-left, 0px));
      }
    `);

    return css.join('\n');
  }

  /**
   * Inject CSS into document
   */
  public injectCSS(css: string, id?: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const styleId = id || `${this.prefix}-styles`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }

  /**
   * Inject utility classes into document
   */
  public injectUtilityClasses(): void {
    const css = this.generateUtilityClasses();
    this.injectCSS(css, `${this.prefix}-utilities`);
  }

  /**
   * Inject container queries into document
   */
  public injectContainerQueries(): void {
    const css = this.generateContainerQueries();
    this.injectCSS(css, `${this.prefix}-containers`);
  }

  /**
   * Get CSS for specific breakpoint range
   */
  public getBreakpointCSS(
    minBreakpoint?: string,
    maxBreakpoint?: string,
    content?: string
  ): string {
    const breakpoints = this.breakpointManager.getBreakpoints();
    const conditions: string[] = [];

    if (minBreakpoint && breakpoints[minBreakpoint] !== undefined) {
      conditions.push(`(min-width: ${breakpoints[minBreakpoint]}px)`);
    }

    if (maxBreakpoint && breakpoints[maxBreakpoint] !== undefined) {
      conditions.push(`(max-width: ${breakpoints[maxBreakpoint] - 1}px)`);
    }

    if (conditions.length === 0) {
      return content || '';
    }

    const mediaQuery = `@media ${conditions.join(' and ')}`;
    return content ? `${mediaQuery} { ${content} }` : mediaQuery;
  }

  /**
   * Generate responsive typography scale
   */
  public generateTypographyScale(): string {
    const breakpoints = this.breakpointManager.getBreakpoints();
    const css: string[] = [];

    // Base typography
    css.push(`
      .${this.prefix}-text-responsive {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .${this.prefix}-heading-responsive {
        font-size: clamp(1.5rem, 4vw, 3rem);
      }
    `);

    // Breakpoint-specific typography
    Object.entries(breakpoints).forEach(([name, value]) => {
      if (value > 0) {
        css.push(`
          @media (min-width: ${value}px) {
            .${this.prefix}-text-${name} {
              font-size: ${this.getTypographySize(name)};
            }
          }
        `);
      }
    });

    return css.join('\n');
  }

  /**
   * Get typography size for breakpoint
   */
  private getTypographySize(breakpoint: string): string {
    const sizes: Record<string, string> = {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '1.75rem',
    };

    return sizes[breakpoint] || '1rem';
  }

  /**
   * Remove injected CSS
   */
  public removeCSS(id?: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const styleId = id || `${this.prefix}-styles`;
    const styleElement = document.getElementById(styleId);
    if (styleElement) {
      styleElement.remove();
    }
  }

  /**
   * Clean up and remove all injected styles
   */
  public destroy(): void {
    this.removeCSS(`${this.prefix}-utilities`);
    this.removeCSS(`${this.prefix}-containers`);
    this.removeCSS(`${this.prefix}-typography`);
    this.removeCSS(`${this.prefix}-styles`);
  }
}
