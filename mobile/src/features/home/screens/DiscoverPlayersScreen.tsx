import Screen from "@/components/Screen";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { players } from "./HomeScreen";
import PlayerCard from "../components/PlayerCard";

const { width } = Dimensions.get("window");

const SCREEN_PADDING = 16;
const CARD_SPACING = 12;

const CARD_WIDTH =
  (width - SCREEN_PADDING * 2 - CARD_SPACING) / 2;

export default function DiscoverPlayersScreen() {


    return (
        <Screen
            showContent={false}
            showBackBtn={true}
            screenTitle="Discover players"
        >
            <FlatList
                data={players}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.chatId as string}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: CARD_SPACING,
                    gap: 8
                }}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <PlayerCard item={item} cardWidth={CARD_WIDTH}/>
                )}
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 10,
    alignItems: "center",
    paddingTop: 20
  }
});
