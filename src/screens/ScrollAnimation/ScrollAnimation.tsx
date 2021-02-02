import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  useAnimatedProps,
  withTiming,
  withDecay,
  Extrapolate,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/stack";
import { Box, Text, useTheme, Theme } from "../../components";
import { Svg, Path } from "react-native-svg";
import { content, waves } from "./data";
import { interpolatePath, parse, withBouncing } from "react-native-redash";
import { BoxProps } from "@shopify/restyle";
import RoundedIcon from "../../components/RoundedIcon";

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const wave0 = parse(waves[0]);
const wave1 = parse(waves[1]);
const wave2 = parse(waves[2]);
const waveHeight = 320;

const ScrollAnimation = () => {
  const { height: windowHeight, width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const height = windowHeight - headerHeight;
  const theme = useTheme();
  const scrollOffset = useSharedValue(0);
  const bounceValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const scrollProgress = useDerivedValue(
    () => scrollOffset.value / (2 * height)
  );

  const scrollIndex = useDerivedValue(() => scrollOffset.value / height);

  const animatedBoxStyles = useAnimatedStyle(() => ({
    height: withSpring(waveHeight + 60 + scrollProgress.value * (height * 0.6)),
  }));

  const animatedPathStyles = useAnimatedProps(() => ({
    d: interpolatePath(
      scrollOffset.value,
      [0, height, height * 2],
      [wave0, wave1, wave2]
    ),
  }));

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box style={{ ...StyleSheet.absoluteFillObject }}>
        <Box paddingTop="xl" paddingLeft="m">
          {content.map((_, idx) => (
            <Dot key={idx} index={idx} size={10} currentIndex={scrollIndex} />
          ))}
        </Box>
        <Box flex={1} justifyContent="flex-end">
          <AnimatedBox style={animatedBoxStyles}>
            <Svg height={waveHeight} width={width}>
              <AnimatedPath
                animatedProps={animatedPathStyles}
                fill={theme.colors.tertiary}
              />
            </Svg>
            <Box flex={1} backgroundColor="tertiary" />
          </AnimatedBox>
        </Box>
      </Box>
      <Animated.ScrollView
        onScroll={scrollHandler}
        pagingEnabled
        scrollEventThrottle={16}
      >
        {content.map((i, idx) => {
          return (
            <ContentBox
              key={idx}
              content={i}
              height={height}
              width={width}
              animatedValue={scrollIndex}
            />
          );
        })}
      </Animated.ScrollView>
    </Box>
  );
};

interface DotProps extends BoxProps<Theme> {
  size: number;
  currentIndex: Animated.SharedValue<number>;
  index: number;
}

const Dot = ({ size, currentIndex, index, ...props }: DotProps) => {
  const animatedBoxStyles = useAnimatedStyle(() => ({
    opacity: Animated.interpolate(
      currentIndex.value,
      [index - 1, index],
      [0.1, 1],
      Extrapolate.CLAMP
    ),
  }));
  return (
    <AnimatedBox
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor="tertiary"
      marginBottom="s"
      style={animatedBoxStyles}
      {...props}
    />
  );
};

interface ContentBoxProps extends BoxProps<Theme> {
  content: {
    icon: string;
    title: string;
    description: string;
  };
  width: number;
  animatedValue: Animated.SharedValue<number>;
}
const ContentBox = ({
  content,
  animatedValue,
  width,
  ...props
}: ContentBoxProps) => {
  const theme = useTheme();
  const animatedBoxStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          animatedValue.value * ((width - theme.spacing.m * 2 - 30) / 2)
        ),
      },
    ],
  }));
  return (
    <Box justifyContent="flex-end" paddingBottom="m" {...props}>
      <AnimatedBox style={animatedBoxStyles} paddingLeft="m" paddingBottom="s">
        <RoundedIcon
          size={30}
          iconRatio={1}
          color="mainBackground"
          backgroundColor={undefined}
          name={content.icon}
        />
      </AnimatedBox>
      <Box paddingHorizontal="m">
        <Text variant="title" color="mainBackground" paddingBottom="s">
          {content.title}
        </Text>
        <Text color="mainBackground">{content.description}</Text>
      </Box>
    </Box>
  );
};

export default ScrollAnimation;
