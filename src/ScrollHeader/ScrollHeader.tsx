import React, { useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Image } from "react-native";
import { Box, Text } from "../components";
import Animated, {
  Extrapolate,
  interpolate,
  runOnUI,
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
const AnimatedActivityIndicator = Animated.createAnimatedComponent(
  ActivityIndicator
);
const AnimatedBox = Animated.createAnimatedComponent(Box);

const HEIGHT = 340;
const WIDTH = 546;
const aspectRatio = HEIGHT / WIDTH;
const { width } = Dimensions.get("window");
const height = aspectRatio * width;
const REFRESH_THRESHOLD = -100;

const ScrollHeader = () => {
  const [text, setText] = useState(faker.lorem.paragraphs(10));
  const tranlationY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tranlationY.value = event.contentOffset.y;
      if (tranlationY.value <= REFRESH_THRESHOLD) {
        isRefreshing.value = true;
      }
    },
    onEndDrag: () => {
      tranlationY.value = withSpring(0);
    },
    onMomentumEnd: () => {
      isRefreshing.value = false;
      //setText(faker.lorem.paragraphs(10));
    },
  });

  //useAnimationReaction => if (tranlationY === 0 && isRefreshing === true) { setText(); isRefreshind.value = false }

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
    marginTop: -10,
  }));

  const innerContainerStyle = useAnimatedProps(() => ({
    transform: [{ scale: scale.value }],
  }));

  const blurContainerStyle = useAnimatedStyle(() => ({
    height: height,
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(
      tranlationY.value,
      [REFRESH_THRESHOLD, 0],
      [-REFRESH_THRESHOLD, 0],
      Extrapolate.CLAMP
    ),
  }));

  const indicatorContainerStyle = useAnimatedStyle(() => ({
    opacity: isRefreshing.value ? 1 : 0,
  }));

  const indicatorProps = useAnimatedProps(() => ({
    animating: isRefreshing.value,
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
          <AnimatedBox
            justifyContent="center"
            alignItems="center"
            style={[StyleSheet.absoluteFill, indicatorContainerStyle]}
          >
            <AnimatedActivityIndicator
              animatedProps={indicatorProps}
              hidesWhenStopped={false}
              color={"#fff"}
            />
          </AnimatedBox>
        </AnimatedBox>
        <Box>
          <Text padding="m">{text}</Text>
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default ScrollHeader;
