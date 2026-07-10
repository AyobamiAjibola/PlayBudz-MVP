import { View, Text } from "react-native";
import { useProfile } from "../hooks/useProfile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
//   const { data, isLoading, error } = useProfile();

//   if (isLoading) {
//     return <Text>Loading...</Text>;
//   }

//   if (error) {
//     return <Text>Something went wrong</Text>;
//   }

  return (
    <SafeAreaView style={{flex: 1}}
          // className="flex-1 bg-slate-500 px-6"
          edges={["top"]}
        >
      <Text className="text-red-600 text-3xl">Profile Screen</Text>
      <Text className="text-3xl font-bold text-black text-center">
                    Welcome to Game On
                </Text>
      {/* <Text>{data.email}</Text> */}
    </SafeAreaView>
  );
}