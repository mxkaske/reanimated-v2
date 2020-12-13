import React from "react";
import { Alert, StyleSheet, TextInput } from "react-native";
import { Box, Text, useTheme } from "../components";
import { Feather as Icon } from "@expo/vector-icons";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { BaseButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEIGHT = 60;
const AnimatedBox = Animated.createAnimatedComponent(Box);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface FooterProps {
  isEnd: Animated.SharedValue<boolean>;
  scrollToEnd: () => void;
}

const Footer = ({ isEnd, scrollToEnd }: FooterProps) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isEnd.value ? 0 : -HEIGHT - insets.bottom, {
          duration: 500,
        }),
      },
    ],
  }));

  const animatedProps = useAnimatedProps(() => ({
    color: isEnd.value ? theme.colors.cbSecondary : theme.colors.cbPrimary,
  }));

  const onPress = () =>
    isEnd.value ? Alert.alert("Check out") : scrollToEnd();

  return (
    <Box
      height={HEIGHT}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      overflow="hidden"
    >
      <AnimatedBox style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Box height={HEIGHT + insets.bottom} backgroundColor="cbPrimary" />
        <Box height={HEIGHT + insets.bottom} backgroundColor="cbSecondary" />
      </AnimatedBox>
      <BaseButton onPress={() => navigation.goBack()}>
        <AnimatedIcon
          name="chevron-left"
          size={20}
          animatedProps={animatedProps}
        />
      </BaseButton>
      <BaseButton onPress={onPress}>
        <AnimatedText isEnd={isEnd} />
      </BaseButton>
    </Box>
  );
};

export default Footer;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedText {
  isEnd: Animated.SharedValue<boolean>;
}

const AnimatedText = ({ isEnd }) => {
  const theme = useTheme();
  const animatedProps = useAnimatedProps(() => ({
    text: isEnd.value ? "Check out" : "Scroll down",
  }));
  const animatedStyle = useAnimatedStyle(() => ({
    color: isEnd.value ? theme.colors.cbSecondary : theme.colors.cbPrimary,
  }));
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value="Scroll down"
      style={[
        { ...theme.textVariants.body, fontFamily: "Epilogue-Bold" },
        animatedStyle,
      ]}
      animatedProps={animatedProps}
    />
  );
};
