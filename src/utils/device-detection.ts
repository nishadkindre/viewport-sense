import type { DeviceInfo, DeviceDetector as IDeviceDetector } from '../types';

/**
 * User agent patterns for browser detection
 */
const BROWSER_PATTERNS = {
  chrome: /Chrome\/([0-9.]+)/,
  firefox: /Firefox\/([0-9.]+)/,
  safari: /Version\/([0-9.]+).*Safari/,
  edge: /Edg\/([0-9.]+)/,
  ie: /(?:MSIE |Trident\/.*; rv:)([0-9.]+)/,
  opera: /Opera\/([0-9.]+)|OPR\/([0-9.]+)/,
  samsung: /SamsungBrowser\/([0-9.]+)/,
  webview: /wv\)|Version\/[0-9.]+ Chrome\/[0-9.]+ Mobile/,
} as const;

/**
 * Operating system patterns
 */
const OS_PATTERNS = {
  windows: /Windows NT ([0-9.]+)/,
  macos: /Mac OS X ([0-9._]+)/,
  ios: /OS ([0-9._]+) like Mac OS X/,
  android: /Android ([0-9.]+)/,
  linux: /Linux/,
  chromeos: /CrOS/,
} as const;

/**
 * Advanced device detection utility
 */
export class DeviceDetector implements IDeviceDetector {
  private deviceInfo: DeviceInfo | null = null;
  private userAgent: string;

  constructor() {
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    this.deviceInfo = this.detectDevice();
  }

  /**
   * Get complete device information
   */
  public getDeviceInfo(): DeviceInfo {
    if (!this.deviceInfo) {
      this.deviceInfo = this.detectDevice();
    }
    return this.deviceInfo;
  }

  /**
   * Get browser information
   */
  public getBrowser(): { name: string; version: string } {
    const info = this.getDeviceInfo();
    return {
      name: info.browser,
      version: info.browserVersion,
    };
  }

  /**
   * Get operating system information
   */
  public getOS(): { name: string; version: string } {
    const info = this.getDeviceInfo();
    return {
      name: info.os,
      version: info.osVersion,
    };
  }

  /**
   * Check if running in WebView
   */
  public isWebView(): boolean {
    return this.getDeviceInfo().isWebView;
  }

  /**
   * Check if running as PWA
   */
  public isPWA(): boolean {
    return this.getDeviceInfo().isPWA;
  }

  /**
   * Get screen density classification
   */
  public getScreenDensity(): 'low' | 'medium' | 'high' | 'ultra' {
    return this.getDeviceInfo().screenDensity;
  }

  /**
   * Detect all device information
   */
  private detectDevice(): DeviceInfo {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return this.getDefaultDeviceInfo();
    }

    const browser = this.detectBrowser();
    const os = this.detectOS();
    const isWebView = this.detectWebView();
    const isPWA = this.detectPWA();
    const screenDensity = this.detectScreenDensity();
    const touchPoints = this.detectTouchPoints();
    const hardwareConcurrency = this.detectHardwareConcurrency();
    const colorDepth = this.detectColorDepth();
    const colorGamut = this.detectColorGamut();

