import React from "react";
import { Dimensions } from "react-native";
import { Box, Text } from "../components";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import faker from "faker";

export const assets = [require("./assets/tree.jpg")];

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
  const imageStyle = useAnimatedStyle(() => ({
    width,
    height: aspectRatio * width,
    transform: [
      {
        translateY: sticky.value,
      },
      {
        scale: interpolate(
          tranlationY.value,
          [-HEIGHT, 0],
          [2, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
    marginTop: -5,
  }));

  return (
    <Box backgroundColor="mainBackground" flex={1}>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        <Animated.Image source={assets[0]} style={[imageStyle]} />
        <Box backgroundColor="mainBackground">
          <Text padding="m">{faker.lorem.paragraphs(10)}</Text>
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default ScrollHeader;
