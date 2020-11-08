import React from "react";
import { View } from "react-native";
import { cartesian2Canvas, polar2Canvas } from "react-native-redash";
import { Svg, Path } from "react-native-svg";
import { Box } from "../components";
import { useTheme } from "../components";

const R = 10;
const k = (4 / 3) * (Math.SQRT2 - 1) * R;
const center = { x: R, y: R };

interface CircleProps {}
const Circle = () => {
  return (
    <Svg height={R * 2} width={R * 2} viewBox={`0 0 ${R * 2} ${R * 2}`}>
      <CurvePart x={1} y={1} />
      <CurvePart x={-1} y={1} />
      <CurvePart x={-1} y={-1} />
      <CurvePart x={1} y={-1} />
      <Inner />
    </Svg>
  );
};

interface InnerProps {
  direction: "left" | "right" | undefined;
}

const Inner = ({ direction }: InnerProps) => {
  const theme = useTheme();
  const leftX = direction === "left" ? -R / 2 : -R;
  const rightX = direction === "right" ? R / 2 : R;

  const A = cartesian2Canvas({ x: R, y: 0 }, center);
  const B = cartesian2Canvas({ x: 0, y: R }, center);
  const C = cartesian2Canvas({ x: leftX, y: 0 }, center);
  const D = cartesian2Canvas({ x: 0, y: -R }, center);
  return (
    <Path
      d={`M${A.x} ${A.y} L${B.x} ${B.y} L${C.x} ${C.y} L${D.x} ${D.y}`}
      fill={theme.colors.tertiary}
    />
  );
};

Inner.defaultProps = {
  direction: undefined,
};

const CurvePart = ({ x, y }) => {
  const theme = useTheme();
  const LeftX = x === -1 ? (R / 2) * x : R * x;
  const rightX = x === 1 ? (R / 2) * x : R * x;

  const A = cartesian2Canvas({ x: 0, y: R * y }, center);
  const B = cartesian2Canvas({ x: R * x, y: 0 }, center); //newX
  const BC = cartesian2Canvas({ x: R * x, y: k * y }, center);
  const AC = cartesian2Canvas({ x: k * x, y: R * y }, center);

  console.log(A, AC, BC, B);
  return (
    <Path
      d={`M${A.x} ${A.y} C ${AC.x} ${AC.y}, ${BC.x} ${BC.y}, ${B.x} ${B.y}`}
      fill={theme.colors.tertiary}
    />
  );
};

export default Circle;
