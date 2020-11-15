import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRoutes } from "./Navigation";
import { Theme } from "./Theme";
import DefaultAnimation from "../DefaultAnimation";
import Home from "../Home";
import RoundedIconButton from "./RoundedIconButton";
import { useTheme } from "@shopify/restyle";
import { ScrollAnimation } from "../ScrollAnimation";
import { ColorIntensity } from "../ColorIntensity";
import { Loading } from "../Loading";
import App from "../../App";
import { Pagination } from "../Pagination";
import { Mask } from "../Mask";
import { Balloon } from "../Balloon";

const AppStack = createStackNavigator<AppRoutes>();

interface AppContainer {
  darkMode: boolean;
  setDarkMode: () => void;
}

const AppContainer = ({ darkMode, setDarkMode }: AppContainer) => {
  const theme = useTheme<Theme>();
  return (
    <AppStack.Navigator
      screenOptions={{
        headerBackTitleStyle: {
          fontFamily: "Epilogue-Regular",
        },
        headerTitleStyle: {
          fontFamily: "Epilogue-Regular",
        },
        headerStyle: {
          backgroundColor: theme.colors.mainBackground,
        },
        headerTintColor: theme.colors.mainForeground,
        headerRight: () => (
          <RoundedIconButton
            onPress={setDarkMode}
            name={darkMode ? "sun" : "moon"}
            size={40}
            color="tertiary"
            backgroundColor="mainBackground"
          />
        ),
      }}
    >
      <AppStack.Screen name="Home" component={Home} />
      <AppStack.Screen name="DefaultAnimation" component={DefaultAnimation} />
      <AppStack.Screen
        name="ScrollAnimation"
        component={ScrollAnimation}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="ColorIntensity"
        component={ColorIntensity}
        options={{ gestureEnabled: false }}
      />
      <AppStack.Screen name="Loading" component={Loading} />
      <AppStack.Screen name="Pagination" component={Pagination} />
      <AppStack.Screen
        name="Mask"
        component={Mask}
        options={{ gestureEnabled: false }}
      />
      <AppStack.Screen
        name="Balloon"
        component={Balloon}
        options={{ gestureEnabled: false }}
      />
    </AppStack.Navigator>
  );
};

export default AppContainer;
