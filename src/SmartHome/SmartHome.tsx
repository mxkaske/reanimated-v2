import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { Box, Text, useTheme } from "../components";
import { ReText } from "react-native-redash";
import { Path, Rect, Svg } from "react-native-svg";
import theme from "../components/Theme";

const AnimatedBox = Animated.createAnimatedComponent(Box);

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
          <Box style={{ ...StyleSheet.absoluteFillObject }}>
            <Wave progress={progress} />
          </Box>
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

interface WaveProps {
  progress: Animated.SharedValue<number>;
}

const Wave = ({ progress }: WaveProps) => {
  const size = 80;
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const height = 80;
  const width = 200;
  return (
    <Svg height={height} width={windowWidth}>
      <Path
        d={`
        M0 ${height}
        C${width / 8} ${height},
        ${width / 8} ${height},
        ${width / 4} ${height / 2}, 
        C${(width * 3) / 8} 0, 
        ${(width * 5) / 8} 0, 
        ${(width * 3) / 4} ${height / 2},
        C${(width * 7) / 8} ${height},
        ${(width * 7) / 8} ${height},
        ${width} ${height}, 
        `}
        fill={theme.colors.mainBackground}
        stroke={theme.colors.tertiary}
        strokeWidth={2}
      />
    </Svg>
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
  const x = useSharedValue(0);
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
            ? ctx.startX + event.translationX
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
  const animatedProps = useDerivedValue(
    () => `${(progress.value * 100).toFixed(0)}%`
  );
  return (
    <Box alignItems="center" padding="l">
      <ReText
        text={animatedProps}
        style={{ ...theme.textVariants.title, color: theme.colors.tertiary }}
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
              : theme.colors.baseDescription,
            height: withTiming(!isActive ? barHeight : activeBarHeight),
            width: !isActive ? barWidth : activeBarWidth,
            marginLeft: !isActive ? 1 : 0,
            marginRight: !isActive ? 1 : 0,
            borderRadius: 2,
          };
        });
        return <AnimatedBox key={idx} width={barWidth} style={animatedStyle} />;
      })}
    </Box>
  );
};

export default SmartHome;
