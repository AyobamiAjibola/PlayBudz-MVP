import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SectionHeadingType } from "../types/types";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";

export default function SectionHeading({title, onPress}: SectionHeadingType) {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: FontSize.lg, fontFamily: Font.semiBold}}>
            {title}
        </Text>
         {onPress && (
            <TouchableOpacity onPress={onPress}>
                <Text
                    style={{
                        color: Colors.primary,
                        fontFamily: Font.semiBold,
                        fontSize: FontSize.default,
                    }}
                >
                    View all
                </Text>
            </TouchableOpacity>
        )}
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})