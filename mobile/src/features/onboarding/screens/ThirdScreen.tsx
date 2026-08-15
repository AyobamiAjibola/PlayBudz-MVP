import Screen from "@/components/Screen";
import ProgressBar from "../component/ProgressBar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import BottomSection from "@/features/auth/components/BottomSection";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getSecureJson, saveSecureItem, saveSecureJson } from "@/components/SecureStore";
import { OnboardingData } from "../types/onboarding.type";
import { ON_BOARDING_DATA_KEY } from "@/constants/helper";
import { SelectedType } from "./SecondScreen";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import AppModal from "@/components/AppModal";

const Levels = ["Beginner", "Intermediate", "Expert"]

export default function ThirdScreen() {
    const [interests, setInterests] = useState<SelectedType[]>([]);
    const [showInterestModal, setShowInterestModal] = useState<boolean>(false);
    const [selectedInterest, setSelectedInterest] = useState<SelectedType>();

    const handleBtn = async () => {
        const onboarding =
            (await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY)) ?? {};

        const updatedOnboarding = {
            ...onboarding,
            interests,
        };

        await saveSecureJson(ON_BOARDING_DATA_KEY, updatedOnboarding);
        await saveSecureItem("onboardingStep", "3");

        router.push("/onboarding-fourth");
    };

    const handleSelectedInterest = (interest: SelectedType) => {
        setShowInterestModal(true)
        setSelectedInterest(interest)
    }

    const updateSkillLevel = (level: string) => {
        if (!selectedInterest) return;

        setInterests((prev) =>
            prev.map((interest) =>
            interest.interest === selectedInterest.interest
                ? {
                    ...interest,
                    skill_level: level,
                }
                : interest
            )
        );

        setSelectedInterest((prev) =>
            prev
            ? {
                ...prev,
                skill_level: level,
                }
            : prev
        );

        setShowInterestModal(false)
    };

    const isComplete = interests.every(
        (item) => item.skill_level.trim() !== ""
    );

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
            try {
                const onboarding =
                await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY);

                setInterests(onboarding?.interests ?? []);
            } catch (error) {
                console.error("Failed to load onboarding data:", error);
            }
            };

            loadData();
        }, [])
    );

    return (
        <Screen screenPaddingBottom={0} backBtnPadding={40} showContent={false} backBtnRoute={"/onboarding-second"}>
            <ProgressBar currentStep={3} totalSteps={5}/>
            <ScrollView className="px-6"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    marginTop: 20
                }}
            >
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    How skilled are you?
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.md,
                        marginTop: 30, marginBottom: 6
                    }}
                >
                    Tell us more about you skill level in the following sports you selected.
                </Text>

                <View style={{display: "flex", marginTop: 20, gap: 14}}>
                    {
                        interests.map((interest, idx) => (
                            <Pressable
                                key={idx} 
                                onPress={() => handleSelectedInterest(interest)}
                                className="border-b py-3"
                                style={styles.container}
                            >
                                <Text style={{fontSize: FontSize.default}}>
                                    {interest.interest.split(" ").slice(1).join(" ")}
                                </Text>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 16
                                    }}
                                >
                                    <Text 
                                        style={{
                                            fontSize: FontSize.default,
                                            fontFamily: interest.skill_level !== "" ? Font.bold : Font.regular,
                                            color: Colors.borderColor
                                        }}
                                    >
                                        {interest.skill_level === "" ? "Select" : interest.skill_level}
                                    </Text>
                                    <SimpleLineIcons name="arrow-right" size={14} color="#7C7C9C" />
                                </View>
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>

            <BottomSection handleBtn={handleBtn} btnDisabled={!isComplete} />
            <AppModal
                visible={showInterestModal}
                setVisible={setShowInterestModal}
            >
                <View className="px-6" style={styles.modalContainer}>
                    <Pressable
                        onPress={() => setShowInterestModal(false)}
                        style={styles.close}
                    >
                        <Ionicons name="close" size={30} color="#6B7280" />
                    </Pressable>

                    <Text style={styles.modalTitle}>
                        {selectedInterest?.interest.split(" ").slice(1).join(" ")}
                    </Text>

                    <Text>
                        Skill level
                    </Text>
                    <View style={styles.levelContainer}>
                        {
                            Levels.map((level: string) => {
                                const isSelected = selectedInterest?.skill_level === level;

                                return (
                                    <Pressable 
                                        key={level}
                                        onPress={() => updateSkillLevel(level)}
                                        style={[
                                            styles.level,
                                            {
                                                backgroundColor: isSelected ? Colors.lightPrimary : Colors.bgGrey,
                                                borderColor: isSelected ? Colors.primary : Colors.borderColor
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: isSelected ? "#D62828" : "#444",
                                                fontWeight: isSelected ? "600" : "400",
                                            }}
                                        >{level}</Text>
                                    </Pressable>
                                )
                        })}
                    </View>
                </View>
            </AppModal>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: Colors.lightBorderColor
    },
    modalContainer: {
        height: "40%",
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: "white",
        paddingVertical: 20
    },
    close: {
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
    },
    level: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        height: 54,
        width: "100%",
        borderRadius: 9999,
        borderWidth: 1,
        display: "flex",
        justifyContent: "center"
    },
    levelContainer: {
        display: "flex",
        gap: 12,
        marginTop: 16
    }
})
