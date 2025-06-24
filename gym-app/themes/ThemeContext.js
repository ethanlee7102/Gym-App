import React, { createContext, useContext, useState } from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [isDark, setIsDark] = useState(false); // default to light

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children(theme)}
    </ThemeContext.Provider>
  );
};

export const useThemeToggle = () => useContext(ThemeContext);
