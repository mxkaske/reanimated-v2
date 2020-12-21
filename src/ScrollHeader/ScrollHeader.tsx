import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Image } from "react-native";
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
const height = aspectRatio * width;

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

  const negativeY = useDerivedValue(() => tranlationY.value < 0);

  const scale = useDerivedValue(() =>
    negativeY.value ? (height - tranlationY.value) / height : 1
  );

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: negativeY.value ? tranlationY.value / 2 : 0,
      },
    ],
  }));

  const innerContainerStyle = useAnimatedProps(() => ({
    transform: [{ scale: scale.value }],
  }));

  const blurContainerStyle = useAnimatedStyle(() => ({
    height: height - tranlationY.value,
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(
      tranlationY.value,
      [-100, 0],
      [100, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Box backgroundColor="mainBackground" flex={1}>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <AnimatedBox style={[containerStyle]}>
          <AnimatedBox style={[innerContainerStyle]}>
            <Image source={assets[0]} style={{ height, width }} />
            <AnimatedBlur
              animatedProps={blurProps}
              style={[StyleSheet.absoluteFill, blurContainerStyle]}
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
        <Box backgroundColor="primary">
          <Text padding="m">{faker.lorem.paragraphs(10)}</Text>
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default ScrollHeader;
