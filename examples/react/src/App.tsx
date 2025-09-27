import React, { useRef } from 'react';
import {
  useViewport,
  useBreakpoint,
  useDevice,
  useAccessibility,
  useScrollPosition,
  useElementVisibility,
  useSafeArea,
  useMediaQuery,
  useBreakpointValue,
  useDeviceType,
  useOrientation,
  useColorScheme,
  useReducedMotion,
} from 'viewport-sense/react';

// Demo components
function ViewportInfo() {
  const viewport = useViewport();
  
  return (
    <div className="demo-card">
      <h3>📐 Viewport Information</h3>
      <div className="info-item">
        <span className="info-label">Width:</span>
        <span className="info-value">{viewport.width}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Height:</span>
        <span className="info-value">{viewport.height}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Breakpoint:</span>
        <span className="info-value">{viewport.breakpoint}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Device Type:</span>
        <span className="info-value">
          {viewport.isMobile ? 'Mobile' : viewport.isTablet ? 'Tablet' : 'Desktop'}
        </span>
      </div>
      <div className="info-item">
        <span className="info-label">Orientation:</span>
        <span className="info-value">{viewport.orientation}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Pixel Ratio:</span>
        <span className="info-value">{viewport.pixelRatio}</span>
      </div>
    </div>
  );
}

