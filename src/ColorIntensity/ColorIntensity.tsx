import React from "react";
import { StyleSheet, useWindowDimensions, TextInput } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSpring,
  useAnimatedProps,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/stack";
import { Box, Text, useTheme } from "../components";
import { ReText, mixColor } from "react-native-redash";
import { Feather as Icon } from "@expo/vector-icons";
import theme from "../components/Theme";
import CircularAnimation from "../components/CircularAnimation";

const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ColorIntensityProps {}
const ColorIntensity = () => {
  const theme = useTheme();
  const progress = useSharedValue(0.5); // 0 to 1
  const dragged = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: progress.value === 1 ? withSpring(1) : withTiming(0) },
    ],
  }));
  return (
    <Box flex={1} backgroundColor="mainBackground">
      <Background progress={progress} />
      <Box flex={1} justifyContent="center" alignItems="center">
        <TextEnd progress={progress} />
      </Box>
      <Box flex={1}>
        <Box flex={1} justifyContent="center">
          <Number progress={progress} />
          <NumberBar progress={progress} dragged={dragged} />
        </Box>
        <Box flex={1} justifyContent="center">
          <Circle progress={progress} dragged={dragged} />
        </Box>
      </Box>
    </Box>
  );
};

interface BackgroundProps {
  progress: Animated.SharedValue<number>;
}

const Background = ({ progress }: BackgroundProps) => {
  const headerHeight = useHeaderHeight();
  const { height: windowHeight } = useWindowDimensions();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    height: withSpring((windowHeight - headerHeight) * progress.value, {
      damping: 14,
      mass: 1,
      stiffness: 100,
    }),
  }));
  return (
    <Box style={{ ...StyleSheet.absoluteFillObject }} justifyContent="flex-end">
      <Box height={3} backgroundColor="tertiary" />
      <AnimatedBox backgroundColor="tertiary" style={animatedStyle} />
    </Box>
  );
};

interface TextEndProps {
  progress: Animated.SharedValue<number>;
}

const TextEnd = ({ progress }: TextEndProps) => {
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: progress.value === 1 ? withSpring(1) : withTiming(0) },
    ],
  }));
  return (
    <>
      <Box
        style={{ ...StyleSheet.absoluteFillObject }}
        alignItems="center"
        justifyContent="center"
      >
        <CircularAnimation
          size={150}
          smallSize={0}
          doAnimation={useDerivedValue(() =>
            progress.value === 1 ? true : false
          )}
        />
      </Box>
      <Box
        style={{ ...StyleSheet.absoluteFillObject }}
        alignItems="center"
        justifyContent="center"
      >
        <AnimatedBox style={animatedTextStyle}>
          <Text color="mainBackground">
            <Icon name="code" />
            {` with `}
            <Icon name="heart" color={theme.colors.primary} />
          </Text>
        </AnimatedBox>
      </Box>
    </>
  );
};

interface CircleProps {
  progress: Animated.SharedValue<number>;
  dragged: Animated.SharedValue<boolean>;
}

const Circle = ({ progress, dragged }: CircleProps) => {
  const size = 60;
  const { width } = useWindowDimensions();
  const minPosition = 0;
  const maxPosition = width - size;
  const x = useSharedValue(maxPosition * progress.value);
  const pressed = useSharedValue(false);
  const gestureHandler = useAnimatedGestureHandler<Record<string, number>>({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      dragged.value = true;
    },
    onActive: (event, ctx) => {
      const position = ctx.startX + event.translationX;
      const newX =
        position >= minPosition
          ? position <= maxPosition
            ? position
            : maxPosition
          : minPosition;
      x.value = newX;
      progress.value = newX / maxPosition;
    },
    onEnd: (_) => {
      const round5 = Math.ceil(x.value / maxPosition / 0.05) * 0.05;
      x.value = withSpring(round5 * maxPosition);
      progress.value = round5;
      dragged.value = false;
    },
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          scale: pressed.value ? 0.7 : 1,
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
        shadowColor="mainBackground"
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
  const theme = useTheme();
  const color = useDerivedValue(() =>
    mixColor(
      progress.value,
      theme.colors.tertiary,
      theme.colors.baseDescription
    )
  );
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${(progress.value * 100).toFixed(0)}`,
    };
  });
  const animatedStyle = useAnimatedStyle(() => ({
    fontFamily: "Epilogue-Bold",
    fontSize: 30,
    color: color.value,
  }));
  return (
    <Box alignItems="center" padding="l">
      <Box flexDirection="row" alignItems="flex-end">
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={(progress.value * 100).toFixed(0)}
          style={animatedStyle}
          {...{ animatedProps }}
        />
        <Text color="baseDescription" style={{ paddingBottom: 2 }}>
          %
        </Text>
      </Box>
      <Text variant="description">Color Intensity</Text>
    </Box>
  );
};

const barWidth = 1;
const oddBarHeight = 20;
const evenBarHeight = oddBarHeight * 1.5;
const activeBarHeight = oddBarHeight * 2.5;
const activeBarWidth = 4;
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
              : theme.colors.baseDescription,
            height: withTiming(!isActive ? barHeight : activeBarHeight),
            width: !isActive ? barWidth : activeBarWidth,
            marginLeft: !isActive ? 1 : 0,
            marginRight: !isActive ? 1 : 0,
            borderRadius: 2,
            borderColor: theme.colors.mainBackground,
            borderWidth: isActive ? 1 : 0,
          };
        });
        return <AnimatedBox key={idx} width={barWidth} style={animatedStyle} />;
      })}
    </Box>
  );
};

export default ColorIntensity;
