import { View, Text, Pressable, StyleSheet } from "react-native";
import Screen from "@/components/Screen";
import { useAuthStore } from "@/stores/auth.store";
import { router } from "expo-router";
import { Font, FontSize } from "@/constants/utils";

export default function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useAuthStore((state) => state.user);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/get-started")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: FontSize.lg,
            fontFamily: Font.bold,
            textAlign: "center"
          }}
        >
          {profile?.profile.fullName}
        </Text>
        <Pressable
          onPress={handleSignOut}
          style={{
            paddingHorizontal: 12,
            height: 30, backgroundColor: "red",
            borderRadius: 20, 
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <Text className="text-base font-semibold text-white">
            Sign Out
          </Text>
        </Pressable>
      </View>
      
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})