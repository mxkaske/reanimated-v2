import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Box, Button, Text } from "../components";

// TODO: wait for withRepeat and withDelay!!!!!!

const AnimatedBox = Animated.createAnimatedComponent(Box);

interface LoadingProps {}
const Loading = () => {
  const isLoading = useSharedValue<boolean>(false);
  return (
    <Box flex={1}>
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="title">Loading...</Text>
      </Box>
      <Box flex={1} alignItems="center">
        <LoadingAnimation isLoading={isLoading} />
      </Box>
      <Button
        label={"button"}
        onPress={() => {
          if (isLoading.value) {
            // @ts-ignore
            isLoading.value = false;
          } else {
            isLoading.value = true;
          }
        }}
      />
    </Box>
  );
};

interface LoadingAnimationProps {
  isLoading: Animated.SharedValue<boolean>;
}

const LoadingAnimation = ({ isLoading }: LoadingAnimationProps) => {
  const progress = useDerivedValue(() => withTiming(isLoading.value ? 1 : 0));
  return (
    <Box
      width={100}
      height={100}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="secondary"
    >
      {[0, 0, 0].map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            {
              translateY: withTiming(progress.value >= index / 3 ? 40 : 0, {
                duration: 2000,
              }),
            },
          ],
        }));
        return (
          <AnimatedBox
            key={index}
            height={10}
            width={10}
            borderRadius={5}
            backgroundColor="tertiary"
            style={animatedStyle}
          />
        );
      })}
    </Box>
  );
};

export default Loading;
