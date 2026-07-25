import { Colors, Font, FontSize } from "@/constants/utils";
import { ComponentType, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Text } from "./ui/text";
import { StatusBar } from "expo-status-bar";

interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  showBackBtn?: boolean;
  screenTitle?: string;
  showContent?: boolean;
  RenderContent?: ComponentType;
  backBtnPadding?: number;
  screenPaddingBottom?: number;
  backBtnRoute?: Href;
  dismissKeyboard?: boolean;
  avoidKeyboard?: boolean;
}

export default function Screen({ 
  children, style, showContent=true, 
  showBackBtn=true, screenTitle="", 
  RenderContent, backBtnPadding=60,
  screenPaddingBottom=90, backBtnRoute,
  dismissKeyboard = false,
  avoidKeyboard = false,
}: ScreenProps) {

  let content = (
    <View style={{flex: 1}}>
      {!showContent 
        ? ( <View style={[styles.container, { height: "auto", paddingTop: backBtnPadding, paddingHorizontal: 22}]}>
              { showBackBtn && 
                <View style={styles.wrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      if (backBtnRoute) {
                        router.push(backBtnRoute);
                      } else {
                        router.back();
                      }
                    }}
                    style={{marginTop: 10}}
                  >
                    <SimpleLineIcons name="arrow-left" size={19} color="black" />
                  </TouchableOpacity>
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
    </View>
  )

  if (dismissKeyboard) {
    content = (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  if (avoidKeyboard) {
    content = (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView
        style={[{ flex: 1, backgroundColor: Colors.appBg, paddingBottom: screenPaddingBottom }, style]}
        edges={["right"]}
      >
        {content}
      </SafeAreaView>
    </>
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