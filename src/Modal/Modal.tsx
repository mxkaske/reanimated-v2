import React from "react";
import { Box, Text } from "../components";
import { RouteNavigationProps } from "../components/Navigation";

const Modal = ({ navigation }: RouteNavigationProps<"Modal">) => {
  return (
    <Box
      backgroundColor="secondary"
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      <Text color="tertiary" variant="hero">
        My Native Modal
      </Text>
    </Box>
  );
};

export default Modal;
