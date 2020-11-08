import React from "react";
import { View } from "react-native";
import { cartesian2Canvas, polar2Canvas } from "react-native-redash";
import { Svg, Path } from "react-native-svg";
import { Box } from "../components";
import { useTheme } from "../components";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const R = 10;
const k = (4 / 3) * (Math.SQRT2 - 1) * R;
const center = { x: R, y: R };

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircleProps {
  progress: Animated.SharedValue<number>;
}
const Circle = ({ progress }: CircleProps) => {
  const animatedProps = useAnimatedProps(() => {
    // first quadrant
    const A = cartesian2Canvas({ x: R * 1, y: 0 }, center);
    const B = cartesian2Canvas({ x: 0, y: R * 1 }, center);
    const AC = cartesian2Canvas({ x: R * 1, y: k * 1 }, center);
    const BC = cartesian2Canvas({ x: k * 1, y: R * 1 }, center);
    // second quadrant
    const C = cartesian2Canvas({ x: 0, y: R * 1 }, center);
    const D = cartesian2Canvas({ x: progress.value * R * -1, y: 0 }, center);
    const CC = cartesian2Canvas(
      { x: progress.value * k * -1, y: R * 1 },
      center
    );
    const DC = cartesian2Canvas(
      { x: progress.value * R * -1, y: k * 1 },
      center
    );
    // third quadrant
    const E = cartesian2Canvas({ x: R * -1, y: 0 }, center);
    const F = cartesian2Canvas({ x: 0, y: R * -1 }, center);
    const EC = cartesian2Canvas(
      { x: progress.value * R * -1, y: k * -1 },
      center
    );
    const FC = cartesian2Canvas({ x: k * -1, y: R * -1 }, center);
    // fourth quadrant
    const H = cartesian2Canvas({ x: 0, y: R * -1 }, center);
    const I = cartesian2Canvas({ x: R * 1, y: 0 }, center);
    const HC = cartesian2Canvas({ x: k * 1, y: R * -1 }, center);
    const IC = cartesian2Canvas({ x: R * 1, y: k * -1 }, center);

    return {
      d: `M${A.x} ${A.y} 
      C ${AC.x} ${AC.y}, ${BC.x} ${BC.y}, ${B.x} ${B.y} 
      C ${CC.x} ${CC.y}, ${DC.x} ${DC.y}, ${D.x} ${D.y}
      C ${EC.x} ${EC.y}, ${FC.x} ${FC.y}, ${F.x} ${F.y}
      C ${HC.x} ${HC.y}, ${IC.x} ${IC.y}, ${I.x} ${I.y}`,
    };
  });

  return (
    <Svg height={R * 2} width={R * 2} viewBox={`0 0 ${R * 2} ${R * 2}`}>
      <AnimatedPath animatedProps={animatedProps} fill="red" />
    </Svg>
  );
};

interface InnerProps {
  direction: "left" | "right" | undefined;
}

interface CurvePartProps {
  x: number;
  y: number;
  progress: Animated.SharedValue<number>;
}

const CurvePart = ({ x, y, progress }: CurvePartProps) => {
  const theme = useTheme();
  const LeftX = x === -1 ? 0 : R * x;
  const rightX = x === 1 ? (R / 2) * x : R * x;
  const controlX = x === -1 ? 0 : R * x;

  const newX = useDerivedValue(() => (1 - progress.value) * R * x);

  const animatedProps = useAnimatedProps(() => {
    const A = cartesian2Canvas({ x: 0, y: R * y }, center);
    const B = cartesian2Canvas({ x: R * x, y: 0 }, center);
    const BC = cartesian2Canvas({ x: R * x, y: k * y }, center);
    const AC = cartesian2Canvas({ x: k * x, y: R * y }, center);

    return {
      d: `M${A.x} ${A.y} C ${AC.x} ${AC.y}, ${BC.x} ${BC.y}, ${B.x} ${B.y}`,
    };
  });

  return (
    <AnimatedPath animatedProps={animatedProps} fill={theme.colors.tertiary} />
  );
};
export default Circle;
