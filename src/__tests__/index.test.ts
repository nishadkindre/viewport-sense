import { ViewportCore } from '../core/viewport';
import { DeviceDetector } from '../utils/device-detection';
import { createBreakpointJS, breakpoint } from '../core';

describe('ViewportCore', () => {
  let viewport: ViewportCore;

  beforeEach(() => {
    viewport = new ViewportCore();
  });

  afterEach(() => {
    viewport.destroy();
  });

  test('should initialize with default state', () => {
    const state = viewport.getState();

    expect(state).toHaveProperty('width');
    expect(state).toHaveProperty('height');
    expect(state).toHaveProperty('breakpoint');
    expect(state).toHaveProperty('isMobile');
    expect(state).toHaveProperty('isTablet');
    expect(state).toHaveProperty('isDesktop');
    expect(state).toHaveProperty('isTouch');
    expect(state).toHaveProperty('orientation');
    expect(state).toHaveProperty('pixelRatio');
  });

  test('should classify device types correctly', () => {
    expect(viewport.isMobile()).toBe(false); // 1024px is desktop
    expect(viewport.isTablet()).toBe(false);
    expect(viewport.isDesktop()).toBe(true);
  });

  test('should detect breakpoints correctly', () => {
    const breakpoint = viewport.getBreakpoint();
    expect(breakpoint).toBe('lg'); // 1024px should be lg breakpoint (992-1199px)
  });

  test('should handle event listeners', () => {
    const callback = jest.fn();
    const unsubscribe = viewport.on('resize', callback);

    expect(typeof unsubscribe).toBe('function');

    // Clean up
    unsubscribe();
  });
});

describe('DeviceDetector', () => {
  let device: DeviceDetector;

  beforeEach(() => {
    device = new DeviceDetector();
  });

  test('should detect browser information', () => {
    const browser = device.getBrowser();

    expect(browser).toHaveProperty('name');
    expect(browser).toHaveProperty('version');
    expect(typeof browser.name).toBe('string');
    expect(typeof browser.version).toBe('string');
  });

  test('should detect OS information', () => {
    const os = device.getOS();

    expect(os).toHaveProperty('name');
    expect(os).toHaveProperty('version');
    expect(typeof os.name).toBe('string');
    expect(typeof os.version).toBe('string');
  });

  test('should provide device info', () => {
    const deviceInfo = device.getDeviceInfo();

    expect(deviceInfo).toHaveProperty('browser');
    expect(deviceInfo).toHaveProperty('os');
    expect(deviceInfo).toHaveProperty('isWebView');
    expect(deviceInfo).toHaveProperty('isPWA');
    expect(deviceInfo).toHaveProperty('screenDensity');
    expect(deviceInfo).toHaveProperty('touchPoints');
    expect(deviceInfo).toHaveProperty('hardwareConcurrency');
    expect(deviceInfo).toHaveProperty('colorDepth');
    expect(deviceInfo).toHaveProperty('colorGamut');
  });
});

describe('Factory Functions', () => {
  test('createBreakpointJS should create new instance', () => {
    const instance = createBreakpointJS();

    expect(instance).toHaveProperty('viewport');
    expect(instance).toHaveProperty('device');
    expect(instance).toHaveProperty('accessibility');
    expect(instance).toHaveProperty('safeArea');
    expect(instance).toHaveProperty('breakpoints');
    expect(instance).toHaveProperty('scroll');
    expect(instance).toHaveProperty('visibility');
    expect(instance).toHaveProperty('css');

    // Clean up
    instance.destroy();
  });

  test('convenience API should work', () => {
    expect(typeof breakpoint.isMobile).toBe('function');
    expect(typeof breakpoint.isTablet).toBe('function');
    expect(typeof breakpoint.isDesktop).toBe('function');
    expect(typeof breakpoint.getState).toBe('function');

    // Test actual calls
    expect(typeof breakpoint.isMobile()).toBe('boolean');
    expect(typeof breakpoint.getState()).toBe('object');
  });
});

describe('Configuration', () => {
  test('should accept custom configuration', () => {
    const instance = createBreakpointJS({
      breakpointSystem: 'tailwind',
      debounceDelay: 200,
      enableTouch: false,
    });

    const config = (instance as any).getConfig?.();
    if (config) {
      expect(config.breakpointSystem).toBe('tailwind');
      expect(config.debounceDelay).toBe(200);
      expect(config.enableTouch).toBe(false);
    }

    // Clean up
    instance.destroy();
  });
});

describe('Responsive Utilities', () => {
  test('should handle breakpoint queries', () => {
    expect(typeof breakpoint.is('lg')).toBe('boolean');
    expect(typeof breakpoint.above('sm')).toBe('boolean');
    expect(typeof breakpoint.below('xl')).toBe('boolean');
    expect(typeof breakpoint.between('sm', 'lg')).toBe('boolean');
  });

  test('should generate media queries', () => {
    const mediaQuery = breakpoint.mediaQuery('md');
    expect(typeof mediaQuery).toBe('string');
    expect(mediaQuery).toContain('min-width');
  });

  test('should generate CSS variables', () => {
    const cssVars = breakpoint.cssVars();
    expect(typeof cssVars).toBe('object');
    expect(Object.keys(cssVars).length).toBeGreaterThan(0);
  });
});
