import React, { useRef } from "react";
import faker from "faker";
import { Box, Text } from "../components";
import Footer from "./Footer";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ComponentProps {}
const Component = () => {
  const insets = useSafeAreaInsets();
  const ref = useRef<Animated.ScrollView>(null);
  const isEnd = useSharedValue(false);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        event.layoutMeasurement.height + event.contentOffset.y >=
        event.contentSize.height - 1
      ) {
        isEnd.value = true;
      } else {
        isEnd.value = false;
      }
    },
  });

  // @ts-expect-error
  const scrollToEnd = () => ref.current.scrollToEnd();
  // const scrollToEnd = () => ref.current.getNode().scrollToEnd();

  return (
    <Box
      flex={1}
      backgroundColor="cbBackground"
      style={{ paddingTop: insets.top }}
    >
      <Animated.ScrollView
        ref={ref}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text padding="m">{faker.lorem.paragraphs(10)}</Text>
      </Animated.ScrollView>
      <Footer isEnd={isEnd} scrollToEnd={scrollToEnd} />
    </Box>
  );
};

export default Component;
