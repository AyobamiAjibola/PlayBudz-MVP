import Screen from "@/components/Screen";
import { Text } from "@/components/ui/text";
import { Font } from "@/constants/utils";
import { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { EventTab, RenderEmptyEvent } from "./HomeScreen";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { useSavedEvent } from "../hooks/useSavedEvents";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48 //48 is the left and right padding of the parent

const tabs: EventTab[] = ["Upcoming", "Saved", "Past"];

export default function EventsScreen() {
    const [selected, setSelected] = useState<EventTab>("Upcoming");
    const [date, setDate] = useState<string>("");

    const mode =
    selected === "Upcoming"
        ? "upcoming"
        : selected === "Past"
        ? "past"
        : undefined;

    const filter =
    selected === "Saved"
        ? "saved"
        : undefined;

    const {
    events,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    } = useEvents({ page: 1, limit: 10, date, filter, status: mode });

    const {
        events: savedEvents,
        isLoading: sIsLoading,
        isFetching: sIsFetching,
        isError: sIsError,
        error: sError,
        refetch: sRefetch,
    } = useSavedEvent({ page: 1, limit: 10 });

    const isSaved = filter === "saved";
    
    const currentEvents = isSaved ? savedEvents : events;
    const currentLoading = isSaved ? sIsLoading : isLoading;
    const currentFetching = isSaved ? sIsFetching : isFetching;
    const currentRefetch = isSaved ? sRefetch : refetch;
    const currentError = isSaved ? sError : error;
    const currentIsError = isSaved ? sIsError : isError;

    const handleChange = (item: EventTab) => {
        setSelected(item);
    };
    
    if(currentLoading) {
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
            screenTitle="Your Events"
        >
            <View 
                style={{
                    flex: 1,
                    paddingHorizontal: 24
                }}
            >
                <FlatList
                    data={currentEvents}
                    ListHeaderComponent={
                        <View style={styles.filter}>
                            {tabs.map((item) => (
                                <TouchableOpacity key={item} onPress={()=>handleChange(item)}>
                                    <Text
                                        style={[styles.filterBtn, {
                                            color: selected === item ? "white" : "#585874",
                                            fontFamily: selected === item ? Font.semiBold : Font.regular,
                                            backgroundColor: selected === item ? "#1A0000" : "#EBEBF0"
                                        }]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    }
                    keyExtractor={(item) => item.id as string}
                    refreshing={currentFetching}
                    onRefresh={currentRefetch}
                    decelerationRate="fast"
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <EventCard item={item} cardWidth={CARD_WIDTH}/>
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <RenderEmptyEvent
                            onPress={()=>router.push('/home')}
                            message={
                                `You have no events, please create events`
                            }
                            btnText={"Home"}
                        />
                    }
                />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    filter: {
        gap: 12,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        marginTop: 16,
        flex: 1
    },
    filterBtn: {
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    listContent: {
        gap: 12
    },
})