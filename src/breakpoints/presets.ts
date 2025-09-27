import type { BreakpointSystem } from '../types';

/**
 * Bootstrap 5 breakpoint system
 */
export const BOOTSTRAP_BREAKPOINTS: BreakpointSystem = {
  name: 'bootstrap',
  unit: 'px',
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
};

/**
 * Tailwind CSS breakpoint system
 */
export const TAILWIND_BREAKPOINTS: BreakpointSystem = {
  name: 'tailwind',
  unit: 'px',
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
};

/**
 * Material Design breakpoint system
 */
export const MATERIAL_BREAKPOINTS: BreakpointSystem = {
  name: 'material',
  unit: 'px',
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

/**
 * Foundation breakpoint system
 */
export const FOUNDATION_BREAKPOINTS: BreakpointSystem = {
  name: 'foundation',
  unit: 'px',
  breakpoints: {
    small: 0,
    medium: 640,
    large: 1024,
    xlarge: 1200,
    xxlarge: 1440,
  },
};

/**
 * Bulma breakpoint system
 */
export const BULMA_BREAKPOINTS: BreakpointSystem = {
  name: 'bulma',
  unit: 'px',
  breakpoints: {
    mobile: 0,
    tablet: 769,
    desktop: 1024,
    widescreen: 1216,
    fullhd: 1408,
  },
};

/**
 * Semantic UI breakpoint system
 */
export const SEMANTIC_BREAKPOINTS: BreakpointSystem = {
  name: 'semantic',
  unit: 'px',
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 992,
    'large screen': 1200,
    widescreen: 1920,
  },
};

/**
 * Ant Design breakpoint system
 */
export const ANT_DESIGN_BREAKPOINTS: BreakpointSystem = {
  name: 'antd',
  unit: 'px',
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
};

/**
 * Chakra UI breakpoint system
 */
export const CHAKRA_BREAKPOINTS: BreakpointSystem = {
  name: 'chakra',
  unit: 'px',
  breakpoints: {
    base: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
    '2xl': 1536,
  },
};

/**
 * Preset breakpoint systems
 */
export const PRESET_BREAKPOINTS = {
  bootstrap: BOOTSTRAP_BREAKPOINTS,
  tailwind: TAILWIND_BREAKPOINTS,
  material: MATERIAL_BREAKPOINTS,
  foundation: FOUNDATION_BREAKPOINTS,
  bulma: BULMA_BREAKPOINTS,
  semantic: SEMANTIC_BREAKPOINTS,
  antd: ANT_DESIGN_BREAKPOINTS,
  chakra: CHAKRA_BREAKPOINTS,
} as const;

/**
 * Get breakpoint system by name
 */
export function getBreakpointSystem(name: keyof typeof PRESET_BREAKPOINTS): BreakpointSystem {
  return PRESET_BREAKPOINTS[name];
}

/**
 * Get all available breakpoint system names
 */
export function getAvailableBreakpointSystems(): string[] {
  return Object.keys(PRESET_BREAKPOINTS);
}

/**
 * Create custom breakpoint system
 */
export function createCustomBreakpointSystem(
  name: string,
  breakpoints: Record<string, number>,
  unit: 'px' | 'em' | 'rem' = 'px'
): BreakpointSystem {
  return {
    name,
    breakpoints,
    unit,
  };
}

/**
 * Convert breakpoints to different units
 */
export function convertBreakpointUnits(
  breakpoints: Record<string, number>,
  fromUnit: 'px' | 'em' | 'rem',
  toUnit: 'px' | 'em' | 'rem',
  baseFontSize = 16
): Record<string, number> {
  if (fromUnit === toUnit) {
    return breakpoints;
  }

  const conversionFactors = {
    'px-to-em': 1 / baseFontSize,
    'px-to-rem': 1 / baseFontSize,
    'em-to-px': baseFontSize,
    'em-to-rem': 1,
    'rem-to-px': baseFontSize,
    'rem-to-em': 1,
  };

  const conversionKey = `${fromUnit}-to-${toUnit}` as keyof typeof conversionFactors;
  const factor = conversionFactors[conversionKey];

  const converted: Record<string, number> = {};
  Object.entries(breakpoints).forEach(([name, value]) => {
    converted[name] = Math.round(value * factor * 100) / 100; // Round to 2 decimal places
  });

  return converted;
}

/**
 * Validate breakpoint system
 */
export function validateBreakpointSystem(system: BreakpointSystem): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!system.name) {
    errors.push('Breakpoint system must have a name');
  }

  if (!system.breakpoints || typeof system.breakpoints !== 'object') {
    errors.push('Breakpoint system must have breakpoints object');
  }

  if (!['px', 'em', 'rem'].includes(system.unit)) {
    errors.push('Unit must be one of: px, em, rem');
  }

  // Check if breakpoints are valid numbers
  if (system.breakpoints) {
    Object.entries(system.breakpoints).forEach(([name, value]) => {
      if (typeof value !== 'number' || value < 0) {
        errors.push(`Breakpoint '${name}' must be a non-negative number`);
      }
    });

    // Check if breakpoints are in ascending order
    const originalValues = Object.values(system.breakpoints);

    let isAscending = true;
    for (let i = 0; i < originalValues.length - 1; i++) {
      if (originalValues[i] > originalValues[i + 1]) {
        isAscending = false;
        break;
      }
    }

    if (!isAscending) {
      errors.push('Breakpoints should be defined in ascending order for optimal performance');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
