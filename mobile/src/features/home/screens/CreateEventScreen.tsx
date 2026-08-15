import Screen from "@/components/Screen";
import { Text } from "@/components/ui/text";
import Event from "../components/Event";
import { View } from "react-native";

export default function CreateEventScreen() {
  return (
    <Screen showContent={false} screenTitle="Create Event" screenPaddingBottom={0}>
      <View style={{flex: 1}}>
        <Event/>
      </View>
    </Screen>
  )
}
