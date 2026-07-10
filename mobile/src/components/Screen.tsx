import { Font } from "@/constants/utils";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleProp, View, ViewStyle } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text } from "./ui/text";

interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  showBackBtn?: boolean;
  screenTitle?: string;
}

export default function Screen({ children, style, showBackBtn=true, screenTitle="" }: ScreenProps) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: "#F8F8F8" }, style]}
      edges={["top"]}
    >
      {showBackBtn && <View className="px-6" style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
        <SimpleLineIcons name="arrow-left" size={19} color="black" onPress={()=>router.back()} style={{marginTop: 10}}/>
        <Text style={{fontFamily: Font.bold, fontSize: 24, marginTop: 10}}>
          {" "} {screenTitle}
        </Text>
      </View>}
      {children}
    </SafeAreaView>
  );
}