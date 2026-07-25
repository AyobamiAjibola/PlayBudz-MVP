import Screen from '@/components/Screen'
import { useState } from 'react'
import ProgressBar from '../component/ProgressBar'
import { StyleSheet, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Colors, Font, FontSize } from '@/constants/utils'
import { LocationSearchInput, SelectedLocation } from '@/components/LocationSearchInput'
import BottomSection from '@/features/auth/components/BottomSection'
import AppModal from '@/components/AppModal'
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { AppButton } from '@/components/ui/button'
import { getSecureJson, removeSecureItem } from '@/components/SecureStore'
import { OnboardingData } from '../types/onboarding.type'
import { ON_BOARDING_DATA_KEY } from '@/constants/helper'
import { useAppStore } from '@/stores/app.store'
import { api } from '@/api/axios'
import { router } from 'expo-router'
import { useAuthStore } from '@/stores/auth.store'
import Toast from 'react-native-toast-message'
import { getPushToken } from '../services/notification.service'

export default function FifthScreen() {
    const [location, setLocation] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [notification, setNotification] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { profileImage, setProfileImage } = useAppStore();
    const refreshUser = useAuthStore((state) => state.refreshUser);

    const enableNotifications = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const result = await getPushToken();

            if (!result.granted) {
                router.replace("/home");
                return;
            }

            await api.patch("/users/update-user-info", {
                notificationEnabled: true,
                pushToken: result.token,
            });

            await refreshUser();
            router.replace("/home");
            
        } catch (error) {
            console.error(error);

            Toast.show({
                type: "error",
                text1:
                    error instanceof Error
                    ? error.message
                    : "Unable to enable notifications",
                text1Style: {
                    fontFamily: Font.regular,
                    fontSize: FontSize.sm,
                },
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const disableNotification = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            // await api.patch("/users/update-notification", {
            //     notificationEnabled: false,
            // });

            await refreshUser();

            router.replace("/home");
        } catch (error) {
            console.error("Disable notification error:", error);

            Toast.show({
                type: "error",
                text1:
                    error instanceof Error
                    ? error.message
                    : "Unable to update notification preference",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData();

            const onboarding =
                await getSecureJson<Partial<OnboardingData>>(ON_BOARDING_DATA_KEY);

            formData.append("image", {
                uri: profileImage!.uri,
                name: profileImage!.fileName ?? `profile-${Date.now()}.jpg`,
                type: profileImage!.mimeType ?? "image/jpeg"
            } as any);
            formData.append("dob", onboarding?.dateOfBirth ?? "");
            formData.append("gender", onboarding?.gender ?? "");
            formData.append("biography", onboarding?.bio ?? "");
            formData.append(
                "interests",
                JSON.stringify(onboarding?.interests ?? [])
            );
            formData.append("location", JSON.stringify(selectedLocation) ?? "");

            const response = await api.patch("/users/update-user", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if(response.data.success) {
                setProfileImage(null)
                
                await removeSecureItem("onboardingStep");
                await removeSecureItem(ON_BOARDING_DATA_KEY);

                setNotification(true);
            }

        } catch (error) {
            Toast.show({
                type: "error",
                text1: (error as Error).message,
                text1Style:{fontFamily: Font.regular, fontSize: FontSize.sm}
            });
        } finally {
            setIsLoading(false)
        }

    };

    return (
        <Screen screenPaddingBottom={0} backBtnPadding={40} 
            showContent={false} backBtnRoute={"/onboarding-fourth"}
            dismissKeyboard={true}
        >
            <ProgressBar currentStep={5} totalSteps={5}/>
            <View className="px-6"
                style={{
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    marginTop: 20
                }}
            >   
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Where are you located?
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.md,
                        marginTop: 30, marginBottom: 6
                    }}
                >
                    We need your location to find sports buddies and events near you.
                </Text>

                <View style={{display: "flex", marginTop: 20, gap: 14}}>
                    <LocationSearchInput
                        value={location}
                        onChangeText={setLocation}
                        onSelectLocation={setSelectedLocation}
                    />
                </View>
            </View> 

            <BottomSection handleBtn={handleSubmit} isLoading={isLoading} />
            <AppModal
                visible={notification}
                setVisible={setNotification}
            >
                <View className="px-6" style={styles.modalContainer}>
                    <View className="flex-1 bg-white justify-center">
                        <View className="items-center">
                            <View className="h-24 w-24 rounded-full items-center justify-center"
                                style={{backgroundColor: Colors.lightPrimary}}
                            >
                                <Ionicons
                                    name="notifications"
                                    size={48}
                                    color={Colors.primary}
                                />
                            </View>

                            <Text
                                className="mt-8 text-3xl font-bold text-center"
                            >
                                Stay Updated
                            </Text>

                            <Text
                                className="mt-4 text-center"
                                style={{fontSize: FontSize.md, lineHeight: 22, color: Colors.textGrey}}
                            >
                                Turn on notifications so you never miss match invitations,
                                friend requests, tournament announcements, and important
                                updates from Play Budz.
                            </Text>
                        </View>

                        <View className="mt-12 gap-2">
                            <AppButton
                                title="Enable Notifications"
                                onPress={enableNotifications} 
                                textStyle={{fontFamily: "RethinkSans-SemiBold"}}
                                buttonStyle={{width: "100%"}}
                                isLoading={isLoading}
                            />

                            <AppButton
                                title="Maybe Later"
                                onPress={disableNotification} 
                                textStyle={{fontFamily: "RethinkSans-SemiBold", color: Colors.primary}}
                                buttonStyle={{
                                    width: "100%", 
                                    backgroundColor: Colors.lightPrimary, 
                                    borderColor: Colors.primary,
                                    borderWidth: 0.2
                                }}
                            />
                        </View>
                    </View>
                </View>
            </AppModal>
        </Screen>
  )
}

const styles = StyleSheet.create({
    modalContainer: {
        height: "100%",
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: "white",
        paddingVertical: 20
    },
})
