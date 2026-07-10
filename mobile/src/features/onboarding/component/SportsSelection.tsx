import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Font, FontSize } from "@/constants/utils";
import { SelectedType } from "../screens/SecondScreen";

type IProps = {
    selected: SelectedType[];
    toggleSport: (sport: string)=>void;
    filteredSports: string[];
    setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SportsSelector({selected, toggleSport, filteredSports, setShowSearchModal}: IProps) {
  const [hidePopular, setHidePopular] = useState<boolean>(true);

  const toggleHidePopular = () => {
    setHidePopular(!hidePopular)
  }

  const selectedInterests = selected.map((i) => i.interest);

  return (
    <View className="flex-1" style={{marginTop: 12}}>
        <Pressable
            onPress={() => setShowSearchModal(true)}
            className="h-14 justify-center rounded-xl px-4"
            style={{
                borderColor: Colors.borderColor,
                borderWidth: 0.5,
                backgroundColor: "white",
                marginBottom: 20
            }}
        >
            <Text className="text-base text-gray-400">Search or add sports</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>
            Selected
        </Text>

        <View
            style={styles.selectedContainer}
        >
            { !selectedInterests.length
                ? (
                    <Text
                        style={{
                            fontSize: 14,
                            color: Colors.borderColor
                        }}
                    >Please select your interests</Text>
                ) : (
                    selectedInterests.map((sport) => (
                        <Pressable
                            key={sport}
                            onPress={() => toggleSport(sport)}
                            style={styles.selected}
                        >
                            <Text style={{fontSize: 14, color: Colors.dangerBorder}}>{sport}</Text>
                            <Ionicons name="close" size={16} color="black" />
                        </Pressable>
                )
            ))}
        </View>

        <View className="flex-row items-center gap-2">
            <Text style={styles.sectionTitle}>
                Popular sports
            </Text>
            { hidePopular 
                ?   <Ionicons 
                        name="chevron-down" size={18}  
                        color="#64748B" 
                        onPress={toggleHidePopular} 
                        style={{marginTop: 2}}
                    />
                :   <Ionicons 
                        name="chevron-up" 
                        size={18} color="#64748B" 
                        onPress={toggleHidePopular} 
                        style={{marginTop: 2}}
                    />
            }
        </View>

        <View
            style={[styles.selectedContainer, {display: hidePopular ? "flex" : "none"}]}
        >
            { filteredSports.map((item) => {
                const isSelected = selectedInterests.includes(item); 

                return (
                    <Pressable
                        key={item}
                        onPress={() => toggleSport(item)}
                        style={
                            isSelected ? styles.selected : styles.onSelected
                        }
                    >
                        <Text style={isSelected ? styles.selectedText : styles.onSelectedText}>
                            {item}
                        </Text>

                        {isSelected && (
                            <Ionicons name="close" size={16} color="black" />
                        )}
                    </Pressable>
                );
            })}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    selected: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        gap: 2,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: Colors.dangerBorder,
        backgroundColor: Colors.dangerLight,
        padding: 8,
        fontSize: 14
    },
    selectedText: {
        fontSize: 14, 
        color: Colors.dangerBorder
    },
    onSelectedText: {
        fontSize: 14, 
        color: Colors.textGrey
    },
    onSelected: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        gap: 2,
        borderRadius: 9999,
        borderWidth: 0.5,
        borderColor: Colors.borderColor,
        backgroundColor: "#EBEBF0",
        padding: 8,
        fontSize: 14
    },
    selectedContainer: {
        display: "flex", 
        flexDirection: "row",
        flexWrap: "wrap", 
        gap: 8, marginTop: 6,
        marginBottom: 26
    },
    sectionTitle: {
        fontFamily: Font.bold, 
        fontSize: FontSize.default,
        color: "#585874"
    }
})