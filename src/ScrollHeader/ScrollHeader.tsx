import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { Box, Text } from "../components";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import faker from "faker";
import { BlurView } from "expo-blur";

export const assets = [require("./assets/tree.jpg")];
const AnimatedBlur = Animated.createAnimatedComponent(BlurView);
const AnimatedBox = Animated.createAnimatedComponent(Box);

const HEIGHT = 340;
const WIDTH = 546;
const aspectRatio = HEIGHT / WIDTH;
const { width } = Dimensions.get("window");

const ScrollHeader = () => {
  const tranlationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tranlationY.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      tranlationY.value = withSpring(0);
    },
  });

  const sticky = useDerivedValue(() =>
    tranlationY.value >= 0 ? 0 : tranlationY.value
  );
  const innerContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          sticky.value,
          [-aspectRatio * width, 0],
          [2, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
    marginTop: -5,
  }));

  const outerContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      sticky.value,
      [-aspectRatio * width, 0],
      [2 * aspectRatio * width, aspectRatio * width],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        translateY: sticky.value,
      },
    ],
    marginTop: -5,
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(
      sticky.value,
      [-100, 0],
      [100, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Box backgroundColor="mainBackground" flex={1}>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <AnimatedBox style={[outerContainerStyle]}>
          <AnimatedBox style={[innerContainerStyle]}>
            <Animated.Image
              source={assets[0]}
              style={{ width: width, height: aspectRatio * width }}
            />
            <AnimatedBlur
              animatedProps={blurProps}
              style={[StyleSheet.absoluteFill]}
            ></AnimatedBlur>
          </AnimatedBox>
          <Box
            justifyContent="center"
            alignItems="center"
            style={[StyleSheet.absoluteFill]}
          >
            <ActivityIndicator />
          </Box>
        </AnimatedBox>
        <Text padding="m">{faker.lorem.paragraphs(10)}</Text>
      </Animated.ScrollView>
    </Box>
  );
};

export default ScrollHeader;
