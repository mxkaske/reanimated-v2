import React from "react";
import { View } from "react-native";
import { Button } from "../components";
import { RouteNavigationProps } from "../components/Navigation";

const Modal = ({ navigation }: RouteNavigationProps<"Modal">) => {
  return (
    <View style={{ flex: 1 }}>
      <Button label={"back"} onPress={() => navigation.goBack()} />
    </View>
  );
};

export default Modal;
