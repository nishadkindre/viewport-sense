import type {
  SafeAreaInsets,
  SafeAreaManager as ISafeAreaManager,
  UnsubscribeFunction,
} from '../types';

/**
 * Safe area management for handling device notches, cutouts, and dynamic islands
 */
export class SafeAreaManager implements ISafeAreaManager {
  private currentInsets: SafeAreaInsets | null = null;
  private listeners: Set<(insets: SafeAreaInsets) => void> = new Set();
  private resizeObserver: ResizeObserver | null = null;
  private testElement: HTMLElement | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize safe area detection
   */
  private initialize(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // SSR safety
    }

    this.createTestElement();
    this.setupObserver();
    this.updateInsets();
  }

  /**
   * Create invisible test element for measuring safe area
   */
  private createTestElement(): void {
    this.testElement = document.createElement('div');
    this.testElement.style.cssText = `
      position: fixed;
      top: env(safe-area-inset-top, 0px);
      right: env(safe-area-inset-right, 0px);
      bottom: env(safe-area-inset-bottom, 0px);
      left: env(safe-area-inset-left, 0px);
      width: 1px;
      height: 1px;
      pointer-events: none;
      visibility: hidden;
      z-index: -1;
    `;
    document.body.appendChild(this.testElement);
  }

  /**
   * Set up resize observer to watch for safe area changes
   */
  private setupObserver(): void {
    if (typeof ResizeObserver !== 'undefined' && this.testElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateInsets();
      });
      this.resizeObserver.observe(this.testElement);
    }

    // Also listen for orientation changes
    window.addEventListener(
      'orientationchange',
      () => {
        // Delay to allow for orientation change to complete
        setTimeout(() => this.updateInsets(), 100);
      },
      { passive: true }
    );

    // Listen for visual viewport changes (iOS)
    if ('visualViewport' in window && window.visualViewport) {
      (window.visualViewport as VisualViewport).addEventListener(
        'resize',
        () => {
          this.updateInsets();
        },
        { passive: true }
      );
    }
  }

  /**
   * Update current safe area insets
   */
  private updateInsets(): void {
    const newInsets = this.calculateInsets();

    if (!this.currentInsets || !this.insetsEqual(this.currentInsets, newInsets)) {
      this.currentInsets = newInsets;
      this.notifyListeners(newInsets);
    }
  }

  /**
   * Calculate current safe area insets
   */
  private calculateInsets(): SafeAreaInsets {
    if (!this.testElement) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    // Method 1: Use computed style of test element
    const computedStyle = window.getComputedStyle(this.testElement);
    const top = this.parsePixelValue(computedStyle.top);
    const right = this.parsePixelValue(computedStyle.right);
    const bottom = this.parsePixelValue(computedStyle.bottom);
    const left = this.parsePixelValue(computedStyle.left);

    // Method 2: Fallback using CSS custom properties
    if (top === 0 && right === 0 && bottom === 0 && left === 0) {
      return this.calculateInsetsFromCSS();
    }

    return { top, right, bottom, left };
  }

  /**
   * Calculate insets from CSS custom properties (fallback method)
   */
  private calculateInsetsFromCSS(): SafeAreaInsets {
    if (typeof window === 'undefined') {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    const docStyle = window.getComputedStyle(document.documentElement);

    // Try to read CSS custom properties if they exist
    const top =
      this.parsePixelValue(docStyle.getPropertyValue('--safe-area-inset-top')) ||
      this.getCSSEnvValue('safe-area-inset-top');
    const right =
      this.parsePixelValue(docStyle.getPropertyValue('--safe-area-inset-right')) ||
      this.getCSSEnvValue('safe-area-inset-right');
    const bottom =
      this.parsePixelValue(docStyle.getPropertyValue('--safe-area-inset-bottom')) ||
      this.getCSSEnvValue('safe-area-inset-bottom');
    const left =
      this.parsePixelValue(docStyle.getPropertyValue('--safe-area-inset-left')) ||
      this.getCSSEnvValue('safe-area-inset-left');

    return { top, right, bottom, left };
  }

  /**
   * Get CSS env() value using a temporary element
   */
  private getCSSEnvValue(property: string): number {
    const tempEl = document.createElement('div');
    tempEl.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: env(${property}, 0px);
    `;
    document.body.appendChild(tempEl);

    const value = this.parsePixelValue(window.getComputedStyle(tempEl).width);
    document.body.removeChild(tempEl);

    return value;
  }

  /**
   * Parse pixel value from CSS string
   */
  private parsePixelValue(value: string): number {
    if (!value || value === 'auto') {
      return 0;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Check if two inset objects are equal
   */
  private insetsEqual(a: SafeAreaInsets, b: SafeAreaInsets): boolean {
    return a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;
  }

  /**
   * Notify all listeners of inset changes
   */
  private notifyListeners(insets: SafeAreaInsets): void {
    this.listeners.forEach(listener => {
      try {
        listener(insets);
      } catch (error) {
        console.error('Error in safe area change listener:', error);
      }
    });
  }

  /**
   * Get current safe area insets
   */
  public getInsets(): SafeAreaInsets {
    if (!this.currentInsets) {
      this.currentInsets = this.calculateInsets();
    }
    return this.currentInsets;
  }

  /**
   * Check if device has a notch or cutout
   */
  public hasNotch(): boolean {
    const insets = this.getInsets();
    return insets.top > 0 || insets.left > 0 || insets.right > 0;
  }

  /**
   * Check if device has dynamic island (iOS 14.1+)
   */
  public hasDynamicIsland(): boolean {
    const insets = this.getInsets();

    // Dynamic island typically has a specific top inset pattern
    // This is heuristic-based as there's no direct API
    if (insets.top >= 44 && insets.top <= 59) {
      // Check if it's likely an iPhone with dynamic island
      const userAgent = navigator.userAgent;
      if (userAgent.includes('iPhone')) {
        // Additional checks could be added here for specific models
        return true;
      }
    }

    return false;
  }

  /**
   * Add listener for safe area changes
   */
  public on(event: 'change', callback: (insets: SafeAreaInsets) => void): UnsubscribeFunction {
    if (event === 'change') {
      this.listeners.add(callback);

      return (): void => {
        this.listeners.delete(callback);
      };
    }

    return (): void => {
      // No-op for unsupported events
    };
  }

  /**
   * Generate CSS custom properties for current safe area insets
   */
  public getCSSCustomProperties(): Record<string, string> {
    const insets = this.getInsets();

    return {
      '--safe-area-inset-top': `${insets.top}px`,
      '--safe-area-inset-right': `${insets.right}px`,
      '--safe-area-inset-bottom': `${insets.bottom}px`,
      '--safe-area-inset-left': `${insets.left}px`,
    };
  }

  /**
   * Apply safe area insets to document root as CSS custom properties
   */
  public applyCSSCustomProperties(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const properties = this.getCSSCustomProperties();
    const root = document.documentElement;

    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }

  /**
   * Get safe padding CSS for elements
   */
  public getSafePaddingCSS(
    sides: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left']
  ): string {
    const insets = this.getInsets();
    const padding: string[] = [];

    if (sides.includes('top') && insets.top > 0) {
      padding.push(`padding-top: max(${insets.top}px, env(safe-area-inset-top, 0px))`);
    }
    if (sides.includes('right') && insets.right > 0) {
      padding.push(`padding-right: max(${insets.right}px, env(safe-area-inset-right, 0px))`);
    }
    if (sides.includes('bottom') && insets.bottom > 0) {
      padding.push(`padding-bottom: max(${insets.bottom}px, env(safe-area-inset-bottom, 0px))`);
    }
    if (sides.includes('left') && insets.left > 0) {
      padding.push(`padding-left: max(${insets.left}px, env(safe-area-inset-left, 0px))`);
    }

    return padding.join('; ');
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Remove test element
    if (this.testElement && this.testElement.parentNode) {
      this.testElement.parentNode.removeChild(this.testElement);
      this.testElement = null;
    }

    // Clear listeners
    this.listeners.clear();

    // Clear current insets
    this.currentInsets = null;
  }
}