function DeviceInfo() {
  const device = useDevice();
  
  return (
    <div className="demo-card">
      <h3>📱 Device Detection</h3>
      <div className="info-item">
        <span className="info-label">Browser:</span>
        <span className="info-value">{device.browser || 'Unknown'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Version:</span>
        <span className="info-value">{device.browserVersion || 'Unknown'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">OS:</span>
        <span className="info-value">{device.os || 'Unknown'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Touch Points:</span>
        <span className="info-value">{device.touchPoints ?? 0}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Is PWA:</span>
        <span className="info-value">{device.isPWA ? 'Yes' : 'No'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Screen Density:</span>
        <span className="info-value">{device.screenDensity || 'Unknown'}</span>
      </div>
    </div>
  );
}

function BreakpointQueries() {
  const breakpoint = useBreakpoint();
  const isAboveMd = useMediaQuery('(min-width: 768px)');
  const isBelowLg = useMediaQuery('(max-width: 991px)');
  
  return (
    <div className="demo-card">
      <h3>🔍 Breakpoint Queries</h3>
      <div className="info-item">
        <span className="info-label">Current:</span>
        <span className="info-value">{breakpoint}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Above MD:</span>
        <span className="info-value">{isAboveMd ? 'true' : 'false'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Below LG:</span>
        <span className="info-value">{isBelowLg ? 'true' : 'false'}</span>
      </div>
    </div>
  );
}

function AccessibilityInfo() {
  const a11y = useAccessibility();
  const colorScheme = useColorScheme();
  const reducedMotion = useReducedMotion();
  
  return (
    <div className="demo-card">
      <h3>♿ Accessibility</h3>
      <div className="info-item">
        <span className="info-label">Color Scheme:</span>
        <span className="info-value">{colorScheme || 'no-preference'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Reduced Motion:</span>
        <span className="info-value">{reducedMotion ? 'Yes' : 'No'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">High Contrast:</span>
        <span className="info-value">{a11y?.prefersHighContrast ? 'Yes' : 'No'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Reduced Data:</span>
        <span className="info-value">{a11y?.prefersReducedData ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
}

function ResponsiveDemo() {
  const deviceType = useDeviceType();
  const orientation = useOrientation();
  
  const fontSize = useBreakpointValue({
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '22px',
  });
  
  const backgroundColor = useBreakpointValue({
    xs: '#e74c3c',
    sm: '#f39c12',
    md: '#f1c40f',
    lg: '#2ecc71',
    xl: '#3498db',
  });
  
  // Convert deviceType object to string
  const deviceTypeString = deviceType?.isMobile ? 'Mobile' : 
                          deviceType?.isTablet ? 'Tablet' : 
                          deviceType?.isDesktop ? 'Desktop' : 'Unknown';
  
  return (
    <div className="responsive-demo" style={{ backgroundColor }}>
      <h2>🎨 Responsive Demo</h2>
      <p style={{ fontSize }}>This content adapts to your screen size!</p>
      <p>Device: {deviceTypeString} ({orientation || 'Unknown'})</p>
      <div className="bp-mobile-only">📱 Mobile Only Content</div>
      <div className="bp-tablet-only">📋 Tablet Only Content</div>
      <div className="bp-desktop-only">🖥️ Desktop Only Content</div>
    </div>
  );
}

function SafeAreaDemo() {
  const safeArea = useSafeArea();
  
  return (
    <div className="safe-area-demo">
      <h3>📱 Safe Area Demo</h3>
      <p>This content respects device safe areas (notches, home indicators, etc.)</p>
      <div className="info-item">
        <span className="info-label">Top:</span>
        <span className="info-value">{safeArea?.top || 0}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Bottom:</span>
        <span className="info-value">{safeArea?.bottom || 0}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Left:</span>
        <span className="info-value">{safeArea?.left || 0}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Right:</span>
        <span className="info-value">{safeArea?.right || 0}px</span>
      </div>
    </div>
  );
}

function ScrollDemo() {
  const scroll = useScrollPosition();
  
  return (
    <div className="demo-card">
      <h3>📜 Scroll Position</h3>
      <div className="info-item">
        <span className="info-label">Scroll Y:</span>
        <span className="info-value">{Math.round(scroll?.y || 0)}px</span>
      </div>
      <div className="info-item">
        <span className="info-label">Direction:</span>
        <span className="info-value">{scroll?.directionY || 'none'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Velocity:</span>
        <span className="info-value">{Math.round(scroll?.velocity || 0)}px/s</span>
      </div>
      <div className="info-item">
        <span className="info-label">Near Top:</span>
        <span className="info-value">{scroll?.isNearTop ? 'Yes' : 'No'}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Near Bottom:</span>
        <span className="info-value">{scroll?.isNearBottom ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
}

function VisibilityDemo() {
  // Create refs properly - not in an array
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const ref5 = useRef<HTMLDivElement>(null);
  
  // Call hooks for each ref - hooks must be called in the same order
  const isVisible1 = useElementVisibility(ref1);
  const isVisible2 = useElementVisibility(ref2);
  const isVisible3 = useElementVisibility(ref3);
  const isVisible4 = useElementVisibility(ref4);
  const isVisible5 = useElementVisibility(ref5);
  
  // Create arrays for rendering
  const items = [
    { ref: ref1, isVisible: isVisible1 },
    { ref: ref2, isVisible: isVisible2 },
    { ref: ref3, isVisible: isVisible3 },
    { ref: ref4, isVisible: isVisible4 },
    { ref: ref5, isVisible: isVisible5 },
  ];
  
  return (
    <div className="demo-card">
      <h3>👁️ Element Visibility</h3>
      <p>Scroll to see elements change color when they become visible:</p>
      <div className="visibility-demo">
        {items.map((item, index) => (
          <div
            key={index}
            ref={item.ref}
            className={`visibility-item ${item.isVisible ? 'visible' : ''}`}
          >
            Item {index + 1} {item.isVisible ? '(Visible)' : '(Hidden)'}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollIndicator() {
  const scroll = useScrollPosition();
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const scrollPercent = ((scroll?.y || 0) / maxScroll) * 100;
  
  return (
    <div 
      className="scroll-indicator" 
      style={{ width: `${Math.min(Math.max(scrollPercent, 0), 100)}%` }}
    />
  );
}

function App() {
  return (
    <>
      <ScrollIndicator />
      <div className="container">
        <div className="header">
          <h1>⚛️ viewport-sense React Demo</h1>
          <p>Comprehensive viewport utility library with React hooks</p>
        </div>

        <div className="demo-grid">
          <ViewportInfo />
          <DeviceInfo />
          <BreakpointQueries />
          <AccessibilityInfo />
        </div>

        <ResponsiveDemo />
        <SafeAreaDemo />
        
        <div className="demo-grid">
          <ScrollDemo />
        </div>

        <VisibilityDemo />
      </div>
    </>
  );
}

export default App;