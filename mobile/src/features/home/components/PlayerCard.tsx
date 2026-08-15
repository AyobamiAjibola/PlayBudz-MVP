import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Interest, Player } from "../types/types";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";

const fallbackImage = require("@/assets/events/1.jpg")

type IPropsPlayer = {
    item: Player,
    cardWidth: number
}

export default function PlayerCard({item, cardWidth}: IPropsPlayer) {
    const sports = item.interests.filter((game: Interest) => game.interest)
    const profileImg = `${process.env.EXPO_PUBLIC_SERVER}${item.image}`;

    return (
        <View style={[styles.container, {width: cardWidth}]}>
            <Image
                source={
                    item.image
                      ? { uri: profileImg }
                      : fallbackImage
                  }
                alt="event image"
                contentFit="cover"
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: "100%",
                    marginBottom: 12
                }}
            />
            <Text style={{fontFamily: Font.semiBold, textAlign: "center"}}>
                {item.fullName?.trim().split(/\s+/)[0] ?? "User"}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flexShrink: 1,
                    marginTop: -10,
                    marginBottom: 10
                }}
            >
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                        flexShrink: 1,
                        fontSize: FontSize.xs,
                        color: Colors.textGrey,
                    }}
                >
                    {sports
                        .map((sport: Interest) =>
                            sport.interest.split(" ").slice(1).join(" ")
                        )
                        .join(" • ")}
                </Text>
            </View>
            <TouchableOpacity onPress={()=>console.log("pressed")} style={styles.startChat}>
                <Text 
                    style={{
                        fontFamily: Font.semiBold, 
                        fontSize: FontSize.sm, 
                        color: Colors.primary
                    }}
                >
                    Start chat
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        gap: 12,
        padding: 12,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 16,
        minHeight: 255
    },
    startChat: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.lightPrimary,
        borderRadius: 24,
        height: 36
    }
})