import type {
  AccessibilityPreferences,
  AccessibilityDetector as IAccessibilityDetector,
} from '../types';

/**
 * Accessibility feature detector
 */
export class AccessibilityDetector implements IAccessibilityDetector {
  private preferences: AccessibilityPreferences | null = null;

  constructor() {
    this.preferences = this.detectPreferences();
  }

  /**
   * Get all accessibility preferences
   */
  public getPreferences(): AccessibilityPreferences {
    if (!this.preferences) {
      this.preferences = this.detectPreferences();
    }
    return this.preferences;
  }

  /**
   * Check if user prefers reduced motion
   */
  public prefersReducedMotion(): boolean {
    return this.getPreferences().prefersReducedMotion;
  }

  /**
   * Get user's color scheme preference
   */
  public getColorScheme(): 'light' | 'dark' | 'no-preference' {
    return this.getPreferences().colorScheme;
  }

  /**
   * Check if user prefers high contrast
   */
  public prefersHighContrast(): boolean {
    return this.getPreferences().prefersHighContrast;
  }

  /**
   * Check if user prefers reduced data usage
   */
  public prefersReducedData(): boolean {
    return this.getPreferences().prefersReducedData;
  }

  /**
   * Check if system is using forced colors mode
   */
  public hasForcedColors(): boolean {
    return this.getPreferences().forcedColors;
  }

  /**
   * Check if screen reader is likely present (approximate detection)
   */
  public hasScreenReader(): boolean {
    return this.getPreferences().hasScreenReader;
  }

  /**
   * Detect all accessibility preferences
   */
  private detectPreferences(): AccessibilityPreferences {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return this.getDefaultPreferences();
    }

    return {
      prefersReducedMotion: this.detectReducedMotion(),
      colorScheme: this.detectColorScheme(),
      prefersHighContrast: this.detectHighContrast(),
      prefersReducedData: this.detectReducedData(),
      forcedColors: this.detectForcedColors(),
      hasScreenReader: this.detectScreenReader(),
    };
  }

  /**
   * Detect reduced motion preference
   */
  private detectReducedMotion(): boolean {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }

  /**
   * Detect color scheme preference
   */
  private detectColorScheme(): 'light' | 'dark' | 'no-preference' {
    try {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      } else {
        return 'no-preference';
      }
    } catch {
      return 'no-preference';
    }
  }

  /**
   * Detect high contrast preference
   */
  private detectHighContrast(): boolean {
    try {
      // Modern browsers
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        return true;
      }

      // Legacy Windows high contrast detection
      if (window.matchMedia('(-ms-high-contrast: active)').matches) {
        return true;
      }

      // Alternative detection method
      if (window.matchMedia('(prefers-contrast: more)').matches) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Detect reduced data preference
   */
  private detectReducedData(): boolean {
    try {
      // Check for Save-Data header preference
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection;
        if (connection?.saveData) {
          return true;
        }
      }

      // Check media query (experimental)
      if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Detect forced colors mode
   */
  private detectForcedColors(): boolean {
    try {
      return window.matchMedia('(forced-colors: active)').matches;
    } catch {
      return false;
    }
  }

  /**
   * Detect screen reader presence (approximate)
   */
  private detectScreenReader(): boolean {
    try {
      // Check for common screen reader indicators

      // 1. Check for screen reader specific CSS media queries
      if (window.matchMedia('(prefers-reduced-motion: reduce) and (pointer: coarse)').matches) {
        return true;
      }

      // 2. Check for accessibility APIs
      if (typeof window.speechSynthesis !== 'undefined') {
        // Voice synthesis available doesn't guarantee screen reader, but it's an indicator
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // This is a weak indicator, so we'll be conservative
          return false;
        }
      }

      // 3. Check for focus management patterns typical of screen readers
      // This is a heuristic and not definitive
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'BODY') {
        // Screen readers often keep focus on body initially
        return false; // Too ambiguous to be useful
      }

      // 4. Check for ARIA live regions (indicates accessibility-aware site)
      const liveRegions = document.querySelectorAll('[aria-live]');
      if (liveRegions.length > 0) {
        // Presence of live regions suggests accessibility considerations
        return false; // Not a reliable indicator of screen reader presence
      }

      // 5. Check for Windows high contrast as proxy
      if (this.detectHighContrast() && this.detectReducedMotion()) {
        return true; // Higher likelihood when both are enabled
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get default preferences for SSR environments
   */
  private getDefaultPreferences(): AccessibilityPreferences {
    return {
      prefersReducedMotion: false,
      colorScheme: 'no-preference',
      prefersHighContrast: false,
      prefersReducedData: false,
      forcedColors: false,
      hasScreenReader: false,
    };
  }

  /**
   * Refresh accessibility detection (useful for testing)
   */
  public refresh(): void {
    this.preferences = this.detectPreferences();
  }

  /**
   * Set up listeners for accessibility preference changes
   */
  public watchPreferences(callback: (preferences: AccessibilityPreferences) => void): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return (): void => {
        // No-op for SSR
      };
    }

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-color-scheme: light)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-contrast: more)'),
      window.matchMedia('(forced-colors: active)'),
    ];

    const handleChange = (): void => {
      this.refresh();
      callback(this.getPreferences());
    };

    // Add listeners
    mediaQueries.forEach(mq => {
      try {
        mq.addEventListener('change', handleChange);
      } catch {
        // Fallback for older browsers
        mq.addListener(handleChange);
      }
    });

    // Return cleanup function
    return (): void => {
      mediaQueries.forEach(mq => {
        try {
          mq.removeEventListener('change', handleChange);
        } catch {
          // Fallback for older browsers
          mq.removeListener(handleChange);
        }
      });
    };
  }
}
