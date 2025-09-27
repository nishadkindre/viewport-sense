import { useEffect, useState, useRef, RefObject } from 'react';
import type {
  ViewportState,
  DeviceInfo,
  AccessibilityPreferences,
  ScrollPosition,
  VisibilityInfo,
  SafeAreaInsets,
} from '../types';
import { ViewportCore } from '../core/viewport';
import { DeviceDetector } from '../utils/device-detection';
import { AccessibilityDetector } from '../utils/accessibility';
import { ScrollManager } from '../utils/scroll';
import { VisibilityManager } from '../utils/intersection';
import { SafeAreaManager } from '../utils/safe-area';

// Global instances (singleton pattern for React)
let globalViewport: ViewportCore | null = null;
let globalDevice: DeviceDetector | null = null;
let globalAccessibility: AccessibilityDetector | null = null;
let globalScroll: ScrollManager | null = null;
let globalVisibility: VisibilityManager | null = null;
let globalSafeArea: SafeAreaManager | null = null;

/**
 * Get or create global viewport instance
 */
function getViewportInstance(): ViewportCore {
  if (!globalViewport) {
    globalViewport = new ViewportCore();
  }
  return globalViewport;
}

/**
 * Get or create global device detector instance
 */
function getDeviceInstance(): DeviceDetector {
  if (!globalDevice) {
    globalDevice = new DeviceDetector();
  }
  return globalDevice;
}

/**
 * Get or create global accessibility detector instance
 */
function getAccessibilityInstance(): AccessibilityDetector {
  if (!globalAccessibility) {
    globalAccessibility = new AccessibilityDetector();
  }
  return globalAccessibility;
}

/**
 * Get or create global scroll manager instance
 */
function getScrollInstance(): ScrollManager {
  if (!globalScroll) {
    globalScroll = new ScrollManager();
  }
  return globalScroll;
}

/**
 * Get or create global visibility manager instance
 */
function getVisibilityInstance(): VisibilityManager {
  if (!globalVisibility) {
    globalVisibility = new VisibilityManager();
  }
  return globalVisibility;
}

/**
 * Get or create global safe area manager instance
 */
function getSafeAreaInstance(): SafeAreaManager {
  if (!globalSafeArea) {
    globalSafeArea = new SafeAreaManager();
  }
  return globalSafeArea;
}

/**
 * Hook for viewport state and breakpoint detection
 */
export function useViewport(): ViewportState {
  const viewport = getViewportInstance();
  const [state, setState] = useState<ViewportState>(viewport.getState());

  useEffect(() => {
    const unsubscribe = viewport.on('resize', setState);
    return unsubscribe;
  }, [viewport]);

  return state;
}

/**
 * Hook for current breakpoint
 */
export function useBreakpoint(): string {
  const viewport = getViewportInstance();
  const [breakpoint, setBreakpoint] = useState<string>(viewport.getBreakpoint());

  useEffect(() => {
    const unsubscribe = viewport.on('breakpointchange', (newBreakpoint: string) => {
      setBreakpoint(newBreakpoint);
    });
    return unsubscribe;
  }, [viewport]);

  return breakpoint;
}

/**
 * Hook for device information
 */
export function useDevice(): DeviceInfo {
  const device = getDeviceInstance();
  const [deviceInfo] = useState<DeviceInfo>(device.getDeviceInfo());

  // Device info is static, no need for updates
  return deviceInfo;
}

/**
 * Hook for accessibility preferences
 */
export function useAccessibility(): AccessibilityPreferences {
  const accessibility = getAccessibilityInstance();
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(
    accessibility.getPreferences()
  );

  useEffect(() => {
    const unsubscribe = accessibility.watchPreferences(setPreferences);
    return unsubscribe;
  }, [accessibility]);

  return preferences;
}

/**
 * Hook for scroll position tracking
 */
export function useScrollPosition(): ScrollPosition {
  const scroll = getScrollInstance();
  const [position, setPosition] = useState<ScrollPosition>(scroll.getPosition());

  useEffect(() => {
    const unsubscribe = scroll.on('scroll', setPosition);
    return unsubscribe;
  }, [scroll]);

  return position;
}

/**
 * Hook for element visibility detection
 */
