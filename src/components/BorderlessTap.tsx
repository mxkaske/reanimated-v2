import React, { ReactNode } from "react";
//for web
//import { TouchableOpacity } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";

interface BorderlessTapProps {
  onPress: () => void;
  children: ReactNode;
}

const BorderlessTap = ({ children, onPress }: BorderlessTapProps) => {
  return <BorderlessButton {...{ onPress }}>{children}</BorderlessButton>;
};

export default BorderlessTap;
