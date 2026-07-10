import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/stores/auth.store";

export default function HomeScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}
      className="flex-1 bg-white px-6 justify-center items-center"
      edges={["top"]}
    >
    <View>
      <Text>Home Screen</Text>
      <Pressable
        onPress={handleSignOut}
        className="h-14 items-center justify-center rounded-xl bg-black"
      >
        <Text className="text-base font-semibold text-white">
          Sign Out
        </Text>
      </Pressable>
    </View>
    </SafeAreaView>
  )
}
