import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import ProgressBar from "../component/ProgressBar";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import Screen from "@/components/Screen";
import { router, useFocusEffect } from "expo-router";
import BottomSection from "@/features/auth/components/BottomSection";
import SportsSelector from "../component/SportsSelection";
import AppModal from "@/components/AppModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSecureJson, saveSecureItem, saveSecureJson } from "@/components/SecureStore";
import { OnboardingData } from "../types/onboarding.type";
import { ON_BOARDING_DATA_KEY } from "@/constants/helper";

const popularSports = [
    "🏀 Basket ball",
    "🎾 Long tennis",
    "⚽ Soccer",
    "🥌 Curling",
    "🏸 Badminton",
    "🏐 Volley ball",
    "🏓 Table tennis (ping pong)",
    "⚾ Baseball",
    "🥍 Lacrosse",
    "🏉 Rugby",
]

const sports = [
    ...popularSports,
  "🏉 Canadian football",
  "🏕 Camping",
  "🛶 Canoeing",
  "🏊‍♀️ Swimming"
];

export type SelectedType = {
    interest: string;
    skill_level: string;
}

export default function SecondScreen() {
    const [selected, setSelected] = useState<SelectedType[]>([]);
    const [search, setSearch] = useState<string>("");
    const [modalSearch, setModalSearch] = useState("");
    const [showSearchModal, setShowSearchModal] = useState(false);

    const filteredSports = useMemo(() => {
        return popularSports.filter((sport) =>
            sport.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const modalFilteredSports = useMemo(() => {
        return sports.filter((sport) =>
            sport.toLowerCase().includes(modalSearch.toLowerCase())
        );
    }, [modalSearch]);

    const toggleSport = (sport: string) => {
        setSelected((prev) => {
            const exists = prev.some((item) => item.interest === sport);

            if (exists) {
                return prev.filter((item) => item.interest !== sport);
            }

            return [
                ...prev,
                {
                    interest: sport,
                    skill_level: "",
                },
            ];
        });
    };
    
    const selectSportFromModal = (sport: string) => {
        setSelected((prev) => {
            const exists = prev.some((item) => item.interest === sport);

            if (exists) return prev;

            return [
                ...prev,
                {
                    interest: sport,
                    skill_level: "",
                },
            ];
        });

        setModalSearch("");
        setShowSearchModal(false);
    };

    const handleBtn = async () => {
        const onboarding =
            (await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY)) ?? {};

        const updatedOnboarding = {
            ...onboarding,
            interests: selected,
        };

        await saveSecureJson(ON_BOARDING_DATA_KEY, updatedOnboarding);
        await saveSecureItem("onboardingStep", "2");

        router.push("/onboarding-third");
    };

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
            try {
                const onboarding =
                await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY);

                setSelected(onboarding?.interests ?? []);
            } catch (error) {
                console.error("Failed to load onboarding data:", error);
            }
            };

            loadData();
        }, [])
    );

    return (
        <Screen>
            <ProgressBar currentStep={2} totalSteps={5}/>
            <View className="flex-1 justify-start px-6" style={{marginTop: 40}}>
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    What are your sport interests ?
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.md,
                        marginTop: 30, marginBottom: 6
                    }}
                >
                    Select at least one sport interest, this will help us recommend 
                    events and people with similar interests.
                </Text>
                <SportsSelector
                    selected={selected}
                    toggleSport={toggleSport}
                    filteredSports={filteredSports}
                    setShowSearchModal={setShowSearchModal}
                />
            </View>

            <BottomSection handleBtn={handleBtn} btnDisabled={!selected.length} />
            <AppModal
                visible={showSearchModal}
                setVisible={setShowSearchModal}
            >
                <View className="px-6" style={styles.modalContainer}>
                    <Pressable
                        onPress={() => setShowSearchModal(false)}
                        style={styles.search}
                    >
                        <Ionicons name="close" size={30} color="#6B7280" />

                    </Pressable>

                    <Text style={styles.modalTitle}>
                        Search Sport Interests
                    </Text>

                    <View className="mt-6 h-14 flex-row items-center rounded-xl border border-gray-300 px-4">
                        <TextInput
                            value={modalSearch}
                            onChangeText={setModalSearch}
                            autoFocus
                            placeholder="Search sports"
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-sm text-black"
                        />

                        {modalSearch.length > 0 && (
                            <Pressable onPress={() => setModalSearch("")}>
                                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </Pressable>
                        )}
                    </View>

                    <FlatList
                        data={modalFilteredSports}
                        keyExtractor={(item) => item}
                        className="mt-4"
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                        <Pressable
                            onPress={() => selectSportFromModal(item)}
                            className="border-b py-3"
                            style={{borderColor: Colors.lightBorderColor}}
                        >
                            <Text 
                                style={{fontSize: FontSize.default, color: Colors.textGrey, marginVertical: 6}}
                            >{item}</Text>
                        </Pressable>
                        )}
                        ListEmptyComponent={
                            <View className="mt-8 items-center">
                                <Text className="text-sm text-gray-500">
                                    No sport found.
                                </Text>
                            </View>
                        }
                    />
                </View>
            </AppModal>
        </Screen>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        height: "90%",
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: "white",
        paddingVertical: 20
    },
    search: {
        position: "absolute",
        right: 12,
        top: 12,
        zIndex: 10
    },
    modalTitle: {
        textAlign: "center",
        fontSize: FontSize.md,
        fontFamily: Font.semiBold,
        marginVertical: 20
    }
})