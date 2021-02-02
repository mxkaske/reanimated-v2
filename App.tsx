import React, { useState } from "react";
import { ThemeProvider, LoadAssets } from "./src/components";
import AppContainer from "./src/components/AppContainer";
import { assets as homeAssets } from "./src/Home";
import { assets as scrollHeaderAssets } from "./src/ScrollHeader";
import { enableScreens } from "react-native-screens";
import { DarkModeProvider } from "./src/contexts";
enableScreens();

const fonts = {
  "Epilogue-Bold": require("./assets/fonts/Epilogue/Epilogue-Bold.ttf"),
  "Epilogue-Light": require("./assets/fonts/Epilogue/Epilogue-Light.ttf"),
  "Epilogue-Regular": require("./assets/fonts/Epilogue/Epilogue-Regular.ttf"),
  "Epilogue-Medium": require("./assets/fonts/Epilogue/Epilogue-Medium.ttf"),
  "Epilogue-SemiBold": require("./assets/fonts/Epilogue/Epilogue-SemiBold.ttf"),
  "Poppins-Light": require("./assets/fonts/Poppins/Poppins-Light.ttf"),
  "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
};

const assets = [...homeAssets, ...scrollHeaderAssets];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeProvider value={{ darkMode, setDarkMode }}>
      <ThemeProvider {...{ darkMode }}>
        <LoadAssets {...{ fonts, assets }}>
          <AppContainer
            setDarkMode={() => setDarkMode((prev) => !prev)}
            {...{ darkMode }}
          />
        </LoadAssets>
      </ThemeProvider>
    </DarkModeProvider>
  );
}
