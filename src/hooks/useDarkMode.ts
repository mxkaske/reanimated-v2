import React from "react";
import { DarkModeContext } from "../contexts";

export const useDarkMode = () => {
  const context = React.useContext(DarkModeContext);
  if (!context) {
    throw new Error(
      "Compound component has do live inside the StickyBarProvider"
    );
  }
  return context;
};
