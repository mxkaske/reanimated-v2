import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Box, Text, useTheme } from "../components";
import MaskedView from "@react-native-community/masked-view";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import faker from "faker";
import RoundedIcon from "../components/RoundedIcon";

const radius = 50;
const staticPropgress = 0.4;
const AnimatedBox = Animated.createAnimatedComponent(Box);

interface MaskProps {}
const Mask = () => {
  const x = useSharedValue<number>(50);
  const { width } = useWindowDimensions();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      //@ts-expect-error
      x.value = ctx.startX + event.translationX;
    },
    onEnd: (_) => {
      x.value = withSpring(50);
    },
  });

  const animatedPanStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  const progress = useDerivedValue(() => x.value / width);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${100 * progress.value}%`,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    width: `${100 * progress.value}%`,
  }));

  return (
    <Box flex={1}>
      <Box flex={1} flexDirection="row">
        <AnimatedBox style={animatedStyle} backgroundColor="secondary" />
        <Box flex={1} backgroundColor="tertiary" />
      </Box>
      <MaskedView
        style={{ ...StyleSheet.absoluteFillObject }}
        maskElement={maskElement}
      >
        <Box flex={1} flexDirection="row">
          <AnimatedBox
            //width={`${100 * staticPropgress}%`}
            style={animatedStyle2}
            backgroundColor="mainBackground"
          />
          <Box flex={1} backgroundColor="mainForeground" />
        </Box>
      </MaskedView>
      <Box position="absolute" left={0} bottom={100}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <AnimatedBox
            height={50}
            width={50}
            backgroundColor="primary"
            justifyContent="center"
            alignItems="center"
            borderBottomRightRadius={25}
            borderTopRightRadius={25}
            style={animatedPanStyle}
          >
            <RoundedIcon
              name="arrow-right"
              color="mainForeground"
              size={30}
              backgroundColor={undefined}
            />
          </AnimatedBox>
        </PanGestureHandler>
      </Box>
    </Box>
  );
};

const maskElement = (
  <Box justifyContent="center" style={{ ...StyleSheet.absoluteFillObject }}>
    <Text padding="s">{faker.lorem.paragraphs(10)}</Text>
  </Box>
);

const Masked = (
  <MaskedView
    style={{ ...StyleSheet.absoluteFillObject }}
    maskElement={maskElement}
  >
    <Box flex={1} flexDirection="row">
      <Box
        width={`${100 * staticPropgress}%`}
        backgroundColor="mainBackground"
      />
      <Box flex={1} backgroundColor="mainForeground" />
    </Box>
  </MaskedView>
);

export default Mask;
