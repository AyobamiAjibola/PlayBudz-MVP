import Screen from "@/components/Screen";
import { Text } from "@/components/ui/text";
import { Font } from "@/constants/utils";
import { useState } from "react";
import { Dimensions, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { events } from "./HomeScreen";
import EventCard from "../components/EventCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const CARD_SPACING = 16;

const filter = ["Upcoming", "Saved", "Past"];

export default function EventsScreen() {
    const [selected, setSelected] = useState<string>("Upcoming");

    const handleChange = (item: string) => {
        setSelected(item)
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
                    justifyContent: "center", 
                    alignItems: "center"
                }}
            >
                <FlatList
                    data={events}
                    ListHeaderComponent={
                        <View style={styles.filter}>
                            {filter.map((item) => (
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
                    decelerationRate="fast"
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <EventCard item={item} cardWidth={CARD_WIDTH}/>
                    )}
                    showsVerticalScrollIndicator={false}
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
        gap: CARD_SPACING,
        paddingVertical: 12
    },
})