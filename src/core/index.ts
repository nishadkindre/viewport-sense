import type {
  BreakpointJSConfig,
  BreakpointJSInstance,
  ViewportState,
  DeviceInfo,
  AccessibilityPreferences,
} from '../types';
import { ViewportCore } from '../core/viewport';
import { DeviceDetector } from '../utils/device-detection';
import { AccessibilityDetector } from '../utils/accessibility';
import { SafeAreaManager } from '../utils/safe-area';
import { ScrollManager } from '../utils/scroll';
import { VisibilityManager } from '../utils/intersection';
import { BreakpointManager } from '../breakpoints/manager';
import { CSSIntegration } from '../integrations/css-utils';
import { PRESET_BREAKPOINTS } from '../breakpoints/presets';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<BreakpointJSConfig> = {
  // Breakpoint system
  breakpointSystem: 'bootstrap',
  customBreakpoints: {},
  breakpointUnit: 'px',

  // Performance
  debounceDelay: 100,
  enableRAF: true,
  enablePassiveListeners: true,

  // Features
  enableTouch: true,
  enableHighDPI: true,
  enableA11y: true,
  enableSafeArea: true,
  enableDeviceDetection: true,

  // CSS Integration
  autoCSSVars: true,
  cssVarPrefix: 'bp',
  enableContainerQueries: false,

  // Debug
  debug: false,
  logLevel: 'warn',
};

/**
 * Main BreakpointJS instance implementation
 */
class BreakpointJSInstanceImpl implements BreakpointJSInstance {
  public readonly viewport: ViewportCore;
  public readonly device: DeviceDetector;
  public readonly accessibility: AccessibilityDetector;
  public readonly safeArea: SafeAreaManager;
  public readonly breakpoints: BreakpointManager;
  public readonly scroll: ScrollManager;
  public readonly visibility: VisibilityManager;
  public readonly css: CSSIntegration;

  private config: Required<BreakpointJSConfig>;
  private isDestroyed = false;

  constructor(config: BreakpointJSConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize core components
    this.viewport = new ViewportCore({
      debounceDelay: this.config.debounceDelay,
      enableTouch: this.config.enableTouch,
      enableHighDPI: this.config.enableHighDPI,
      customBreakpoints: this.config.customBreakpoints,
    });

    // Initialize breakpoint manager
    if (this.config.breakpointSystem === 'custom') {
      this.breakpoints = new BreakpointManager({
        name: 'custom',
        breakpoints: this.config.customBreakpoints,
        unit: this.config.breakpointUnit,
      });
    } else {
      this.breakpoints = new BreakpointManager(PRESET_BREAKPOINTS[this.config.breakpointSystem]);
    }

    // Initialize optional components
    this.device = this.config.enableDeviceDetection
      ? new DeviceDetector()
      : (null as unknown as DeviceDetector);
    this.accessibility = this.config.enableA11y
      ? new AccessibilityDetector()
      : (null as unknown as AccessibilityDetector);
    this.safeArea = this.config.enableSafeArea
      ? new SafeAreaManager()
      : (null as unknown as SafeAreaManager);
    this.scroll = new ScrollManager();
    this.visibility = new VisibilityManager();

    // Initialize CSS integration
    this.css = new CSSIntegration(
      this.breakpoints,
      this.viewport,
      this.safeArea,
      this.config.cssVarPrefix,
      this.config.autoCSSVars
    );

    // Inject utility classes if enabled
    if (this.config.autoCSSVars) {
      this.css.injectUtilityClasses();
    }

    if (this.config.enableContainerQueries) {
      this.css.injectContainerQueries();
    }

    // Debug logging
    if (this.config.debug) {
      this.logDebugInfo();
    }
  }

  /**
   * Get current viewport state
   */
  public getState(): ViewportState {
    return this.viewport.getState();
  }

  /**
   * Clean up instance and remove listeners
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;

    // Destroy all components
    this.viewport.destroy();
    this.scroll.destroy();
    this.visibility.destroy();
    this.css.destroy();

    if (this.safeArea) {
      this.safeArea.destroy();
    }

    if (this.breakpoints) {
      this.breakpoints.destroy();
    }
  }

  /**
   * Check if instance is destroyed
   */
  public isDestroyed_(): boolean {
    return this.isDestroyed;
  }

