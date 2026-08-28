import { Colors } from "@/constants/utils";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
} from "react-native";

interface Props {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 12,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.delay(150),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(onFinish);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
        },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/splash-icon.png")}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            transform: [{ scale }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  logo: {
    width: 140,
    height: 140,
  },
});