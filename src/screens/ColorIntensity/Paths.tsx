import React from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

//circleSize = 60
const height = 120;
const alpha = 30;
const radius = height / (2 * Math.sin(alpha));
const r = 30;

interface PathProps {
  progress: Animated.SharedValue<number>;
}

export const Paths = ({ progress }: PathProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const animatedCenter = useDerivedValue(() => ({
    x: windowWidth / 2,
    y: height / 2,
  }));
  const animatedLeft = useDerivedValue(() => ({
    x: 0,
    y: 0 + progress.value * height,
  }));
  const animatedLeftCenter = useDerivedValue(() => ({
    x: animatedCenter.value.x - r,
    y: 0 + progress.value * height,
  }));
  const animatedRightCenter = useDerivedValue(() => ({
    x: animatedCenter.value.x + r,
    y: height - progress.value * height,
  }));
  const animatedRight = useDerivedValue(() => ({
    x: windowWidth,
    y: height - progress.value * height,
  }));

  const animatedProps1 = useAnimatedProps(() => ({
    d: `
      M${animatedLeft.value.x} ${animatedLeft.value.y},
      C${animatedLeft.value.x} ${animatedLeft.value.y},
      ${animatedLeftCenter.value.x} ${animatedLeftCenter.value.y},
      ${animatedCenter.value.x} ${animatedCenter.value.y},
      `,
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    d: `
        M${animatedCenter.value.x} ${animatedCenter.value.y},
        C${animatedRightCenter.value.x} ${animatedRightCenter.value.y}, 
        ${animatedRight.value.x} ${animatedRight.value.y}, 
        ${animatedRight.value.x} ${animatedRight.value.y},
        `,
  }));
  return (
    <Svg height={height} width={windowWidth}>
      <AnimatedPath
        animatedProps={animatedProps1}
        fill={"red"}
        stroke={"black"}
        strokeWidth={2}
      />
      <AnimatedPath
        animatedProps={animatedProps2}
        fill={"black"}
        stroke={"black"}
        strokeWidth={2}
      />
    </Svg>
  );
};
