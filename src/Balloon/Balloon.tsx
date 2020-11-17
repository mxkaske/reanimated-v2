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
  withDecay,
  Easing,
  delay,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";
import { Box, Text, useTheme, Header } from "../components";
import { AppNavigationProps } from "../components/Navigation";

const d =
  "M 8 4 A 1 1 0 0 0 0 4 C 0 5 1 7 4 9 C 7 7 8 5 8 4 L 8 4 M 4 9 C 2 10 4 10 4 10 C 4 10 6 10 4 9 Z";
const { width } = Dimensions.get("window");
const DURATION_MIN = 300;
const DURATION = 400;
const DURATION_MAX = 600;
const balloonSize = 80;
const size = 50;
const borderSize = 5;
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const sliderConfig = {
  height: 2,
  width: width * 0.7,
  min: 0,
  max: 70,
};

interface BalloonProps {}
const Balloon = ({ navigation }: AppNavigationProps<"Balloon">) => {
  const theme = useTheme();
  const isGestureActive = useSharedValue(false);
  const isPressActive = useSharedValue(false);
  const translateX = useSharedValue(0);
  const velocity = useSharedValue(0);
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
      velocity.value = -velocityX;
    },
    onEnd: () => {
      isGestureActive.value = false;
      velocity.value = 0;
    },
  });
  const isActive = useDerivedValue(
    () => isGestureActive.value || isPressActive.value
  );

  const rotation = useDerivedValue(() => velocity.value / 20);

  const animatedSize = useDerivedValue(() => {
    const currentSize = isActive.value ? size : size / 2;
    return withTiming(currentSize, { duration: DURATION_MAX });
  });

  const style = useAnimatedStyle(() => {
    return {
      width: animatedSize.value,
      height: animatedSize.value,
      transform: [{ translateX: translateX.value }],
      borderRadius: withTiming(isActive.value ? size / 2 : size * (1 / 6), {
        duration: DURATION_MAX,
      }),
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    const currentSize = isActive.value ? size - borderSize : size * (1 / 6);
    return {
      width: withTiming(currentSize, { duration: DURATION_MAX }),
      height: withTiming(currentSize, { duration: DURATION_MAX }),
      borderRadius: withTiming(isActive.value ? (size - borderSize) / 2 : 0, {
        duration: DURATION_MAX,
      }),
    };
  });

  const quantity = useDerivedValue(
    () =>
      `${Math.round(
        (translateX.value * sliderConfig.max) / sliderConfig.width
      )}`
  );
  const rotate = useDerivedValue(() => withSpring(rotation.value));
  const balloonProps = useAnimatedProps(() => ({
    height: withTiming(isActive.value ? balloonSize : 0, {
      duration: isActive.value ? DURATION_MIN : DURATION,
    }),
    width: withTiming(isActive.value ? balloonSize : 0, {
      duration: isActive.value ? DURATION_MIN : DURATION,
    }),
  }));

  const balloonContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(translateX.value - rotation.value / 4, {
          damping: 10,
          mass: 1,
          stiffness: 50,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        }),
      },
      {
        translateY: withTiming(isActive.value ? -balloonSize : 0, {
          duration: isActive.value ? DURATION_MAX : DURATION,
        }),
      },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <>
      <Header
        left={{ icon: "chevron-left", onPress: () => navigation.goBack() }}
      />
      <Box flex={1} paddingTop="l" backgroundColor="mainBackground">
        <Title />
        <Box flex={1} justifyContent="flex-end">
          <Box height={size} flexDirection="row" alignItems="center">
            <Box flex={1} justifyContent="center">
              <SliderLine translateX={translateX} />
            </Box>
            <Box
              position="absolute"
              left={(0.3 * width - size) / 2}
              height={size}
              width={size}
              alignItems="center"
              justifyContent="center"
            >
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
              <AnimatedBox position="absolute" style={balloonContainerStyle}>
                <AnimatedSvg viewBox="0 0 8 10" animatedProps={balloonProps}>
                  <Path fill={theme.colors.tertiary} d={d} />
                </AnimatedSvg>
                <BalloonText quantity={quantity} isActive={isActive} />
              </AnimatedBox>
            </Box>
          </Box>
        </Box>
        <Box flex={1} alignItems="flex-end" justifyContent="flex-end">
          <Button />
        </Box>
      </Box>
    </>
  );
};

export default Balloon;

const Title = () => (
  <Text
    variant="hero"
    color="mainForeground"
    padding="m"
    fontFamily="Poppins-SemiBold"
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
    fontSize: withTiming(isActive.value ? 18 : 1, { duration: DURATION }),
    color: theme.colors.mainBackground,
    fontFamily: "Poppins-SemiBold",
  }));
  return (
    <Box style={StyleSheet.absoluteFill}>
      <Box flex={4} justifyContent="flex-end" alignItems="center">
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={quantity.value}
          style={animatedStyle}
          animatedProps={animatedProps}
        />
      </Box>
      <Box flex={3} />
    </Box>
  );
};

const Button = () => {
  const theme = useTheme();
  return (
    <Box
      backgroundColor="primary"
      style={{ borderRadius: 10 }}
      marginVertical="xl"
      marginHorizontal="l"
      overflow="hidden"
    >
      <RectButton onPress={() => null}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingVertical="m"
          paddingHorizontal="l"
          width={140}
        >
          <Text textAlign="center" fontFamily="Poppins-SemiBold">
            Next
          </Text>
          <Icon
            name="chevron-right"
            size={18}
            color={theme.colors.mainForeground}
          />
        </Box>
      </RectButton>
    </Box>
  );
};
