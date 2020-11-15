import React from "react";
import { Dimensions, Pressable, StyleSheet, TextInput } from "react-native";
import { PanGestureHandler, RectButton } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Box, Text, useTheme } from "../components";

const { width } = Dimensions.get("window");
const balloonSize = 100;
const size = 50;
const borderSize = 8;
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const sliderConfig = {
  height: 2,
  width: width * 0.7,
  min: 0,
  max: 60,
};

interface BalloonProps {}
const Balloon = () => {
  const theme = useTheme();
  const isGestureActive = useSharedValue(false);
  const isPressActive = useSharedValue(false);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler<{ startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, velocityX }, ctx) => {
      translateX.value =
        translationX + ctx.startX >= 0
          ? translationX + ctx.startX <= sliderConfig.width
            ? translationX + ctx.startX
            : sliderConfig.width
          : 0;
      rotation.value = -velocityX / 50;
    },
    onEnd: () => {
      isGestureActive.value = false;
      rotation.value = 0;
    },
  });
  const isActive = useDerivedValue(
    () => isGestureActive.value || isPressActive.value
  );

  const animatedSize = useDerivedValue(() => {
    const currentSize = isActive.value ? size : size * (1 / 2);
    return withTiming(currentSize);
  });

  const style = useAnimatedStyle(() => {
    return {
      width: animatedSize.value,
      height: animatedSize.value,
      transform: [{ translateX: translateX.value }],
      borderRadius: withTiming(isActive.value ? size / 2 : size * (1 / 6)),
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    const currentSize = isActive.value ? size - borderSize : size * (1 / 4);
    return {
      width: withTiming(currentSize),
      height: withTiming(currentSize),
      borderRadius: withTiming(isActive.value ? (size - borderSize) / 2 : 0),
    };
  });

  const quantity = useDerivedValue(
    () =>
      `${Math.round(
        (translateX.value * sliderConfig.max) / sliderConfig.width
      )}`
  );
  const rotate = useDerivedValue(() =>
    withSpring(rotation.value, { overshootClamping: false })
  );
  const balloonProps = useAnimatedProps(() => ({
    height: withTiming(isActive.value ? balloonSize : 0),
    width: withTiming(isActive.value ? balloonSize : 0),
  }));

  const balloonContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translateX.value - rotation.value * 2),
      },
      { translateY: withTiming(isActive.value ? -balloonSize : 0) },
      { rotate: `${rotate.value}deg` },
    ],
    //height: withTiming(isActive.value ? balloonSize : 30),
    //width: withTiming(isActive.value ? balloonSize : 30),
  }));

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Title />
      <Box flex={1} justifyContent="flex-end">
        <Box
          height={size}
          flexDirection="row"
          //backgroundColor="baseDescription"
          alignItems="center"
        >
          <Box flex={1} justifyContent="center">
            <SliderLine translateX={translateX} />
          </Box>
          <AnimatedBox
            position="absolute"
            height={balloonSize}
            width={balloonSize}
            alignItems="center"
            justifyContent="center"
          >
            <AnimatedBox position="absolute" style={balloonContainerStyle}>
              <AnimatedSvg viewBox="0 0 40 30" animatedProps={balloonProps}>
                <Path
                  fill={theme.colors.tertiary}
                  d="M 20 0 Q 40 0 20 30 Q 0 0 20 0 M 20 30 Q 25 34 20 34 Q 15 34 20 30 Z"
                />
              </AnimatedSvg>
              <BalloonText quantity={quantity} isActive={isActive} />
            </AnimatedBox>
            <PanGestureHandler onGestureEvent={onGestureEvent}>
              <AnimatedBox backgroundColor="tertiary" style={style}>
                <Pressable
                  onPressIn={() => {
                    isPressActive.value = true;
                  }}
                  onPressOut={() => {
                    isPressActive.value = false;
                  }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AnimatedBox
                    backgroundColor="mainBackground"
                    style={innerStyle}
                  />
                </Pressable>
              </AnimatedBox>
            </PanGestureHandler>
          </AnimatedBox>
        </Box>
      </Box>
      <Box flex={1} alignItems="flex-end" justifyContent="flex-end">
        <Button />
      </Box>
    </Box>
  );
};

export default Balloon;

const Title = () => (
  <Text
    variant="hero"
    color="tertiary"
    padding="m"
  >{`Choose\nBalloon\nquantity`}</Text>
);

interface SliderLineProps {
  translateX: Animated.SharedValue<number>;
}

const SliderLine = ({ translateX }: SliderLineProps) => {
  return (
    <Box
      height={sliderConfig.height}
      width={sliderConfig.width}
      backgroundColor="baseDescription"
      alignSelf="center"
    >
      <AnimatedBox
        height={sliderConfig.height}
        style={useAnimatedStyle(() => ({
          width: translateX.value,
        }))}
        backgroundColor="tertiary"
      />
    </Box>
  );
};

interface BalloonTextProps {
  quantity: Animated.SharedValue<string>;
  isActive: Animated.SharedValue<boolean>;
}

const BalloonText = ({ quantity, isActive }: BalloonTextProps) => {
  const theme = useTheme();
  const animatedProps = useAnimatedProps(() => ({
    text: quantity.value,
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    fontSize: withTiming(isActive.value ? 18 : 1),
    color: theme.colors.mainBackground,
    paddingBottom: 10,
  }));
  return (
    <Box
      style={StyleSheet.absoluteFill}
      justifyContent="center"
      alignItems="center"
    >
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        value={quantity.value}
        style={animatedStyle}
        animatedProps={animatedProps}
      />
    </Box>
  );
};

const Button = () => {
  return (
    <Box
      width={100}
      height={50}
      backgroundColor="secondary"
      style={{ borderRadius: 10 }}
      margin="xl"
      overflow="hidden"
    >
      <RectButton style={{ flex: 1 }} onPress={() => null}>
        <Box
          flex={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding="s"
        >
          <Text textAlign="center">Next</Text>
          <Text textAlign="center">+</Text>
        </Box>
      </RectButton>
    </Box>
  );
};
