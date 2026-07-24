import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
} from "react-native";

type PaginationDotProps = {
  isActive: boolean;
  isSmall: boolean;
};

export function PaginationDot({
  isActive,
  isSmall,
}: PaginationDotProps) {
  const animation = useRef(
    new Animated.Value(isActive ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive, animation]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 5 : 8, 24],
  });

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 5 : 8, 8],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 2.5 : 4, 12],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D1D5DB", "#880000"],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D1D5DB",
        marginHorizontal: 4
    },
})