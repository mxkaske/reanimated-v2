import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Button from "./Button";
import { Box } from "./Theme";

const AnimatedBox = Animated.createAnimatedComponent(Box);
interface CircularAnimationProps {
  size: number;
  smallSize: number;
  doAnimation: Animated.SharedValue<boolean>;
}

const CircularAnimation = ({
  size,
  smallSize,
  doAnimation,
}: CircularAnimationProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(doAnimation.value ? 0 : 1),
    borderRadius: withTiming(doAnimation.value ? size : smallSize),
    height: withTiming(doAnimation.value ? size : smallSize),
    width: withTiming(doAnimation.value ? size : smallSize),
  }));
  return (
    <Box flexDirection="row" alignItems="center">
      <Box
        height={size}
        width={size}
        style={{ borderRadius: size / 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          position="absolute"
          top={0}
          bottom={0}
          right={0}
          left={0}
          justifyContent="center"
          alignItems="center"
        >
          <AnimatedBox style={animatedStyle} backgroundColor="mainBackground" />
        </Box>
      </Box>
    </Box>
  );
};

CircularAnimation.defaultProps = {
  size: 100,
  smallSize: 30,
};

export default CircularAnimation;
