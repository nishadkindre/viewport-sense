import type {
  VisibilityInfo,
  VisibilityManager as IVisibilityManager,
  VisibilityEventCallback,
  UnsubscribeFunction,
} from '../types';

/**
 * Element visibility tracking using Intersection Observer
 */
export class VisibilityManager implements IVisibilityManager {
  private observer: IntersectionObserver | null = null;
  private observers: Map<Element, IntersectionObserver> = new Map();
  private callbacks: Map<Element, Set<VisibilityEventCallback>> = new Map();
  private visibilityStates: Map<Element, VisibilityInfo> = new Map();

  // Default options
  private defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
  };

  constructor(options?: IntersectionObserverInit) {
    if (options) {
      this.defaultOptions = { ...this.defaultOptions, ...options };
    }

    this.initialize();
  }

  /**
   * Initialize intersection observer
   */
  private initialize(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return; // SSR safety or no support
    }

    this.observer = new IntersectionObserver(
      this.handleIntersections.bind(this),
      this.defaultOptions
    );
  }

  /**
   * Handle intersection changes
   */
  private handleIntersections(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const element = entry.target;
      const visibilityInfo = this.createVisibilityInfo(entry);

      // Update state
      this.visibilityStates.set(element, visibilityInfo);

      // Notify callbacks
      const callbacks = this.callbacks.get(element);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(visibilityInfo);
          } catch (error) {
            console.error('Error in visibility callback:', error);
          }
        });
      }
    });
  }

  /**
   * Create visibility info from intersection entry
   */
  private createVisibilityInfo(entry: IntersectionObserverEntry): VisibilityInfo {
    return {
      isVisible: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio,
      intersectionRect: entry.intersectionRect,
      boundingClientRect: entry.boundingClientRect,
      rootBounds: entry.rootBounds,
    };
  }

  /**
   * Observe element for visibility changes
   */
  public observe(element: Element, callback: VisibilityEventCallback): UnsubscribeFunction {
    if (!this.observer) {
      console.warn('IntersectionObserver not supported');
      return (): void => {
        // No-op
      };
    }

    // Add callback
    if (!this.callbacks.has(element)) {
      this.callbacks.set(element, new Set());
    }
    this.callbacks.get(element)!.add(callback);

    // Start observing if not already
    if (!this.visibilityStates.has(element)) {
      this.observer.observe(element);
    } else {
      // Call immediately with current state
      const currentState = this.visibilityStates.get(element);
      if (currentState) {
        callback(currentState);
      }
    }

    return (): void => {
      this.removeCallback(element, callback);
    };
  }

  /**
   * Stop observing element
   */
  public unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }

    // Clean up state
    this.callbacks.delete(element);
    this.visibilityStates.delete(element);

    // Clean up custom observers
    const customObserver = this.observers.get(element);
    if (customObserver) {
      customObserver.disconnect();
      this.observers.delete(element);
    }
  }

  /**
   * Remove specific callback for element
   */
  private removeCallback(element: Element, callback: VisibilityEventCallback): void {
    const callbacks = this.callbacks.get(element);
    if (callbacks) {
      callbacks.delete(callback);

      // If no more callbacks, stop observing
      if (callbacks.size === 0) {
        this.unobserve(element);
      }
    }
  }

  /**
   * Check if element is currently visible
   */
  public isVisible(element: Element): boolean {
    const visibilityInfo = this.visibilityStates.get(element);
    return visibilityInfo?.isVisible ?? false;
  }

  /**
   * Get visibility information for element
   */
  public getVisibilityInfo(element: Element): VisibilityInfo | null {
    return this.visibilityStates.get(element) ?? null;
  }

  /**
   * Observe element with custom options
   */
  public observeWithOptions(
    element: Element,
    callback: VisibilityEventCallback,
    options: IntersectionObserverInit
  ): UnsubscribeFunction {
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver not supported');
      return (): void => {
        // No-op
      };
    }

    // Create custom observer for this element
    const customObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === element) {
          const visibilityInfo = this.createVisibilityInfo(entry);
          this.visibilityStates.set(element, visibilityInfo);
          callback(visibilityInfo);
        }
      });
    }, options);

    customObserver.observe(element);
    this.observers.set(element, customObserver);

    return (): void => {
      customObserver.unobserve(element);
      customObserver.disconnect();
      this.observers.delete(element);
      this.visibilityStates.delete(element);
    };
  }

  /**
   * Get intersection ratio for element
   */
  public getIntersectionRatio(element: Element): number {
    const visibilityInfo = this.visibilityStates.get(element);
    return visibilityInfo?.intersectionRatio ?? 0;
  }

  /**
   * Check if element is fully visible
   */
  public isFullyVisible(element: Element): boolean {
    const visibilityInfo = this.visibilityStates.get(element);
    return (visibilityInfo?.intersectionRatio ?? 0) === 1;
  }

  /**
   * Check if element is partially visible
   */
  public isPartiallyVisible(element: Element): boolean {
    const visibilityInfo = this.visibilityStates.get(element);
    const ratio = visibilityInfo?.intersectionRatio ?? 0;
    return ratio > 0 && ratio < 1;
  }

  /**
   * Get all currently visible elements
   */
  public getVisibleElements(): Element[] {
    const visibleElements: Element[] = [];

    this.visibilityStates.forEach((info, element) => {
      if (info.isVisible) {
        visibleElements.push(element);
      }
    });

    return visibleElements;
  }

  /**
   * Wait for element to become visible
   */
  public waitForVisible(element: Element): Promise<VisibilityInfo> {
    return new Promise(resolve => {
      // Check if already visible
      const currentInfo = this.getVisibilityInfo(element);
      if (currentInfo?.isVisible) {
        resolve(currentInfo);
        return;
      }

      // Wait for visibility
      const unsubscribe = this.observe(element, info => {
        if (info.isVisible) {
          unsubscribe();
          resolve(info);
        }
      });
    });
  }

  /**
   * Wait for element to become invisible
   */
  public waitForInvisible(element: Element): Promise<VisibilityInfo> {
    return new Promise(resolve => {
      // Check if already invisible
      const currentInfo = this.getVisibilityInfo(element);
      if (currentInfo && !currentInfo.isVisible) {
        resolve(currentInfo);
        return;
      }

      // Wait for invisibility
      const unsubscribe = this.observe(element, info => {
        if (!info.isVisible) {
          unsubscribe();
          resolve(info);
        }
      });
    });
  }

  /**
   * Create a lazy loading helper
   */
  public createLazyLoader(
    elements: NodeListOf<Element> | Element[],
    callback: (element: Element) => void,
    options?: IntersectionObserverInit
  ): () => void {
    const unsubscribeFunctions: Array<() => void> = [];

    Array.from(elements).forEach(element => {
      const unsubscribe = options
        ? this.observeWithOptions(
            element,
            info => {
              if (info.isVisible) {
                callback(element);
                unsubscribe(); // Stop observing after first visibility
              }
            },
            options
          )
        : this.observe(element, info => {
            if (info.isVisible) {
              callback(element);
              unsubscribe(); // Stop observing after first visibility
            }
          });

      unsubscribeFunctions.push(unsubscribe);
    });

    // Return cleanup function
    return (): void => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Create viewport entrance/exit tracker
   */
  public createEntranceTracker(
    element: Element,
    onEnter?: () => void,
    onExit?: () => void
  ): UnsubscribeFunction {
    let wasVisible = false;

    return this.observe(element, info => {
      const isVisible = info.isVisible;

      if (isVisible && !wasVisible && onEnter) {
        onEnter();
      } else if (!isVisible && wasVisible && onExit) {
        onExit();
      }

      wasVisible = isVisible;
    });
  }

  /**
   * Get performance metrics
   */
  public getMetrics(): {
    observedElements: number;
    visibleElements: number;
    customObservers: number;
  } {
    return {
      observedElements: this.visibilityStates.size,
      visibleElements: this.getVisibleElements().length,
      customObservers: this.observers.size,
    };
  }

  /**
   * Clean up all observers and state
   */
  public destroy(): void {
    // Disconnect main observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Disconnect custom observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();

    // Clear state
    this.callbacks.clear();
    this.visibilityStates.clear();
  }
}
