import React from "react";
import { StyleSheet, View } from "react-native";
import { Box, Text, useTheme } from "../components";
import MaskedView from "@react-native-community/masked-view";

const radius = 50;
const progress = 0.6;

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
      <Box
        height={radius * 2}
        width={radius * 2}
        //@ts-expect-error
        borderRadius={radius}
        overflow="hidden"
      >
        <Box flex={1} backgroundColor="secondary" />
        <Box
          width={`${100 * progress}%`}
          backgroundColor="tertiary"
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />
        <MaskedView
          style={{ ...StyleSheet.absoluteFillObject }}
          maskElement={maskElement}
        >
          <Box
            backgroundColor="mainForeground"
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          <Box
            backgroundColor="mainBackground"
            width={`${100 * progress}%`}
            style={{
              ...StyleSheet.absoluteFillObject,
            }}
          />
        </MaskedView>
      </Box>
    </Box>
  );
};

const maskElement = (
  <Box justifyContent="center" style={{ ...StyleSheet.absoluteFillObject }}>
    <Text style={{ marginHorizontal: 15, fontSize: 13 }}>
      Text color change
    </Text>
  </Box>
);

export default Mask;
