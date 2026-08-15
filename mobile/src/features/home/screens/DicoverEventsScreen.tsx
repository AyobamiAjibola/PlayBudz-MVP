import Screen from "@/components/Screen";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { RenderEmptyEvent } from "./HomeScreen";
import RecommendedEventCard from "../components/RecommendedEventCard";
import { useRecommendedEvent } from "../hooks/useRecommendedEvent";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";

const { width } = Dimensions.get("window");

const SCREEN_PADDING = 16;
const CARD_SPACING = 12;

const CARD_WIDTH =
  (width - SCREEN_PADDING - CARD_SPACING) / 2;

export default function DiscoverEventsScreen() {

    const {
        recommendedEvents,
        isLoading: recIsLoading,
        isFetching: recIsFetching,
        isError: recIsError,
        error: recError,
        refetch: recRefetch,
    } = useRecommendedEvent({ page: 1, limit: 10 });

    if(recIsLoading) {
        return (
            <View
                style={{
                    paddingHorizontal: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                    minHeight: 200
                }}
            >
                <ActivityIndicator/>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <Screen
            showContent={false}
            showBackBtn={true}
            screenTitle="Discover events"
        >
            <FlatList
                data={recommendedEvents}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id as string}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <RecommendedEventCard 
                        item={item} 
                        cardWidth={"100%"}
                    />
                )}
                refreshing={recIsFetching}
                onRefresh={recRefetch}
                ListEmptyComponent={
                    <RenderEmptyEvent
                        onPress={()=>router.push('/home')}
                        message={
                            `There are no events.`
                        }
                        btnText={"Home"}
                    />
                }
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
