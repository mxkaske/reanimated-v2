import React from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { Box, Text } from "../components";

// 375 === screen width
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface SmartHomeProps {}
const SmartHome = () => {
  const progress = useSharedValue(0); // 0 to 1
  const dragged = useSharedValue(false);
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Box flex={1} justifyContent="flex-end">
        <Box backgroundColor="secondary">
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
      <AnimatedText variant="title" animatedProps={animatedProps} />
      <Text variant="description">Light Intensity</Text>
    </Box>
  );
};

const barWidth = 2;
const oddBarHeight = 15;
const evenBarHeight = oddBarHeight * 2;

interface NumberBarProps {
  progress: Animated.SharedValue<number>;
  dragged: Animated.SharedValue<boolean>;
}

const NumberBar = ({ progress, dragged }: NumberBarProps) => {
  const array = new Array(21).fill(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * 375,
        },
        {
          scale: withTiming(dragged.value ? 1.3 : 1),
        },
      ],
      height: withSpring(
        oddBarHeight *
          (2 -
            1 *
              Math.abs(Math.cos(Math.PI * (progress.value * 10) + Math.PI / 2)))
      ),
    };
  });
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      height={evenBarHeight}
    >
      {array.map((_, idx) => (
        <Box
          key={idx}
          width={barWidth}
          height={idx % 2 === 1 ? oddBarHeight : evenBarHeight}
          backgroundColor="mainForeground"
        />
      ))}
      <Box style={{ ...StyleSheet.absoluteFillObject }} justifyContent="center">
        <AnimatedBox
          height={evenBarHeight}
          width={barWidth}
          backgroundColor="primary"
          style={animatedStyle}
        />
      </Box>
    </Box>
  );
};

export default SmartHome;
