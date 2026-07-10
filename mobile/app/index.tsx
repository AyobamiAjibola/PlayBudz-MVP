import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { View, Dimensions, } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { AppButton } from "@/components/ui/button";
import { Colors } from "@/constants/utils";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

const leftImages = [
  require("@/assets/images/c_acc/rec_1.jpg"),
  require("@/assets/images/c_acc/rec_2.jpg"),
  require("@/assets/images/c_acc/rec_3.jpg"),
];

const rightImages = [
  require("@/assets/images/c_acc/rec_4.jpg"),
  require("@/assets/images/c_acc/rec_5.jpg"),
  require("@/assets/images/c_acc/rec_6.jpg"),
];

function ImageColumn({
  images,
  reverse = false,
}: {
  images: any[];
  reverse?: boolean;
}) {
  const translateY = useSharedValue(reverse ? -height : 0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(reverse ? 0 : -height, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const repeatedImages = [...images, ...images, ...images];

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <Animated.View style={animatedStyle}>
        {repeatedImages.map((img, index) => (
          <Image
            key={index}
            source={img}
            contentFit="cover"
            style={{
              width: "100%",
              height: index % 2 === 0 ? 220 : 280,
              borderRadius: 24,
              marginBottom: 14,
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}

export default function Index() {
  return (
    <View className="flex-1 px-4 flex-col bg-white">
        <View style={{ height: "60%" }}>
          {/* <LinearGradient
            colors={["transparent", "white"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100
            }}
          /> */}
          <View style={{ height: '100%', flexDirection: "row", gap: 14 }}>
            <ImageColumn images={leftImages} />
            <ImageColumn images={rightImages} reverse />
          </View>
          <LinearGradient
            colors={["transparent", "white"]}
            style={{
              position: "absolute",
              bottom: -5,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
        </View>

        <View className="bg-white flex-1 flex-col items-center justify-start" style={{marginTop: 60}}>
          <Text 
            className="text-center text-3xl mb-2"
            style={{ fontFamily: "RethinkSans-ExtraBold" }}
          >
            Welcome to GameOn
          </Text>
          <Text className="text-center" style={{color: Colors.textGrey, fontSize: 16}}>
            Connect with people nearby, organise 
          </Text>
          <Text className="text-center" style={{color: Colors.textGrey, fontSize: 16}}>
            games, and enjoy your favourite sports.
          </Text>

          <AppButton
            title="Get started" 
            onPress={() => router.push("/get-started")} 
            textStyle={{fontFamily: "RethinkSans-SemiBold"}}
            buttonStyle={{marginTop: 40}}
          />
          <Text className="text-center" style={{color: Colors.textGrey, fontSize: 16, marginTop: 8}}>
            Already have an account?{" "}
            <Text onPress={() => router.push("/login")}
              style={{color: Colors.primary, fontFamily: "RethinkSans-Bold"}}
            >
              Log in
            </Text>
          </Text>
        </View>
    </View>
  );
}