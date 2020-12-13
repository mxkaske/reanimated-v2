import React, { useRef } from "react";
import faker from "faker";
import { Box, Text } from "../components";
import Footer from "./Footer";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

interface ComponentProps {}
const Component = () => {
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
    <Box flex={1}>
      <Animated.ScrollView
        ref={ref}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text>{faker.lorem.paragraphs(20)}</Text>
      </Animated.ScrollView>
      <Footer isEnd={isEnd} scrollToEnd={scrollToEnd} />
    </Box>
  );
};

export default Component;
