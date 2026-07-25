import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import EventCard from "./EventCard";
import { EventType } from "../types/types";
import { Colors } from "@/constants/utils";
import { PaginationDot } from "./paginationDot";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.85;
const CARD_SPACING = 16;

type EventsProps = {
    events: EventType[]
}

export default function EventSection({events}: EventsProps) {
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

  const MAX_DOTS = 5;

  const getVisibleDots = () => {
    if (events.length <= MAX_DOTS) {
        return events.map((_, index) => index);
    }

    let start = Math.max(0, currentIndex - 2);
    let end = start + MAX_DOTS;

    if (end > events.length) {
        end = events.length;
        start = end - MAX_DOTS;
    }

    return Array.from(
        { length: end - start },
        (_, i) => start + i
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id as string}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
            <EventCard item={item} cardWidth={CARD_WIDTH}/>
        )}
      />

      <View style={styles.pagination}>
          {getVisibleDots().map((index, i) => {
              const isActive = index === currentIndex;

              const isSmall =
                  (i === 0 && index > 0) ||
                  (i === MAX_DOTS - 1 &&
                      index < events.length - 1);

              return (
                  <PaginationDot
                      key={index}
                      isActive={isActive}
                      isSmall={isSmall}
                  />
              );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16
  },
  listContent: {
    gap: CARD_SPACING,
    paddingVertical: 12,
    paddingHorizontal: 30
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  activeDot: {
    width: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary
  },
});