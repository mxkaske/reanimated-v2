import React, { useEffect, useLayoutEffect, useState } from "react";
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
const REFRESH_THRESHOLD = -150;

const ScrollHeader = () => {
  const [text, setText] = useState(faker.lorem.paragraphs(10));
  const [trigger, setTrigger] = useState(false);
  const scrollY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      if (scrollY.value <= REFRESH_THRESHOLD) {
        isRefreshing.value = true;
      }
    },
    onEndDrag: () => {
      scrollY.value = withSpring(0);
    },
    onMomentumEnd: () => {
      if (isRefreshing.value) setTrigger(true);
      isRefreshing.value = false;
    },
  });

  useEffect(() => {
    if (trigger) {
      setText(faker.lorem.paragraphs(10));
      setTrigger(false);
    }
  }, [trigger]);

  const bannerContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: scrollY.value < 0 ? scrollY.value / 2 : 0,
      },
    ],
    marginTop: -20,
  }));

  const innerBannerContainerStyle = useAnimatedProps(() => ({
    transform: [
      { scale: scrollY.value < 0 ? (height - scrollY.value) / height : 1 },
    ],
  }));

  const blurContainerStyle = useAnimatedStyle(() => ({
    height: height,
  }));

  const blurProps = useAnimatedProps(() => ({
    intensity: interpolate(
      scrollY.value,
      [REFRESH_THRESHOLD, 0],
      [100, 0],
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
        <AnimatedBox style={[bannerContainerStyle]}>
          <AnimatedBox style={[innerBannerContainerStyle]}>
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
        <Box style={{ zIndex: -1 }}>
          <Text padding="m">{text}</Text>
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default ScrollHeader;
