import React from "react";
import { StyleSheet } from "react-native";
//for web
//import { TouchableOpacity } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";

import { Theme, Text } from "./Theme";

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1
  }
});

interface ButtonProps {
  variant: "default" | "primary";
  label?: string;
  onPress: () => void;
}

const Button = ({ label, onPress, variant }: ButtonProps) => {
  const theme = useTheme<Theme>();
  const backgroundColor =
    variant === "primary" ? theme.colors.primary : theme.colors.mainBackground;
  const color =
    variant === "primary"
      ? theme.colors.mainBackground
      : theme.colors.mainForeground;
  return (
    <RectButton
      style={[styles.container, { backgroundColor, borderColor: color }]}
      {...{ onPress }}
    >
      <Text variant="button" style={{ color: color }}>
        {label}
      </Text>
    </RectButton>
  );
};

Button.defaultProps = { variant: "default" };

export default Button;
