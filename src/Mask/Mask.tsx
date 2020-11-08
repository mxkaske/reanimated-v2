import React from "react";
import { StyleSheet, View } from "react-native";
import { Box, Text, useTheme } from "../components";
import MaskedView from "@react-native-community/masked-view";

const radius = 50;
const progress = 0.4;

interface MaskProps {}
const Mask = () => {
  const theme = useTheme();
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="mainBackground"
    >
      <Box flex={1} flexDirection="row">
        <Box width={`${100 * progress}%`} backgroundColor="secondary" />
        <Box flex={1} backgroundColor="tertiary" />
        <MaskedView
          style={{ ...StyleSheet.absoluteFillObject }}
          maskElement={maskElement}
        >
          <Box flex={1} flexDirection="row">
            <Box
              width={`${100 * progress}%`}
              backgroundColor="mainBackground"
            />
            <Box flex={1} backgroundColor="mainForeground" />
          </Box>
        </MaskedView>
      </Box>
    </Box>
  );
};

const maskElement = (
  <Box justifyContent="center" style={{ ...StyleSheet.absoluteFillObject }}>
    <Text padding="s">Text color change</Text>
  </Box>
);

export default Mask;
