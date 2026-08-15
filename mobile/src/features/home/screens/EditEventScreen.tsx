import Screen from "@/components/Screen";
import Event from "../components/Event";
import { View } from "react-native";

export default function EditEventScreen({eventId}: {eventId: string}) {
  return (
    <Screen showContent={false} screenTitle="Edit Event" screenPaddingBottom={0}>
      <View style={{flex: 1}}>
        <Event eventId={eventId}/>
      </View>
    </Screen>
  )
}
