/**
 * Bloom App Theme Colors
 * Centralized color definitions for consistent theming across the app.
 * Supports multiple color themes and modes (light/dark).
 * 
 * To add a new theme:
 * 1. Add the theme name to ColorTheme type
 * 2. Add color values to palette object
 * 3. Add theme configuration to themes object
 * 4. Add CSS variables to global.css
 */

// Available color themes - add new themes here
export type ColorTheme = "purple" | "green" | "neonBlue";
export type ThemeMode = "light" | "dark";

// ============================================
// Base Color Palette
// ============================================

export const palette = {
  // Purple theme colors
  purple: {
    primary: "#8c2bee",
    light: "#c084fc",
    soft: "rgba(140, 43, 238, 0.08)",
    softDark: "rgba(140, 43, 238, 0.15)",
  },
  // Green theme colors
  green: {
    primary: "#2ced6c",
    light: "#86efac",
    soft: "rgba(44, 237, 108, 0.08)",
    softDark: "rgba(44, 237, 108, 0.15)",
  },
  // Neon Blue theme colors
  neonBlue: {
    primary: "#00D4FF",
    light: "#67E8F9",
    soft: "rgba(0, 212, 255, 0.08)",
    softDark: "rgba(0, 212, 255, 0.18)",
  },
  // Neutral colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  // Semantic colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

// ============================================
// Theme-Specific Colors
// ============================================

type ThemeColors = {
  // Accent colors (mapped from HeroUI --accent)
  accent: string;
  accentLight: string;
  accentSoft: string;
  accentForeground: string;

  // Muted color (for secondary text, icons)
  muted: string;

  // Background gradients (for LinearGradient)
  backgroundGradient: readonly [string, string, string, string];
  backgroundGradientDark: readonly [string, string, string, string];

  // Surface colors
  surface: string;
  surfaceElevated: string;
  surfacePressed: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textAccent: string;

  // Border colors
  border: string;
  borderFocused: string;

  // Overlay colors
  overlayLight: string;
  overlayDark: string;
};

const lightModeBase: Omit<ThemeColors, "accent" | "accentLight" | "accentSoft" | "accentForeground" | "backgroundGradient" | "backgroundGradientDark" | "textAccent" | "borderFocused"> = {
  muted: palette.gray[500],
  surface: palette.white,
  surfaceElevated: palette.white,
  surfacePressed: palette.gray[100],
  textPrimary: palette.gray[900],
  textSecondary: palette.gray[500],
  textTertiary: palette.gray[400],
  textInverse: palette.white,
  border: palette.gray[200],
  overlayLight: "rgba(255, 255, 255, 0.6)",
  overlayDark: "rgba(0, 0, 0, 0.5)",
};

const darkModeBase: Omit<ThemeColors, "accent" | "accentLight" | "accentSoft" | "accentForeground" | "backgroundGradient" | "backgroundGradientDark" | "textAccent" | "borderFocused"> = {
  muted: palette.gray[400],
  surface: palette.gray[900],
  surfaceElevated: palette.gray[800],
  surfacePressed: palette.gray[700],
  textPrimary: palette.white,
  textSecondary: palette.gray[400],
  textTertiary: palette.gray[500],
  textInverse: palette.gray[900],
  border: palette.gray[700],
  overlayLight: "rgba(255, 255, 255, 0.1)",
  overlayDark: "rgba(0, 0, 0, 0.7)",
};

// ============================================
// Complete Theme Configurations
// ============================================

export const themes: Record<ColorTheme, Record<ThemeMode, ThemeColors>> = {
  purple: {
    light: {
      ...lightModeBase,
      accent: palette.purple.primary,
      accentLight: palette.purple.light,
      accentSoft: palette.purple.soft,
      accentForeground: palette.white,
      textAccent: palette.purple.primary,
      borderFocused: palette.purple.primary,
      backgroundGradient: ["#FDF8FF", "#FBF4FF", "#F8EFFC", "#FDF8FF"] as const,
      backgroundGradientDark: ["#1a1520", "#1f1a25", "#241f2a", "#1a1520"] as const,
    },
    dark: {
      ...darkModeBase,
      accent: palette.purple.primary,
      accentLight: palette.purple.light,
      accentSoft: palette.purple.softDark,
      accentForeground: palette.white,
      textAccent: palette.purple.light,
      borderFocused: palette.purple.primary,
      backgroundGradient: ["#1a1520", "#1f1a25", "#241f2a", "#1a1520"] as const,
      backgroundGradientDark: ["#1a1520", "#1f1a25", "#241f2a", "#1a1520"] as const,
    },
  },
  green: {
    light: {
      ...lightModeBase,
      accent: palette.green.primary,
      accentLight: palette.green.light,
      accentSoft: palette.green.soft,
      accentForeground: palette.black,
      textAccent: palette.green.primary,
      borderFocused: palette.green.primary,
      backgroundGradient: ["#F8FFFA", "#F4FFF7", "#EFFCF3", "#F8FFFA"] as const,
      backgroundGradientDark: ["#151a17", "#1a1f1c", "#1f2421", "#151a17"] as const,
    },
    dark: {
      ...darkModeBase,
      accent: palette.green.primary,
      accentLight: palette.green.light,
      accentSoft: palette.green.softDark,
      accentForeground: palette.black,
      textAccent: palette.green.light,
      borderFocused: palette.green.primary,
      backgroundGradient: ["#151a17", "#1a1f1c", "#1f2421", "#151a17"] as const,
      backgroundGradientDark: ["#151a17", "#1a1f1c", "#1f2421", "#151a17"] as const,
    },
  },
  neonBlue: {
    light: {
      ...lightModeBase,
      accent: palette.neonBlue.primary,
      accentLight: palette.neonBlue.light,
      accentSoft: palette.neonBlue.soft,
      accentForeground: palette.black,
      textAccent: palette.neonBlue.primary,
      borderFocused: palette.neonBlue.primary,
      backgroundGradient: ["#F0FDFF", "#E0FAFF", "#D0F5FF", "#F0FDFF"] as const,
      backgroundGradientDark: ["#0a1a1f", "#0f1f25", "#14242a", "#0a1a1f"] as const,
    },
    dark: {
      ...darkModeBase,
      accent: palette.neonBlue.primary,
      accentLight: palette.neonBlue.light,
      accentSoft: palette.neonBlue.softDark,
      accentForeground: palette.black,
      textAccent: palette.neonBlue.light,
      borderFocused: palette.neonBlue.primary,
      backgroundGradient: ["#0a1a1f", "#0f1f25", "#14242a", "#0a1a1f"] as const,
      backgroundGradientDark: ["#0a1a1f", "#0f1f25", "#14242a", "#0a1a1f"] as const,
    },
  },
};

// ============================================
// Shadow Presets
// ============================================

export const shadows = {
  /** For primary CTAs - uses accent color */
  accent: (accentColor: string) => ({
    shadowColor: accentColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }),

  /** Subtle shadow for secondary elements */
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  /** Medium shadow for cards */
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  /** Large shadow for elevated cards */
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },

  /** Deep shadow for hero images and modals */
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ============================================
// Gradient Presets
// ============================================

export const gradients = {
  /** Standard background gradient locations */
  backgroundLocations: [0, 0.3, 0.7, 1] as const,

  /** Dark overlay for images (bottom-heavy) */
  imageOverlay: ["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"] as const,
  imageOverlayLocations: [0, 0.5, 1] as const,

  /** Soft overlay for depth effect */
  softOverlay: ["transparent", "rgba(0,0,0,0.03)"] as const,
} as const;

// ============================================
// Helper Functions
// ============================================

/** Get theme colors for a specific color theme and mode */
export function getThemeColors(colorTheme: ColorTheme, mode: ThemeMode): ThemeColors {
  return themes[colorTheme][mode];
}

/** Get list of all available color themes */
export function getAvailableThemes(): ColorTheme[] {
  return Object.keys(themes) as ColorTheme[];
}

/** Theme metadata for UI display (e.g., theme picker) */
export const themeMetadata: Record<ColorTheme, { label: string; primaryColor: string }> = {
  purple: { label: "Purple", primaryColor: palette.purple.primary },
  green: { label: "Green", primaryColor: palette.green.primary },
  neonBlue: { label: "Neon Blue", primaryColor: palette.neonBlue.primary },
};

// Type export for use in components
export type { ThemeColors };

