import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";
import * as SecureStore from "expo-secure-store";

import {
  type ColorTheme,
  type ThemeMode,
  type ThemeColors,
  getThemeColors,
  getAvailableThemes,
  themeMetadata,
  shadows,
  gradients,
  palette,
} from "@/src/theme/colors";

const COLOR_THEME_STORAGE_KEY = "app-color-theme";

type AppThemeContextType = {
  // Theme state
  currentTheme: string;
  colorTheme: ColorTheme;
  themeMode: ThemeMode;
  isLight: boolean;
  isDark: boolean;
  
  // Theme setters
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleThemeMode: () => void;
  
  // Theme colors (computed based on colorTheme + light/dark mode)
  colors: ThemeColors;
  
  // Utility exports
  shadows: typeof shadows;
  gradients: typeof gradients;
  palette: typeof palette;
  
  // Theme discovery (for building theme pickers)
  availableThemes: ColorTheme[];
  themeMetadata: typeof themeMetadata;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

// Helper to parse the combined theme name (e.g., "purple-light" -> { color: "purple", mode: "light" })
function parseThemeName(themeName: string): { color: ColorTheme; mode: ThemeMode } {
  // Handle default "light" and "dark" themes (before custom themes are loaded)
  if (themeName === "light" || themeName === "dark") {
    return { color: "purple", mode: themeName };
  }
  
  // Parse combined theme names like "purple-light", "green-dark"
  const parts = themeName.split("-");
  if (parts.length === 2) {
    const [color, mode] = parts;
    const availableThemes = getAvailableThemes();
    if (availableThemes.includes(color as ColorTheme) && (mode === "light" || mode === "dark")) {
      return { color: color as ColorTheme, mode: mode as ThemeMode };
    }
  }
  
  // Fallback
  return { color: "purple", mode: "light" };
}

// Helper to build combined theme name
function buildThemeName(color: ColorTheme, mode: ThemeMode): string {
  return `${color}-${mode}`;
}

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme: currentTheme } = useUniwind();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Parse the current theme to get color and mode
  const { color: colorTheme, mode: themeMode } = useMemo(
    () => parseThemeName(currentTheme),
    [currentTheme]
  );
  
  const isLight = themeMode === "light";
  const isDark = themeMode === "dark";

  // Load saved color theme on mount and apply it
  useEffect(() => {
    const loadAndApplyTheme = async () => {
      try {
        const storedColorTheme = await SecureStore.getItemAsync(COLOR_THEME_STORAGE_KEY);
        const availableThemes = getAvailableThemes();
        
        // Determine the color theme to use
        const colorToUse = storedColorTheme && availableThemes.includes(storedColorTheme as ColorTheme)
          ? storedColorTheme as ColorTheme
          : "purple";
        
        // Get current mode from the existing theme
        const { mode: currentMode } = parseThemeName(currentTheme);
        
        // Apply the combined theme
        const combinedTheme = buildThemeName(colorToUse, currentMode);
        // Cast to any since custom themes are registered in metro.config.js
        // Types will be auto-generated in uniwind-types.d.ts after restart
        Uniwind.setTheme(combinedTheme as any);
      } catch (error) {
        console.error("Failed to load color theme:", error);
        // Apply default theme on error
        Uniwind.setTheme("purple-light" as any);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadAndApplyTheme();
  }, []);

  // Set the theme mode (light/dark) while preserving color theme
  const setThemeMode = useCallback((newMode: ThemeMode) => {
    const newTheme = buildThemeName(colorTheme, newMode);
    Uniwind.setTheme(newTheme as any);
  }, [colorTheme]);

  // Set the color theme while preserving light/dark mode
  const setColorTheme = useCallback(async (newColorTheme: ColorTheme) => {
    try {
      await SecureStore.setItemAsync(COLOR_THEME_STORAGE_KEY, newColorTheme);
      const newTheme = buildThemeName(newColorTheme, themeMode);
      Uniwind.setTheme(newTheme as any);
    } catch (error) {
      console.error("Failed to save color theme:", error);
    }
  }, [themeMode]);

  // Toggle between light and dark mode
  const toggleThemeMode = useCallback(() => {
    const newMode: ThemeMode = isLight ? "dark" : "light";
    const newTheme = buildThemeName(colorTheme, newMode);
    Uniwind.setTheme(newTheme as any);
  }, [colorTheme, isLight]);

  // Compute theme colors based on current colorTheme and light/dark mode
  const colors = useMemo(() => {
    return getThemeColors(colorTheme, themeMode);
  }, [colorTheme, themeMode]);

  const availableThemes = useMemo(() => getAvailableThemes(), []);

  const value = useMemo(
    () => ({
      currentTheme,
      colorTheme,
      themeMode,
      isLight,
      isDark,
      setThemeMode,
      setColorTheme,
      toggleThemeMode,
      colors,
      shadows,
      gradients,
      palette,
      availableThemes,
      themeMetadata,
    }),
    [currentTheme, colorTheme, themeMode, isLight, isDark, setThemeMode, setColorTheme, toggleThemeMode, colors, availableThemes],
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
