import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import PlayerCard from "./PlayerCard";
import { Player } from "../types/types";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width/2 * 0.8;
const CARD_SPACING = 16;

type PlayerProps = {
  players: Player[]
}

export default function PlayersSection({players}: PlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index !== null) {
        setCurrentIndex(viewableItems[0]?.index ?? 0);
      }
    }
  ).current;

    return (
      <View style={styles.container}>
        <FlatList
          data={players}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id as string}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <PlayerCard item={item} cardWidth={CARD_WIDTH}/>
          )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 16
  },
  listContent: {
    gap: CARD_SPACING,
    paddingVertical: 12,
    paddingHorizontal: 24
  }
});