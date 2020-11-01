import React from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import { Box, Text, useTheme } from "../components";

// 375 === screen width
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface SmartHomeProps {}
const SmartHome = () => {
  const progress = useSharedValue(0); // 0 to 1
  const dragged = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box flex={1}>
        <AnimatedBox
          flex={1}
          justifyContent="flex-end"
          backgroundColor="tertiary"
          style={animatedStyle}
        />
        <Box backgroundColor="tertiary">
          <Circle progress={progress} dragged={dragged} />
        </Box>
      </Box>
      <Box flex={1}>
        <Box flex={1} justifyContent="center">
          <Number progress={progress} />
          <NumberBar progress={progress} dragged={dragged} />
        </Box>
      </Box>
    </Box>
  );
};

interface CircleProps {
  progress: Animated.SharedValue<number>;
  dragged: Animated.SharedValue<boolean>;
}

const Circle = ({ progress, dragged }: CircleProps) => {
  const size = 50;
  const x = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      dragged.value = true;
    },
    onActive: (event, ctx) => {
      // @ts-ignore
      x.value = ctx.startX + event.translationX;
      // @ts-ignore
      progress.value = (ctx.startX + event.translationX) / 375;
    },
    onEnd: (_) => {
      //x.value = withSpring(0);
      dragged.value = false;
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <AnimatedBox
        backgroundColor="primary"
        height={size}
        width={size}
        borderRadius={size / 2}
        style={animatedStyle}
        shadowColor="mainForeground"
        shadowOffset={{
          width: 0,
          height: 2,
        }}
        shadowOpacity={0.25}
        shadowRadius={3.84}
        elevation={5}
      />
    </PanGestureHandler>
  );
};

interface NumberProps {
  progress: Animated.SharedValue<number>;
}

const Number = ({ progress }: NumberProps) => {
  const animatedProps = useAnimatedProps(() => ({
    children: `${(progress.value * 100).toFixed()}%`,
  }));
  return (
    <Box alignItems="center" padding="l">
      <Text>{progress.value}</Text>
      <AnimatedText
        variant="title"
        animatedProps={animatedProps}
        color="tertiary"
      />
      <Text variant="description">Light Intensity</Text>
    </Box>
  );
};

const barWidth = 1;
const oddBarHeight = 20;
const evenBarHeight = oddBarHeight * 1.5;
const activeBarHeight = oddBarHeight * 2;
const activeBarWidth = 3;
const arraySize = 21;

interface NumberBarProps {
  progress: Animated.SharedValue<number>;
  dragged: Animated.SharedValue<boolean>;
}

const NumberBar = ({ progress, dragged }: NumberBarProps) => {
  const array = new Array(arraySize).fill(0);
  const theme = useTheme();
  return (
    <Box
      flexDirection="row"
      marginHorizontal="xl"
      justifyContent="space-between"
      alignItems="center"
      height={evenBarHeight}
    >
      {array.map((_, idx) => {
        const isOdd = idx % 2 === 1;
        const barHeight = isOdd ? oddBarHeight : evenBarHeight;
        const animatedStyle = useAnimatedStyle(() => {
          const isActive =
            idx <= progress.value * arraySize &&
            progress.value * arraySize <= idx + 1;
          return {
            backgroundColor: isActive
              ? theme.colors.tertiary
              : theme.colors.baseDescrition,
            height: withTiming(!isActive ? barHeight : activeBarHeight),
            width: withTiming(!isActive ? barWidth : activeBarWidth),
            marginLeft: withTiming(!isActive ? 1 : 0),
            marginRight: withTiming(!isActive ? 1 : 0),
            borderRadius: 2,
          };
        });
        return <AnimatedBox key={idx} width={barWidth} style={animatedStyle} />;
      })}
    </Box>
  );
};

export default SmartHome;