    return {
      browser: browser.name,
      browserVersion: browser.version,
      os: os.name,
      osVersion: os.version,
      isWebView,
      isPWA,
      screenDensity,
      touchPoints,
      hardwareConcurrency,
      colorDepth,
      colorGamut,
    };
  }

  /**
   * Detect browser name and version
   */
  private detectBrowser(): { name: string; version: string } {
    const ua = this.userAgent;

    // Check for Edge first (before Chrome)
    if (BROWSER_PATTERNS.edge.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.edge);
      return { name: 'Edge', version: match?.[1] ?? 'unknown' };
    }

    // Check for Chrome
    if (BROWSER_PATTERNS.chrome.test(ua) && !BROWSER_PATTERNS.edge.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.chrome);
      return { name: 'Chrome', version: match?.[1] ?? 'unknown' };
    }

    // Check for Firefox
    if (BROWSER_PATTERNS.firefox.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.firefox);
      return { name: 'Firefox', version: match?.[1] ?? 'unknown' };
    }

    // Check for Safari
    if (BROWSER_PATTERNS.safari.test(ua) && !BROWSER_PATTERNS.chrome.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.safari);
      return { name: 'Safari', version: match?.[1] ?? 'unknown' };
    }

    // Check for Samsung Internet
    if (BROWSER_PATTERNS.samsung.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.samsung);
      return { name: 'Samsung Internet', version: match?.[1] ?? 'unknown' };
    }

    // Check for Opera
    if (BROWSER_PATTERNS.opera.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.opera);
      return { name: 'Opera', version: (match?.[1] || match?.[2]) ?? 'unknown' };
    }

    // Check for Internet Explorer
    if (BROWSER_PATTERNS.ie.test(ua)) {
      const match = ua.match(BROWSER_PATTERNS.ie);
      return { name: 'Internet Explorer', version: match?.[1] ?? 'unknown' };
    }

    return { name: 'Unknown', version: 'unknown' };
  }

  /**
   * Detect operating system name and version
   */
  private detectOS(): { name: string; version: string } {
    const ua = this.userAgent;

    // Check for iOS first
    if (OS_PATTERNS.ios.test(ua)) {
      const match = ua.match(OS_PATTERNS.ios);
      const version = match?.[1]?.replace(/_/g, '.') ?? 'unknown';
      return { name: 'iOS', version };
    }

    // Check for Android
    if (OS_PATTERNS.android.test(ua)) {
      const match = ua.match(OS_PATTERNS.android);
      return { name: 'Android', version: match?.[1] ?? 'unknown' };
    }

    // Check for macOS
    if (OS_PATTERNS.macos.test(ua)) {
      const match = ua.match(OS_PATTERNS.macos);
      const version = match?.[1]?.replace(/_/g, '.') ?? 'unknown';
      return { name: 'macOS', version };
    }

    // Check for Windows
    if (OS_PATTERNS.windows.test(ua)) {
      const match = ua.match(OS_PATTERNS.windows);
      return { name: 'Windows', version: match?.[1] ?? 'unknown' };
    }

    // Check for Chrome OS
    if (OS_PATTERNS.chromeos.test(ua)) {
      return { name: 'Chrome OS', version: 'unknown' };
    }

    // Check for Linux
    if (OS_PATTERNS.linux.test(ua)) {
      return { name: 'Linux', version: 'unknown' };
    }

    return { name: 'Unknown', version: 'unknown' };
  }

  /**
   * Detect if running in WebView
   */
  private detectWebView(): boolean {
    const ua = this.userAgent;

    // Android WebView detection
    if (
      ua.includes('wv)') ||
      (ua.includes('Version/') && ua.includes('Chrome/') && ua.includes('Mobile'))
    ) {
      return true;
    }

    // iOS WebView detection
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      // In iOS WebView, window.indexedDB is null
      if (typeof window !== 'undefined' && !window.indexedDB) {
        return true;
      }

      // Additional iOS WebView checks
      const isStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;
      if (isStandalone === false) {
        return true;
      }
    }

    return false;
  }

  /**
   * Detect if running as PWA
   */
  private detectPWA(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    // Check for standalone mode
    const isStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;
    if (isStandalone) {
      return true;
    }

    // Check for display-mode: standalone
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check for minimal-ui
    if (window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches) {
      return true;
    }

    return false;
  }

  /**
   * Detect screen density classification
   */
  private detectScreenDensity(): 'low' | 'medium' | 'high' | 'ultra' {
    if (typeof window === 'undefined') {
      return 'medium';
    }

    const pixelRatio = window.devicePixelRatio || 1;

    if (pixelRatio >= 3) {
      return 'ultra';
    } else if (pixelRatio >= 2) {
      return 'high';
    } else if (pixelRatio >= 1.5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Detect maximum touch points
   */
  private detectTouchPoints(): number {
    if (typeof navigator === 'undefined') {
      return 0;
    }

    return (
      navigator.maxTouchPoints ||
      // @ts-expect-error - Legacy IE support
      navigator.msMaxTouchPoints ||
      0
    );
  }

  /**
   * Detect hardware concurrency (CPU cores)
   */
  private detectHardwareConcurrency(): number {
    if (typeof navigator === 'undefined') {
      return 1;
    }

    return navigator.hardwareConcurrency || 1;
  }

  /**
   * Detect color depth
   */
  private detectColorDepth(): number {
    if (typeof screen === 'undefined') {
      return 24;
    }

    return screen.colorDepth || 24;
  }

  /**
   * Detect color gamut capability
   */
  private detectColorGamut(): string {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'srgb';
    }

    if (window.matchMedia('(color-gamut: rec2020)').matches) {
      return 'rec2020';
    } else if (window.matchMedia('(color-gamut: p3)').matches) {
      return 'p3';
    } else if (window.matchMedia('(color-gamut: srgb)').matches) {
      return 'srgb';
    }

    return 'srgb';
  }

  /**
   * Get default device info for SSR environments
   */
  private getDefaultDeviceInfo(): DeviceInfo {
    return {
      browser: 'Unknown',
      browserVersion: 'unknown',
      os: 'Unknown',
      osVersion: 'unknown',
      isWebView: false,
      isPWA: false,
      screenDensity: 'medium',
      touchPoints: 0,
      hardwareConcurrency: 1,
      colorDepth: 24,
      colorGamut: 'srgb',
    };
  }

  /**
   * Refresh device detection (useful for testing)
   */
  public refresh(): void {
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    this.deviceInfo = this.detectDevice();
  }
}
