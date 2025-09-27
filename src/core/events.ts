import type { EventType, EventCallback, UnsubscribeFunction } from '../types';

/**
 * Event manager for handling viewport and breakpoint events
 */
export class EventManager {
  private listeners: Map<EventType, Set<EventCallback>> = new Map();
  private rafId: number | null = null;
  private rafCallbacks: Set<() => void> = new Set();

  /**
   * Add event listener
   */
  public on(event: EventType, callback: EventCallback): UnsubscribeFunction {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    return (): void => {
      this.off(event, callback);
    };
  }

  /**
   * Remove event listener
   */
  public off(event: EventType, callback: EventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  public emit(event: EventType, ...args: unknown[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          (callback as (...args: unknown[]) => void)(...args);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  /**
   * Schedule callback for next animation frame
   */
  public scheduleRAF(callback: () => void): void {
    this.rafCallbacks.add(callback);

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        const callbacks = new Set(this.rafCallbacks);
        this.rafCallbacks.clear();
        this.rafId = null;

        callbacks.forEach(cb => {
          try {
            cb();
          } catch (error) {
            console.error('Error in RAF callback:', error);
          }
        });
      });
    }
  }

  /**
   * Create debounced function
   */
  public debounce(func: (...args: unknown[]) => void, delay: number): (...args: unknown[]) => void {
    let timeoutId: number | undefined;

    return (...args: unknown[]): void => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => func(...args), delay);
    };
  }

  /**
   * Clean up all listeners and pending operations
   */
  public destroy(): void {
    this.listeners.clear();
    this.rafCallbacks.clear();

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Get number of listeners for an event
   */
  public getListenerCount(event: EventType): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  /**
   * Check if any listeners are registered
   */
  public hasListeners(): boolean {
    return this.listeners.size > 0;
  }
}
