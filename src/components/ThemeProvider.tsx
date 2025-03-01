"use client";
import { createContext, useState, useEffect } from "react";
import { ReactNode } from "react";
import {
  getColor,
  changeColor,
  getSecondaryColor,
} from "@/actions/gestion/action";

export const ThemeContext = createContext({
  primaryColor: "#000000",
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setPrimaryColor: (color: string) => {},
  secondaryColor: "#000000",
  setSecondaryColor: (color: string) => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");

  useEffect(() => {
    async function fetchColor() {
      const theme = await getColor();
      const secondaryTheme = await getSecondaryColor();
      if (theme && theme.length > 0) {
        setPrimaryColor(theme || "#000000");
        setSecondaryColor(secondaryTheme || "#000000");
      }
    }
    fetchColor();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", primaryColor);
    document.documentElement.style.setProperty(
      "--color-secondary",
      secondaryColor,
    );
    changeColor(primaryColor);
  }, [primaryColor, secondaryColor]);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
