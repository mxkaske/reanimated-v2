import React, { useRef } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/stack";
import { Box, Text, useTheme, Theme, RoundedIconButton } from "../components";
import { Svg, Path } from "react-native-svg";
import { content, waves } from "./data";
import { interpolatePath, parse } from "react-native-redash";
import { BoxProps } from "@shopify/restyle";
import RoundedIcon from "../components/RoundedIcon";

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const wave0 = parse(waves[0]);
const wave1 = parse(waves[1]);
const wave2 = parse(waves[2]);
const wave3 = parse(waves[3]);
const waveHeight = 320;

interface ScrollAnimationProps {}
const ScrollAnimation = () => {
  const { height: windowHeight, width } = useWindowDimensions();
  const scrollRef = useRef(null).current;
  const headerHeight = useHeaderHeight();
  const height = windowHeight - headerHeight;
  const theme = useTheme();
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const scrollProgress = useDerivedValue(() => scrollOffset.value / 3);

  const animatedBoxStyles = useAnimatedStyle(() => ({
    height: withSpring(waveHeight + 60 + scrollProgress.value),
  }));

  const animatedPathStyles = useAnimatedProps(() => ({
    d: interpolatePath(
      scrollOffset.value,
      [0, height, height * 2, height * 3],
      [wave0, wave1, wave2, wave3]
    ),
    height: scrollProgress.value,
  }));

  const onPress = () => scrollRef?.scrollTo({ y: -300 });

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box
        style={{ ...StyleSheet.absoluteFillObject }}
        justifyContent="flex-end"
      >
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
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        pagingEnabled
        scrollEventThrottle={16}
      >
        {content.map((i) => (
          <ContentBox content={i} height={height} />
        ))}
      </Animated.ScrollView>
    </Box>
  );
};

interface ContentBoxProps extends BoxProps<Theme> {
  content: {
    icon: string;
    title: string;
    description: string;
  };
}
const ContentBox = ({ content, ...props }: ContentBoxProps) => (
  <Box flex={1} justifyContent="flex-end" padding="m" {...props}>
    <RoundedIcon
      size={40}
      color="mainBackground"
      backgroundColor={undefined}
      name={content.icon}
    />
    <Text variant="title" color="mainBackground" paddingVertical="s">
      {content.title}
    </Text>
    <Text color="mainBackground">{content.description}</Text>
  </Box>
);

export default ScrollAnimation;
