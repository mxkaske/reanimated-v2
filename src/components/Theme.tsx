import React, { ReactNode, useContext } from "react";
import {
  createTheme,
  createBox,
  createText,
  useTheme as useReTheme,
  ThemeProvider as ReStyleThemeProvider,
} from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";

const palette = {
  redPrimary: "#FF4000",
  beigePrimary: "#FAAA8D",
  bluePrimary: "#50B2C0",
  purplePrimary: "#9369C9",
  greyPrimary: "#ADB5BD",

  black: "#201E1F",
  white: "#FEEFDD",
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    primary: palette.redPrimary,
    secondary: palette.bluePrimary,
    tertiary: palette.purplePrimary,
    baseText: palette.black,
    baseDescription: palette.greyPrimary,
    baseTitle: palette.bluePrimary,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    hero: {
      fontSize: 40,
      fontFamily: "Epilogue-Bold",
      color: "baseTitle",
    },
    title: {
      fontSize: 28,
      fontFamily: "Epilogue-Bold",
      color: "baseTitle",
    },
    subtitle: {
      fontSize: 26,
      lineHeight: 30,
      fontFamily: "Epilogue-Medium",
      color: "baseText",
    },
    body: {
      fontSize: 18,
      fontFamily: "Epilogue-Regular",
      color: "baseText",
    },
    button: {
      fontSize: 18,
      fontFamily: "Epilogue-Regular",
      color: "secondary",
      textAlign: "center",
    },
    description: {
      fontSize: 15,
      fontFamily: "Epilogue-Light",
      color: "baseDescription",
    },
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
});

const darkTheme = {
  ...theme,
  colors: {
    mainBackground: palette.black,
    mainForeground: palette.white,
    primary: palette.redPrimary,
    secondary: palette.beigePrimary,
    tertiary: palette.purplePrimary,
    baseText: palette.white,
    baseTitle: palette.redPrimary,
    baseDescription: palette.white,
  },
};

interface ThemeProvideProps {
  children: ReactNode;
  darkMode?: boolean;
}

export const ThemeProvider = ({ children, darkMode }: ThemeProvideProps) => {
  return (
    <ReStyleThemeProvider theme={darkMode ? darkTheme : theme}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      {children}
    </ReStyleThemeProvider>
  );
};

export type Theme = typeof theme;
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const useTheme = () => useReTheme<Theme>();

Text.defaultProps = {
  variant: "body",
};

export default theme;
