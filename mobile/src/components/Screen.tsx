import { Colors, Font, FontSize } from "@/constants/utils";
import { ComponentType, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text } from "./ui/text";

interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  showBackBtn?: boolean;
  screenTitle?: string;
  showContent?: boolean;
  RenderContent?: ComponentType;
}

export default function Screen({ children, style, showContent=true, showBackBtn=true, screenTitle="", RenderContent }: ScreenProps) {
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: Colors.appBg, paddingBottom: 90 }, style]}
      edges={["right"]}
    >
      {!showContent 
        ? ( <View className="px-6" style={[styles.container, { height: "auto", paddingTop: 60}]}>
              { showBackBtn && 
                <View style={styles.wrapper}>
                  <SimpleLineIcons name="arrow-left" size={19} color="black" onPress={()=>router.back()} style={{marginTop: 10}}/>
                  <Text style={styles.title}>
                    {" "} {screenTitle}
                  </Text>
                </View>
              }
            </View>
        ) : (
          <View className="px-6" style={[styles.container, {minHeight: 40, paddingTop: 20}]}>
            {RenderContent && <RenderContent/>}
          </View>
        )}
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex", 
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -0.2, // Negative for shadow above
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,

    // Android
    elevation: 6,
  },
  wrapper: {
    display: "flex",
    flexDirection: "row", 
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 20,
    gap: 12
  },
  title: {
    fontFamily: Font.bold, 
    fontSize: FontSize.lg, 
    marginTop: 10
  }
})