import Screen from "@/components/Screen";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { events } from "./HomeScreen";
import RecommendedEventCard from "../components/RecommendedEventCard";

const { width } = Dimensions.get("window");

const SCREEN_PADDING = 16;
const CARD_SPACING = 12;

const CARD_WIDTH =
  (width - SCREEN_PADDING - CARD_SPACING) / 2;

export default function DiscoverEventsScreen() {


    return (
        <Screen
            showContent={false}
            showBackBtn={true}
            screenTitle="Discover events"
        >
            <FlatList
                data={events}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id as string}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <RecommendedEventCard item={item} cardWidth={"100%"}/>
                )}
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 20
  }
});
