import React, { useState } from "react";
import { ThemeProvider, LoadAssets } from "./src/components";
import AppContainer from "./src/components/AppContainer";
import { assets as homeAssets } from "./src/Home";

const fonts = {
  "Epilogue-Bold": require("./assets/fonts/Epilogue-Bold.ttf"),
  "Epilogue-Light": require("./assets/fonts/Epilogue-Light.ttf"),
  "Epilogue-Regular": require("./assets/fonts/Epilogue-Regular.ttf"),
  "Epilogue-Medium": require("./assets/fonts/Epilogue-Medium.ttf"),
  "Epilogue-SemiBold": require("./assets/fonts/Epilogue-SemiBold.ttf")
};

const assets = [...homeAssets];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeProvider {...{ darkMode }}>
      <LoadAssets {...{ fonts, assets }}>
        <AppContainer
          setDarkMode={() => setDarkMode(prev => !prev)}
          {...{ darkMode }}
        />
      </LoadAssets>
    </ThemeProvider>
  );
}
