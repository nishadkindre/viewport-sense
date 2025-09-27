// Global test setup
import 'jest-environment-jsdom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock performance.now
Object.defineProperty(performance, 'now', {
  writable: true,
  value: jest.fn(() => Date.now()),
});

// Mock visualViewport
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    width: 390,
    height: 844,
  },
});

// Set up a basic DOM structure
document.body.innerHTML = `
  <div id="root">
    <div class="test-element" style="width: 100px; height: 100px;"></div>
  </div>
`;

// Reset window dimensions for tests
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock screen object
Object.defineProperty(window, 'screen', {
  writable: true,
  value: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
  },
});

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
});

Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  value: 0,
});

Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 4,
});

// Clean up after each test
afterEach(() => {
  // Reset window dimensions
  Object.defineProperty(window, 'innerWidth', { value: 1024 });
  Object.defineProperty(window, 'innerHeight', { value: 768 });

  // Clear any injected styles
  const injectedStyles = document.querySelectorAll('style[id*="bp-"]');
  injectedStyles.forEach(style => style.remove());

  // Reset matchMedia mock
  (window.matchMedia as jest.Mock).mockClear();
});
