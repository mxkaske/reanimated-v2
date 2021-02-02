import React from "react";

export type DarkModeContextType = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

// @ts-ignore
export const DarkModeContext = React.createContext<DarkModeContextType>();

export const DarkModeProvider = DarkModeContext.Provider;
