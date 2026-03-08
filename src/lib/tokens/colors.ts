// Hypnotic Design Tokens - Colors
// Centralized color system for consistency across the app

export const colors = {
  // Base
  black: '#0A0A0A',
  white: '#FFFFFF',
  
  // Accent - warm gold
  gold: {
    DEFAULT: '#D8A34A',
    light: '#E5B55C',
    dark: '#B8832F',
    muted: 'rgba(216, 163, 74, 0.1)',
    border: 'rgba(216, 163, 74, 0.3)',
  },
  
  // Grays
  gray: {
    50: '#F9F9F9',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D4D4D4',
    400: '#A0A0A0',
    500: '#888888',
    600: '#666666',
    700: '#444444',
    800: '#2A2A2A',
    900: '#1A1A1A',
  },
  
  // Semantic
  success: {
    DEFAULT: '#22C55E',
    light: '#DCFCE7',
    dark: '#166534',
  },
  error: {
    DEFAULT: '#EF4444',
    light: '#FEE2E2',
    dark: '#991B1B',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
    dark: '#92400E',
  },
  info: {
    DEFAULT: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1E40AF',
  },
  
  // Surfaces
  surface: {
    primary: '#0B0B0D',
    secondary: '#0F0F11',
    tertiary: '#1A1A1A',
    elevated: '#2A2A2A',
  },
  
  // Module identity colors
  modules: {
    insight: {
      DEFAULT: '#3B82F6',
      muted: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    manifest: {
      DEFAULT: '#22C55E',
      muted: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
    },
    craft: {
      DEFAULT: '#A855F7',
      muted: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
    },
    amplify: {
      DEFAULT: '#EF4444',
      muted: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
  },
  
  // Text
  text: {
    primary: '#F6F6F6',
    secondary: '#A7A7A7',
    muted: '#666666',
    disabled: '#444444',
  },
  
  // Borders
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.15)',
    focus: 'rgba(216, 163, 74, 0.5)',
  },
} as const;

// Tailwind-compatible color mapping
export const tailwindColors = {
  background: colors.surface.primary,
  foreground: colors.text.primary,
  card: colors.surface.secondary,
  'card-foreground': colors.text.primary,
  primary: colors.gold.DEFAULT,
  'primary-foreground': colors.black,
  secondary: colors.surface.tertiary,
  'secondary-foreground': colors.text.primary,
  muted: colors.surface.tertiary,
  'muted-foreground': colors.text.secondary,
  accent: colors.gold.DEFAULT,
  'accent-foreground': colors.black,
  destructive: colors.error.DEFAULT,
  'destructive-foreground': colors.white,
  border: colors.border.DEFAULT,
  input: colors.border.DEFAULT,
  ring: colors.gold.DEFAULT,
} as const;

// Helper to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // If already rgba, extract and modify
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\(([^,]+),\s*([^,]+),\s*([^,]+),\s*[^)]+\)/, 
      `rgba($1, $2, $3, ${opacity})`);
  }
  // If hex, convert to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
