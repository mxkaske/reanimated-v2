import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRoutes, RootRoutes } from "./Navigation";
import { Theme } from "./Theme";
import DefaultAnimation from "../screens/DefaultAnimation";
import Home from "../screens/Home";
import RoundedIconButton from "./RoundedIconButton";
import { useTheme } from "@shopify/restyle";
import { ScrollAnimation } from "../screens/ScrollAnimation";
import { ColorIntensity } from "../screens/ColorIntensity";
import { Pagination } from "../screens/Pagination";
import { Mask } from "../screens/Mask";
import { Balloon } from "../screens/Balloon";
import { Commerzbank } from "../screens/Commerzbank";
import { ScrollHeader } from "../screens/ScrollHeader";
import { Modal } from "../screens/Modal";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { useDarkMode } from "../hooks/useDarkMode";

const RootStack = createNativeStackNavigator<RootRoutes>();
const AppStack = createStackNavigator<AppRoutes>();

const RootStackScreen = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="App"
        component={AppStackScreen} // missing types (on hover)
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Modal"
        component={Modal}
        options={{ stackPresentation: "formSheet" }}
      />
    </RootStack.Navigator>
  );
};

const AppStackScreen = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkMode, setDarkMode } = useDarkMode();
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
        headerLeft: () => (
          <RoundedIconButton
            onPress={() => navigation.navigate("Modal")}
            name="archive"
            size={40}
            iconRatio={0.6}
            color="tertiary"
            backgroundColor="mainBackground"
          />
        ),
        headerRight: () => (
          <RoundedIconButton
            onPress={() => setDarkMode((prev) => !prev)}
            name={darkMode ? "sun" : "moon"}
            size={40}
            iconRatio={0.6}
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
      <AppStack.Screen name="ColorIntensity" component={ColorIntensity} />
      <AppStack.Screen name="Pagination" component={Pagination} />
      <AppStack.Screen name="Mask" component={Mask} />
      <AppStack.Screen
        name="Balloon"
        component={Balloon}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Commerzbank"
        component={Commerzbank}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="ScrollHeader"
        component={ScrollHeader}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
};

interface AppContainer {
  darkMode: boolean;
  setDarkMode: () => void;
}

const AppContainer = ({ darkMode, setDarkMode }: AppContainer) => {
  return <RootStackScreen />;
};

export default AppContainer;
