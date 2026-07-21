import AppTextInput from "@/components/AppTextInput";
import Screen from "@/components/Screen";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import ProgressBar from "../component/ProgressBar";
import BottomSection from "@/features/auth/components/BottomSection";
import AppDatePicker from "@/components/AppDatePicker";
import AppSelect from "@/components/AppSelect";
import { router, useFocusEffect } from "expo-router";
import { getSecureJson, saveSecureItem, saveSecureJson } from "@/components/SecureStore";
import { ON_BOARDING_DATA_KEY } from "@/constants/helper";
import { OnboardingData } from "../types/onboarding.type";
import { useAuthStore } from "@/stores/auth.store";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export default function FirstScreen() {
    const [bio, setBio] = useState<string>("");
    const [dateOfBirth, setDateOfBirth] = useState<string>("");
    const [gender, setGender] = useState("");
    const { user } = useAuthStore.getState();

    const displayName =
        (user?.auth.displayName ?? user?.profile.fullName)
            ?.split(" ")[0]
            ?.replace(/\s/g, "");

    const handleBtn = async () => {
         const onboarding =
            (await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY)) ?? {};

        await saveSecureJson(ON_BOARDING_DATA_KEY, {
            ...onboarding,
            dateOfBirth,
            gender, bio
        });
        await saveSecureItem("onboardingStep", "1");
        router.push("/onboarding-second")
    }

    const validation = !dateOfBirth || !gender

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const onboarding =
                        await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY);

                    if (!onboarding) return;

                    setBio(onboarding.bio ?? "");
                    setDateOfBirth(onboarding.dateOfBirth ?? "");
                    setGender(onboarding.gender ?? "");

                } catch (error) {
                    console.error("Failed to load onboarding data:", error);
                }
            };

            loadData();
        }, [])
    );

    return (
        <Screen>
            <ProgressBar currentStep={1} totalSteps={5}/>
            <View className="flex-1 justify-start px-6" style={{marginTop: 40}}>
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Welcome {displayName || ""}, let’s know more about you
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.default,
                        marginTop: 30, marginBottom: 6
                    }}
                >
                    Kindly note that your gender and bio will be visible on your profile, but we’ll hide your age.
                </Text>

                <View className="flex" style={{gap: 18, marginTop: 10}}>
                    <AppDatePicker
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        placeholder="Date of birth"
                    />

                    <AppSelect
                        value={gender}
                        onChange={setGender}
                        placeholder="Select gender"
                        options={genderOptions}
                    />

                    <AppTextInput
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Biography (Optional)"
                        autoCapitalize="none"
                        autoCorrect={false}
                        multiline
                        textAlignVertical="top"
                        style={{
                            minHeight: 160
                        }}
                    />
                </View>
            </View>

            <BottomSection handleBtn={handleBtn} btnDisabled={validation}/>
        </Screen>
    )
}
