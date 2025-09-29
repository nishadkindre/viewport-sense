// Main exports
export { createBreakpointJS, getBreakpointJS, breakpoint } from './core';
export { default } from './core';

// Core classes
export { ViewportCore } from './core/viewport';
export { EventManager } from './core/events';

// Utility classes
export { DeviceDetector } from './utils/device-detection';
export { AccessibilityDetector } from './utils/accessibility';
export { SafeAreaManager } from './utils/safe-area';
export { ScrollManager } from './utils/scroll';
export { VisibilityManager } from './utils/intersection';

// Breakpoint system
export { BreakpointManager } from './breakpoints/manager';
export {
  PRESET_BREAKPOINTS,
  BOOTSTRAP_BREAKPOINTS,
  TAILWIND_BREAKPOINTS,
  MATERIAL_BREAKPOINTS,
  FOUNDATION_BREAKPOINTS,
  BULMA_BREAKPOINTS,
  SEMANTIC_BREAKPOINTS,
  ANT_DESIGN_BREAKPOINTS,
  CHAKRA_BREAKPOINTS,
  getBreakpointSystem,
  getAvailableBreakpointSystems,
  createCustomBreakpointSystem,
  convertBreakpointUnits,
  validateBreakpointSystem,
} from './breakpoints/presets';

// CSS Integration
export { CSSIntegration } from './integrations/css-utils';

// Framework integrations are exported separately to avoid conflicts
// Users should import from 'viewport-sense/react'

// Type definitions
export type * from './types';

// Version (this would typically be injected during build)
export const VERSION = '1.0.1';
