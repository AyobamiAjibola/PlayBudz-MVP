import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Game } from "../types/types";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import LocationIcon from "@/assets/icons/location.svg";
import ClockIcon from "@/assets/icons/clock.svg" 
import ExportIcon from "@/assets/icons/export.svg"
import { splitDateAndTime } from "./Event";
import { router } from "expo-router";

const fallbackImage = require("@/assets/events/1.jpg") 
const creatorFallbackImage = require("@/assets/events/user.jpg") 

type IPropsEvent = {
    item: Game,
    cardWidth: number
}

export default function EventCard({item, cardWidth}: IPropsEvent) {
    const { eventDate, eventTime } = splitDateAndTime(item.gameDateTime);
    const eventImg = `${process.env.EXPO_PUBLIC_SERVER}${item.image}`;
    const creatorImg = `${process.env.EXPO_PUBLIC_SERVER}${item.creator.image}`;

    return (
        <TouchableOpacity style={[styles.container, {width: cardWidth}]}
            onPress={()=>router.push(`/event/${[item.id]}`)}
        >
            <Image
                source={
                    item.image
                      ? { uri: eventImg }
                      : fallbackImage
                  }
                alt="event image"
                contentFit="cover"
                style={{
                    width: "100%",
                    height: 86,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                }}
            />
            <View style={styles.nameSection}>
                <View style={styles.creator}>
                    <Image
                        source={
                            item.creator.image
                            ? { uri: creatorImg }
                            : creatorFallbackImage
                        }
                        alt="creator image"
                        contentFit="cover"
                        style={{
                            height: 20,
                            width: 20,
                            borderRadius: "100%"
                        }}
                    />
                    <Text style={{fontSize: FontSize.xs, color: Colors.textGrey}}>
                        Created by {item.creator.fullName?.trim().split(/\s+/)[0] ?? "User"}
                    </Text>
                </View>

                <View style={styles.sportContainer}>
                    <Text style={{color: "#003300", fontSize: FontSize.xs}}>
                        {item.sport}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Text style={{fontFamily: Font.semiBold}}>
                    {item.title}
                </Text>
                {item?.cancelled && 
                    <View style={styles.statusPill}>
                        <Text style={styles.statusText}>
                            Cancelled
                        </Text>
                    </View>
                }
            </View>

            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center"
                }}
            >
                <ClockIcon height={16} width={16} />
                <Text style={{fontSize: FontSize.sm, color: Colors.textGrey}}>
                    {eventDate}, {eventTime}
                </Text>
            </View>

            <View
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }}
                >
                    <LocationIcon height={16} width={16} />
                    <Text style={{fontSize: FontSize.sm, color: Colors.textGrey}}>
                        {item.location.name}
                    </Text>
                </View>

                <TouchableOpacity>
                    <ExportIcon height={24} width={24} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#FEE2E2"
    },
    statusText: {
        fontSize: 12,
        fontFamily: Font.semiBold,
        color: "#B91C1C"
    },
    container: {
        display: "flex",
        gap: 12,
        padding: 12,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 16,
        minHeight: 262
    },
    nameSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    creator: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexDirection: "row"
    },
    sportContainer: {
        backgroundColor: "#E5FFE5",
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 8
    }
})