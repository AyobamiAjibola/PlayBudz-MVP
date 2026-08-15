import Screen from "@/components/Screen";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, View } from "react-native";
import { RenderEmptyEvent } from "./HomeScreen";
import PlayerCard from "../components/PlayerCard";
import { router } from "expo-router";
import { usePlayers } from "../hooks/usePlayers";
import { Text } from "@/components/ui/text";

const { width } = Dimensions.get("window");

const SCREEN_PADDING = 16;
const CARD_SPACING = 12;

const CARD_WIDTH =
  (width - SCREEN_PADDING * 2 - CARD_SPACING) / 2;

export default function DiscoverPlayersScreen() {

    const {
        players,
        isLoading: pIsLoading,
        isFetching: pIsFetching,
        isError: pIsError,
        error: pError,
        refetch: pRefetch,
    } = usePlayers({ page: 1, limit: 10 });

    if(pIsLoading) {
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
            screenTitle="Discover players"
        >
            <FlatList
                data={players}
                refreshing={pIsFetching}
                onRefresh={pRefetch}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id as string}
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
                ListEmptyComponent={
                    <RenderEmptyEvent
                        onPress={()=>router.push('/home')}
                        message={
                            `No players`
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
    alignItems: "center",
    paddingTop: 20
  }
});
