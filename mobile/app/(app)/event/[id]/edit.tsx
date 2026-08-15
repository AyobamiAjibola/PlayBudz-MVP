import EditEventScreen from "@/features/home/screens/EditEventScreen";
import { useLocalSearchParams } from "expo-router";

export default function Event() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <EditEventScreen eventId={id as string} />
  )
}
