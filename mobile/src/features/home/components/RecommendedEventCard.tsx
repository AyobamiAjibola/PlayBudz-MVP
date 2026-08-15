import { ActivityIndicator, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Game } from "../types/types";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import ClockIcon from "@/assets/icons/clock.svg" 
import ExportIcon from "@/assets/icons/export.svg"
import LocationIcon from "@/assets/icons/location.svg";
import SaveIcon from "@/assets/icons/saveIcon.svg"
import { splitDateAndTime } from "./Event";
import { router } from "expo-router";

const fallbackImage = require("@/assets/events/1.jpg") 
const creatorFallbackImage = require("@/assets/events/user.jpg")

type IPropsEvent = {
    item: Game;
    cardWidth: any;
}

export default function RecommendedEventCard({item, cardWidth}: IPropsEvent) {
    const { eventDate, eventTime } = splitDateAndTime(item.gameDateTime);
    const eventImg = `${process.env.EXPO_PUBLIC_SERVER}${item.image}`;
    const creatorImg = `${process.env.EXPO_PUBLIC_SERVER}${item.creator.image}`;

    return (
        <Pressable style={[styles.container, {width: cardWidth}]}
            onPress={()=>router.push(`/event/${[item.id]}`)}
        >
            <View style={styles.wrapper}>
                <Image
                    source={
                    item.image
                      ? { uri: eventImg }
                      : fallbackImage
                    }
                    alt="event image"
                    contentFit="cover"
                    style={{
                        width: 68,
                        height: 68,
                        borderRadius: 8
                    }}
                />
                <View style={styles.rightSideWrapper}>
                    <View style={styles.nameSection}>
                        <View style={styles.creator}>
                            <Image
                                source={
                                    item.creator.image
                                    ? { uri: creatorImg }
                                    : creatorFallbackImage
                                }
                                alt="created by image"
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
                    <Text style={{fontFamily: Font.semiBold}}>
                        {item.title}
                    </Text>
                </View>
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
                    marginTop: -8
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
                    <LocationIcon height={16} width={16}/>
                    <Text style={{fontSize: FontSize.sm, color: Colors.textGrey}}>
                        {item.location.name}
                    </Text>
                </View>

                <View
                    style={{
                        alignItems: "center",
                        gap: 8, flexDirection: "row"
                    }}
                >
                    <TouchableOpacity>
                        <ExportIcon height={24} width={24}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <SaveIcon height={24} width={24}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
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
        minHeight: 184,
        marginBottom: 12
    },
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomColor: "#EBEBF0",
        borderBottomWidth: 1,
        paddingBottom: 20,
        paddingTop: 12
    },
    rightSideWrapper: {
        flex: 1,
        justifyContent: "flex-start",
        height: "100%"
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