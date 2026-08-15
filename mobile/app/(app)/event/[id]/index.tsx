import EventScreen from "@/features/home/screens/EventScreen";

import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Event() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    return (
        <EventScreen eventId={id as string}/>
    )
}