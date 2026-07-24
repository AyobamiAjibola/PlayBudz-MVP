import { View, Text, Pressable, StyleSheet } from "react-native";
import { useProfile } from "../hooks/useProfile";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "@/components/Screen";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable
          onPress={handleSignOut}
          style={{
            paddingHorizontal: 12,
            height: 30, backgroundColor: "black",
            borderRadius: 20, 
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