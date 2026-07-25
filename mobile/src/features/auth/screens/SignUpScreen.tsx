import { View, Keyboard, TouchableOpacity } from "react-native";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from "expo-image";
import { signInWithApple } from "@/features/auth/services/auth.service";
import Screen from "@/components/Screen";
import { api } from "@/api/axios";
import Toast from "react-native-toast-message";
import { getPushToken } from "@/features/onboarding/services/notification.service";

const googleIcon = require("@/assets/images/Google.svg");

export default function SignUpScreen() {
    const { signInWithGoogle } = useGoogleAuth();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);

    // const handleGoogleSignUp = async () => {
    //     if (isGoogleLoading) return;

    //     try {
    //         setIsGoogleLoading(true);
    //         Keyboard.dismiss();

    //         const userCredential = await signInWithGoogle();

    //         if (!userCredential) return;

    //         const firebaseUser = userCredential.user;
    //         const idToken = await firebaseUser.getIdToken();

    //         const response = await api.post("/users/create-user", {
    //             idToken,
    //         })

    //         if(response.data.success) {
    //             await refreshUser(firebaseUser)
    //             // router.replace("/onboarding-first")
    //         }
    //     } catch (error) {
    //         console.error("Google sign-up error:", error);
    //         Toast.show({
    //             type: "error",
    //             text1:
    //                 error instanceof Error
    //                 ? error.message
    //                 : "Unable to create your account",
    //         });
    //     } finally {
    //         setIsGoogleLoading(false);
    //     }
    // };

    const handleGoogleAuth = async () => {
        if (isGoogleLoading) return;

        try {
            setIsGoogleLoading(true);
            Keyboard.dismiss();

            const userCredential = await signInWithGoogle();

            if (!userCredential) return;

            const firebaseUser = userCredential.user;
            const idToken = await firebaseUser.getIdToken();

            await api.post("/auth/login", {
                idToken,
            });

            //save new pushToken
            const pushToken = await getPushToken();
            if(pushToken.granted) {
                await api.patch("/users/update-user-info", {
                    pushToken: pushToken.token,
                });
            }

            await refreshUser(firebaseUser);
        } catch (error) {
            console.error("Google authentication error:", error);

            Toast.show({
            type: "error",
            text1:
                error instanceof Error
                ? error.message
                : "Unable to continue with Google",
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        try {
            const response = await signInWithApple();

            console.log(response.user);
        } catch (error) {
            console.error("Apple login error:", error);
        }
    };

    const socialButton = [
        {
            text: "Continue with Facebook",
            icon: <MaterialCommunityIcons name="facebook" size={28} color="white" />,
            bgColor: "#1877F2",
            onPress: ()=>console.log("facebook"),
            border:  "#1877F2",
            textColor: "white"
        },
        {
            text: "Continue with Apple",
            icon: <AntDesign name="apple" size={28} color="white" />,
            bgColor: "#000000",
            onPress: ()=>console.log("apple"),
            border:  "#000000",
            textColor: "white"
        },
        {
            text: "Continue with Google",
            icon: <Image
                    source={googleIcon}
                    contentFit="cover"
                    style={{
                        width: 24, height: 24
                    }}
                />,
            bgColor: "white",
            onPress: () => handleGoogleAuth(),
            border: Colors.borderColor,
            textColor: "black"
        },
        {
            text: "Continue with Email",
            icon: <Entypo name="mail" size={28} color="#7C7C9C" />,
            bgColor: "white",
            onPress: () => router.push("/email-sign-up"),
            border: Colors.borderColor,
            textColor: "black"
        }
    ]

    return (
        <Screen 
            showContent={false} 
            screenPaddingBottom={0} 
            backBtnPadding={40}
        >
            <View className="flex-1 justify-center px-6">
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Sign up to get started
                </Text>

                <Text className="mt-2 text-left"  style={{color: Colors.textGrey, fontSize: FontSize.default}}>
                    Choose how you’d like to create your account
                </Text>

                <View className="mt-10 gap-4">
                    {socialButton.map((v, k) => (
                        <TouchableOpacity
                            key={k}
                            onPress={v.onPress}
                            style={[styles.socialBtn, {
                                backgroundColor: v.bgColor,
                                borderColor: v.border
                            }]}
                        >
                            {v.icon}
                            <Text style={{color: v.textColor, fontSize: FontSize.default, fontFamily: Font.semiBold}}>
                                {v.text}
                            </Text>
                            <View/>
                        </TouchableOpacity>
                    ))}
                </View>

                <View 
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 20, gap: 4
                    }}
                >
                    <Text className="text-left" style={{color: Colors.textGrey, fontSize: 16}}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/login")}>
                        <Text 
                            style={{color: Colors.primary, fontFamily: "RethinkSans-Bold"}}
                        >
                            Log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottom} className="px-6">
                <View style={styles.divider} />
                <Text style={{fontSize: 16, color: Colors.textGrey}}>
                    By continuing, you agree to our {" "}
                    <Text style={{
                        fontFamily: "RethinkSans-Bold",
                        textDecorationLine: "underline", color: 'black'}}>
                        Terms of Service
                    </Text> and acknowledge 
                    that you understand the {" "}
                    <Text style={{
                        fontFamily: "RethinkSans-Bold",
                        textDecorationLine: "underline", color: 'black'}}
                    >
                        Privacy Policy.
                    </Text>
                </Text>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    socialBtn: {
        borderRadius: 24,
        height: 54,
        backgroundColor: "black",
        display: "flex",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1
    },
    bottom: {
        display: "flex",
        justifyContent: "flex-start",
        gap: 15,
        paddingBottom: 44,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.lightBorderColor,
        width: "100%",
        marginVertical: 16,
    },
})