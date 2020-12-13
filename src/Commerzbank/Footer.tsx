import React from "react";
import { StyleSheet } from "react-native";
import { Box, Text, useTheme } from "../components";
import { Feather as Icon } from "@expo/vector-icons";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const HEIGHT = 60;
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface FooterProps {
  isEnd: Animated.SharedValue<boolean>;
  scrollToEnd: () => void;
}

const Footer = ({ isEnd, scrollToEnd }: FooterProps) => {
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isEnd.value ? -HEIGHT : 0),
      },
    ],
  }));

  const animatedProps = useAnimatedProps(() => ({
    color: isEnd.value ? theme.colors.baseDescription : theme.colors.tertiary,
  }));

  const onPress = () => console.log(isEnd.value ? "end" : scrollToEnd());

  return (
    <Box
      height={HEIGHT}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      overflow="hidden"
    >
      <AnimatedBox style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Box height={HEIGHT} backgroundColor="baseDescription" />
        <Box height={HEIGHT} backgroundColor="tertiary" />
      </AnimatedBox>
      <AnimatedIcon
        name="chevron-left"
        size={20}
        animatedProps={animatedProps}
      />
      <Text onPress={onPress}>{isEnd ? "Check out" : "Scroll down"}</Text>
    </Box>
  );
};

export default Footer;