export function useElementVisibility(ref: RefObject<Element>): boolean {
  const visibility = getVisibilityInstance();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const unsubscribe = visibility.observe(element, (info: VisibilityInfo) => {
      setIsVisible(info.isVisible);
    });

    return unsubscribe;
  }, [ref, visibility]);

  return isVisible;
}

/**
 * Hook for intersection observer with custom options
 */
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options?: IntersectionObserverInit
): VisibilityInfo | null {
  const visibility = getVisibilityInstance();
  const [visibilityInfo, setVisibilityInfo] = useState<VisibilityInfo | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const unsubscribe = options
      ? visibility.observeWithOptions(element, setVisibilityInfo, options)
      : visibility.observe(element, setVisibilityInfo);

    return unsubscribe;
  }, [ref, visibility, options]);

  return visibilityInfo;
}

/**
 * Hook for safe area insets
 */
export function useSafeArea(): SafeAreaInsets {
  const safeArea = getSafeAreaInstance();
  const [insets, setInsets] = useState<SafeAreaInsets>(safeArea.getInsets());

  useEffect(() => {
    const unsubscribe = safeArea.on('change', setInsets);
    return unsubscribe;
  }, [safeArea]);

  return insets;
}

/**
 * Hook for responsive values based on breakpoints
 */
export function useBreakpointValue<T>(values: Record<string, T>): T {
  const breakpoint = useBreakpoint();

  // Return value for current breakpoint or fallback to first available
  return values[breakpoint] ?? Object.values(values)[0];
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return (): void => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook for mobile/tablet/desktop detection
 */
export function useDeviceType(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
} {
  const { isMobile, isTablet, isDesktop, isTouch } = useViewport();
  return { isMobile, isTablet, isDesktop, isTouch };
}

/**
 * Hook for orientation detection
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const { orientation } = useViewport();
  return orientation;
}

/**
 * Hook for lazy loading implementation
 */
export function useLazyLoading(
  ref: RefObject<Element>,
  onVisible: () => void,
  options?: IntersectionObserverInit
): boolean {
  const [hasBeenVisible, setHasBeenVisible] = useState<boolean>(false);
  const visibility = getVisibilityInstance();

  useEffect(() => {
    const element = ref.current;
    if (!element || hasBeenVisible) {
      return;
    }

    const unsubscribe = options
      ? visibility.observeWithOptions(
          element,
          info => {
            if (info.isVisible && !hasBeenVisible) {
              setHasBeenVisible(true);
              onVisible();
            }
          },
          options
        )
      : visibility.observe(element, info => {
          if (info.isVisible && !hasBeenVisible) {
            setHasBeenVisible(true);
            onVisible();
          }
        });

    return unsubscribe;
  }, [ref, onVisible, hasBeenVisible, visibility, options]);

  return hasBeenVisible;
}

/**
 * Hook for scroll-based animations/effects
 */
export function useScrollTrigger(
  callback: (position: ScrollPosition) => void,
  throttleMs = 100
): void {
  const scroll = getScrollInstance();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const throttledCallback = scroll.createThrottledHandler(
      (position: ScrollPosition) => callbackRef.current(position),
      throttleMs
    );

    const unsubscribe = scroll.on('scroll', throttledCallback);
    return unsubscribe;
  }, [scroll, throttleMs]);
}

/**
 * Hook for color scheme preference
 */
export function useColorScheme(): 'light' | 'dark' | 'no-preference' {
  const { colorScheme } = useAccessibility();
  return colorScheme;
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const { prefersReducedMotion } = useAccessibility();
  return prefersReducedMotion;
}

/**
 * Hook for managing breakpoint-specific effects
 */
export function useBreakpointEffect(
  targetBreakpoint: string,
  effect: () => void | (() => void),
  deps: unknown[] = []
): void {
  const currentBreakpoint = useBreakpoint();
  const isActive = currentBreakpoint === targetBreakpoint;

  useEffect(() => {
    if (isActive) {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, ...deps]);
}

/**
 * Cleanup function for React development mode
 */
export function cleanupBreakpointJS(): void {
  globalViewport?.destroy();
  globalScroll?.destroy();
  globalVisibility?.destroy();
  globalSafeArea?.destroy();

  globalViewport = null;
  globalDevice = null;
  globalAccessibility = null;
  globalScroll = null;
  globalVisibility = null;
  globalSafeArea = null;
}
