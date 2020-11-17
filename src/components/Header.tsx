import React from "react";
import { Box } from "./Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoundedIconButton from "./RoundedIconButton";

interface HeaderProps {
  left: {
    onPress: () => void;
    icon: string;
  };
}

const Header = ({ left }: HeaderProps) => {
  const { onPress, icon } = left;
  const insets = useSafeAreaInsets();
  return (
    <Box
      style={{ paddingTop: insets.top + 20 }}
      paddingHorizontal="m"
      flexDirection="row"
      backgroundColor="mainBackground"
    >
      <RoundedIconButton
        onPress={onPress}
        name={icon}
        size={24}
        iconRatio={1}
        color="mainForeground"
        backgroundColor="mainBackground"
      />
    </Box>
  );
};

export default Header;