  /**
   * Get current configuration
   */
  public getConfig(): Required<BreakpointJSConfig> {
    return { ...this.config };
  }

  /**
   * Log debug information
   */
  private logDebugInfo(): void {
    if (typeof console === 'undefined') {
      return;
    }

    const state = this.getState();
    const deviceInfo = this.device?.getDeviceInfo();
    const a11yPrefs = this.accessibility?.getPreferences();

    console.group('🔍 BreakpointJS Debug Info');
    console.log('📱 Viewport State:', state);
    if (deviceInfo) console.log('💻 Device Info:', deviceInfo);
    if (a11yPrefs) console.log('♿ Accessibility Preferences:', a11yPrefs);
    console.log('⚙️ Configuration:', this.config);
    console.groupEnd();
  }
}

/**
 * Global instance for singleton usage
 */
let globalInstance: BreakpointJSInstance | null = null;

/**
 * Create a new BreakpointJS instance
 */
export function createBreakpointJS(config?: BreakpointJSConfig): BreakpointJSInstance {
  return new BreakpointJSInstanceImpl(config);
}

/**
 * Get or create global BreakpointJS instance
 */
export function getBreakpointJS(config?: BreakpointJSConfig): BreakpointJSInstance {
  if (!globalInstance) {
    globalInstance = new BreakpointJSInstanceImpl(config);
  }
  return globalInstance;
}

/**
 * Reset global instance (useful for testing)
 */
export function resetGlobalInstance(): void {
  if (globalInstance) {
    globalInstance.destroy();
    globalInstance = null;
  }
}

/**
 * Convenience API object for global usage
 */
export const breakpoint = {
  // Device detection
  isMobile: (): boolean => getBreakpointJS().getState().isMobile,
  isTablet: (): boolean => getBreakpointJS().getState().isTablet,
  isDesktop: (): boolean => getBreakpointJS().getState().isDesktop,
  isTouch: (): boolean => getBreakpointJS().getState().isTouch,

  // Breakpoint queries
  is: (bp: string): boolean => getBreakpointJS().breakpoints.is(bp),
  above: (bp: string): boolean => getBreakpointJS().breakpoints.above(bp),
  below: (bp: string): boolean => getBreakpointJS().breakpoints.below(bp),
  between: (min: string, max: string): boolean => getBreakpointJS().breakpoints.between(min, max),

  // State access
  getState: (): ViewportState => getBreakpointJS().getState(),
  getDevice: (): DeviceInfo | null => getBreakpointJS().device?.getDeviceInfo() ?? null,
  getA11y: (): AccessibilityPreferences | null =>
    getBreakpointJS().accessibility?.getPreferences() ?? null,

  // Event handling
  on: (event: string, callback: (...args: unknown[]) => void): (() => void) => {
    // Type-safe event handling would be more complex, simplified for convenience API
    const instance = getBreakpointJS();
    if (event === 'resize' || event === 'breakpointchange' || event === 'orientationchange') {
      return instance.viewport.on(event as 'resize', callback as (state: ViewportState) => void);
    }
    return (): void => {
      // No-op
    };
  },

  off: (event: string, callback: (...args: unknown[]) => void): void => {
    const instance = getBreakpointJS();
    if (event === 'resize' || event === 'breakpointchange' || event === 'orientationchange') {
      instance.viewport.off(event as 'resize', callback as (state: ViewportState) => void);
    }
  },

  // Utilities
  mediaQuery: (bp: string): string => getBreakpointJS().breakpoints.mediaQuery(bp),
  cssVars: (): Record<string, string> => getBreakpointJS().css.generateCustomProperties(),

  // Configuration
  configure: (config: BreakpointJSConfig): void => {
    resetGlobalInstance();
    globalInstance = new BreakpointJSInstanceImpl(config);
  },

  // Cleanup
  destroy: (): void => {
    resetGlobalInstance();
  },
};

// Export the convenience API as default for easier imports
export default breakpoint;
