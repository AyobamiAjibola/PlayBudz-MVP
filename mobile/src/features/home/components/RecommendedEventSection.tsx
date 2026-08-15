import {
  StyleSheet,
  View
} from "react-native";
import { Game } from "../types/types";
import RecommendedEventCard from "./RecommendedEventCard";

type EventsProps = {
    events: Game[]
}

export default function RecommendedEventSection({events}: EventsProps) {

    return (
        <View style={styles.container}>
            {events.map((event) => (
                <RecommendedEventCard
                    key={event.id}
                    item={event}
                    cardWidth={"100%"}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  }
});