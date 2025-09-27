import type {
  ScrollPosition,
  ScrollManager as IScrollManager,
  ScrollEventCallback,
  UnsubscribeFunction,
} from '../types';

/**
 * Optimized scroll position tracking and management
 */
export class ScrollManager implements IScrollManager {
  private currentPosition: ScrollPosition | null = null;
  private listeners: Set<ScrollEventCallback> = new Set();
  private rafId: number | null = null;
  private isScrolling = false;
  private scrollTimeout: number | undefined;
  private velocityHistory: Array<{ time: number; y: number }> = [];
  private previousPosition = { x: 0, y: 0 };
  private element: Element | Window;

  // Configuration
  private readonly velocityHistorySize = 10;
  private readonly velocitySampleTime = 100; // ms
  private readonly nearThreshold = 100; // pixels
  private readonly scrollEndDelay = 150; // ms

  constructor(element: Element | Window = window) {
    this.element = element;
    this.initialize();
  }

  /**
   * Initialize scroll tracking
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      return; // SSR safety
    }

    this.setupScrollListener();
    this.updatePosition();
  }

  /**
   * Set up optimized scroll listener
   */
  private setupScrollListener(): void {
    const handleScroll = (): void => {
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          this.updatePosition();
          this.rafId = null;
        });
      }
    };

    this.element.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Update scroll position and calculate derived values
   */
  private updatePosition(): void {
    const now = performance.now();
    const position = this.getScrollPosition();

    // Calculate direction
    const directionX =
      position.x > this.previousPosition.x
        ? 'right'
        : position.x < this.previousPosition.x
          ? 'left'
          : 'none';
    const directionY =
      position.y > this.previousPosition.y
        ? 'down'
        : position.y < this.previousPosition.y
          ? 'up'
          : 'none';

    // Update velocity history
    this.velocityHistory.push({ time: now, y: position.y });
    if (this.velocityHistory.length > this.velocityHistorySize) {
      this.velocityHistory.shift();
    }

    // Calculate velocity
    const velocity = this.calculateVelocity();

    // Check near boundaries
    const scrollElement = this.getScrollElement();
    const isNearTop = position.y <= this.nearThreshold;
    const isNearBottom = scrollElement
      ? position.y >= scrollElement.scrollHeight - scrollElement.clientHeight - this.nearThreshold
      : false;

    // Update current position
    this.currentPosition = {
      x: position.x,
      y: position.y,
      directionX,
      directionY,
      velocity,
      isNearTop,
      isNearBottom,
    };

    // Update previous position
    this.previousPosition = { x: position.x, y: position.y };

    // Mark as scrolling
    this.isScrolling = true;

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Set timeout to detect scroll end
    this.scrollTimeout = window.setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollEndDelay);

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Get current scroll position from element
   */
  private getScrollPosition(): { x: number; y: number } {
    if (this.element === window) {
      return {
        x:
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0,
        y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
      };
    } else {
      const element = this.element as Element;
      return {
        x: element.scrollLeft,
        y: element.scrollTop,
      };
    }
  }

  /**
   * Get scrollable element for boundary calculations
   */
  private getScrollElement(): Element | null {
    if (this.element === window) {
      return document.documentElement || document.body;
    }
    return this.element as Element;
  }

  /**
   * Calculate scroll velocity in pixels per second
   */
  private calculateVelocity(): number {
    if (this.velocityHistory.length < 2) {
      return 0;
    }

    const recent = this.velocityHistory[this.velocityHistory.length - 1];
    const older =
      this.velocityHistory.find(entry => recent.time - entry.time >= this.velocitySampleTime) ||
      this.velocityHistory[0];

    const timeDiff = recent.time - older.time;
    const yDiff = recent.y - older.y;

    if (timeDiff === 0) {
      return 0;
    }

    // Convert to pixels per second
    return Math.abs(yDiff) / (timeDiff / 1000);
  }

  /**
   * Notify all listeners of position change
   */
  private notifyListeners(): void {
    if (!this.currentPosition) {
      return;
    }

    this.listeners.forEach(callback => {
      try {
        callback(this.currentPosition!);
      } catch (error) {
        console.error('Error in scroll listener:', error);
      }
    });
  }

  /**
   * Get current scroll position
   */
  public getPosition(): ScrollPosition {
    if (!this.currentPosition) {
      this.updatePosition();
    }
    return this.currentPosition!;
  }

  /**
   * Add scroll event listener
   */
  public on(event: 'scroll', callback: ScrollEventCallback): UnsubscribeFunction {
    if (event === 'scroll') {
      this.listeners.add(callback);

      // Call immediately with current position
      if (this.currentPosition) {
        callback(this.currentPosition);
      }

      return (): void => {
        this.listeners.delete(callback);
      };
    }

    return (): void => {
      // No-op for unsupported events
    };
  }

  /**
   * Check if near top of scrollable area
   */
  public isNearTop(threshold = this.nearThreshold): boolean {
    const position = this.getPosition();
    return position.y <= threshold;
  }

  /**
   * Check if near bottom of scrollable area
   */
  public isNearBottom(threshold = this.nearThreshold): boolean {
    const scrollElement = this.getScrollElement();
    if (!scrollElement) {
      return false;
    }

    const position = this.getPosition();
    return position.y >= scrollElement.scrollHeight - scrollElement.clientHeight - threshold;
  }

  /**
   * Scroll to specific position
   */
  public scrollTo(options: ScrollToOptions): void {
    if (this.element === window) {
      window.scrollTo(options);
    } else {
      (this.element as Element).scrollTo(options);
    }
  }

  /**
   * Scroll to top
   */
  public scrollToTop(smooth = true): void {
    this.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  /**
   * Scroll to bottom
   */
  public scrollToBottom(smooth = true): void {
    const scrollElement = this.getScrollElement();
    if (scrollElement) {
      this.scrollTo({
        top: scrollElement.scrollHeight,
        left: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }

  /**
   * Scroll element into view
   */
  public scrollToElement(element: Element, options: ScrollIntoViewOptions = {}): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options,
    });
  }

  /**
   * Check if currently scrolling
   */
  public isScrolling_(): boolean {
    return this.isScrolling;
  }

  /**
   * Get scroll progress as percentage (0-100)
   */
  public getScrollProgress(): number {
    const scrollElement = this.getScrollElement();
    if (!scrollElement) {
      return 0;
    }

    const position = this.getPosition();
    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;

    if (maxScroll <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (position.y / maxScroll) * 100));
  }

  /**
   * Get remaining scroll distance to bottom
   */
  public getRemainingScroll(): number {
    const scrollElement = this.getScrollElement();
    if (!scrollElement) {
      return 0;
    }

    const position = this.getPosition();
    return Math.max(0, scrollElement.scrollHeight - scrollElement.clientHeight - position.y);
  }

  /**
   * Create throttled scroll handler
   */
  public createThrottledHandler(callback: ScrollEventCallback, delay = 100): ScrollEventCallback {
    let lastCall = 0;

    return (position: ScrollPosition): void => {
      const now = performance.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback(position);
      }
    };
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Clear listeners
    this.listeners.clear();

    // Clear timeouts
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = undefined;
    }

    // Cancel RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Clear state
    this.currentPosition = null;
    this.velocityHistory = [];
    this.isScrolling = false;
  }
}
