import React from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing
} from "react-native-reanimated";
import { Box, Button, useTheme } from "../components";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const DefaultAnimation = () => {
  const theme = useTheme();
  const randomWidth = useSharedValue(10);
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1)
  };
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config)
    };
  });

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      backgroundColor="mainBackground"
    >
      <AnimatedBox
        style={[
          {
            width: 100,
            height: 80,
            backgroundColor: theme.colors.mainForeground,
            margin: 30
          },
          style
        ]}
      />
      <Button
        label="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </Box>
  );
};

export default DefaultAnimation;
