import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Uniwind, useUniwind } from "uniwind";
import * as SecureStore from "expo-secure-store";
import { View } from "react-native";

type ThemeName = "light" | "dark";
type ColorTheme = "purple" | "green";

const COLOR_THEME_STORAGE_KEY = "app-color-theme";

type AppThemeContextType = {
  currentTheme: string;
  colorTheme: ColorTheme;
  isLight: boolean;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useUniwind();
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("purple");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load color theme from storage on mount
  useEffect(() => {
    const loadColorTheme = async () => {
      try {
        const stored = await SecureStore.getItemAsync(COLOR_THEME_STORAGE_KEY);
        if (stored === "purple" || stored === "green") {
          setColorThemeState(stored);
        }
      } catch (error) {
        console.error("Failed to load color theme:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadColorTheme();
  }, []);

  const isLight = useMemo(() => {
    return theme === "light";
  }, [theme]);

  const isDark = useMemo(() => {
    return theme === "dark";
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme);
  }, []);

  const setColorTheme = useCallback(async (newColorTheme: ColorTheme) => {
    try {
      await SecureStore.setItemAsync(COLOR_THEME_STORAGE_KEY, newColorTheme);
      setColorThemeState(newColorTheme);
    } catch (error) {
      console.error("Failed to save color theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    Uniwind.setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  const value = useMemo(
    () => ({
      currentTheme: theme,
      colorTheme,
      isLight,
      isDark,
      setTheme,
      setColorTheme,
      toggleTheme,
    }),
    [theme, colorTheme, isLight, isDark, setTheme, setColorTheme, toggleTheme],
  );

  // Apply color theme class to root
  const colorThemeClass = `color-theme-${colorTheme}`;

  return (
    <View className={colorThemeClass} style={{ flex: 1 }}>
      <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
    </View>
  );
};

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
}
