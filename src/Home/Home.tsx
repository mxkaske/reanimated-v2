import React from "react";
import { Image, Dimensions } from "react-native";
import { Box, Text } from "../components";
import { AppNavigationProps, AppRoutes } from "../components/Navigation";
import BorderlessTap from "../components/BorderlessTap";

export const assets = [require("../../assets/illustration1.png")];

const { width } = Dimensions.get("screen");

interface Screen {
  label: string;
  screen: keyof AppRoutes;
}

const examples: Screen[] = [
  {
    label: "Default Animation",
    screen: "DefaultAnimation",
  },
  {
    label: "Scroll Animation",
    screen: "ScrollAnimation",
  },
];

const Home = ({ navigation }: AppNavigationProps<"Home">) => {
  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      justifyContent="space-between"
    >
      <Box>
        {examples.map((item) => (
          <BorderlessTap
            key={item.label}
            onPress={() => navigation.push(item.screen)}
          >
            <Text textAlign="center" padding="m">
              {item.label}
            </Text>
          </BorderlessTap>
        ))}
      </Box>
      <Image
        source={assets[0]}
        style={{ width, height: 300 }}
        resizeMode="contain"
      />
    </Box>
  );
};

export default Home;
