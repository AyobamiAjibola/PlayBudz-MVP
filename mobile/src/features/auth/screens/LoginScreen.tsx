import { View, Keyboard, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { loginWithEmail, signInWithApple } from "../services/auth.service";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from "expo-image";
import AppTextInput from "@/components/AppTextInput";
import Screen from "@/components/Screen";
import { AppButton } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/api/axios";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { auth } from "@/config/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import { getPushToken } from "@/features/onboarding/services/notification.service";
import GoogleIcon from "@/assets/images/Google.svg";

export default function LoginScreen() {
    const { signInWithGoogle } = useGoogleAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleEmailLogin = async () => {
        if(isLoading) return;

        try {
            setIsLoading(true)
            const userCredential = await loginWithEmail(email, password);

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
            // Prevent Firebase from remaining authenticated
            // when the backend rejects the login.
            if (auth.currentUser) {
                await firebaseSignOut(auth);
            }

            console.error("Error from email login:", error);

            Toast.show({
                type: "error",
                text1: 'Error',
                text2: 
                    error instanceof Error
                        ? error.message
                        : "Unable to log in"
            });
        } finally {
            setIsLoading(false)
        }
    };

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
            text1: 'Error',
            text2:
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
            icon: <GoogleIcon width={24} height={24} />,
            bgColor: "white",
            onPress: ()=>handleGoogleAuth(),
            border: Colors.borderColor,
            textColor: "black"
        }
    ]

    return (
        <Screen 
            showContent={false} 
            screenPaddingBottom={0} 
            backBtnPadding={40}
            dismissKeyboard={true}
            avoidKeyboard={true}
        >
            <ScrollView className="px-6"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    marginTop: 20
                }}
            >
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Welcome back
                </Text>

                <Text className="mt-2 text-left"  style={{color: Colors.textGrey, fontSize: 16}}>
                    Enter your details below to log in
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
                            <Text style={{color: v.textColor, fontSize: 16, fontFamily: "RethinkSans-SemiBold"}}>
                                {v.text}
                            </Text>
                            <View/>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex justify-center items-center" 
                    style={{flexDirection: "row", position: "relative", marginVertical: 40}}
                >
                    <View style={styles.divider} />
                    <Text 
                        style={{
                            fontSize: 20, color: Colors.textGrey, 
                            position: "absolute",
                            fontFamily: "RethinkSans-Bold"
                        }}
                    >Or</Text>
                </View>

                <View className="flex" style={{gap: 8}}>
                    <AppTextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <AppTextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onPressRightIcon={()=>setIsPasswordVisible((prev) => !prev)}
                        rightIcon={
                            <Ionicons
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={22}
                                color="#6B7280"
                            />
                        }
                    />

                    <TouchableOpacity onPress={()=>console.log("forgot password")}>
                        <Text
                            style={{
                                fontFamily: "RethinkSans-Bold",
                                fontSize: FontSize.default,
                                color: Colors.primary
                            }}
                        >
                            Forgot password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <AppButton
                    title="Log in" 
                    onPress={handleEmailLogin} 
                    textStyle={{fontFamily: "RethinkSans-SemiBold"}}
                    buttonStyle={{marginTop: 30, width: "100%"}}
                    isLoading={isLoading}
                />
                <View 
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 4, marginTop: 10
                    }}
                >
                    <Text className="text-left" style={{color: Colors.textGrey, fontSize: 16}}>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/sign-up")}>
                        <Text 
                            style={{color: Colors.primary, fontFamily: "RethinkSans-Bold"}}
                        >
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        height: 0.6,
        backgroundColor: Colors.borderColor,
        width: "100%",
        marginVertical: 16,
    },
})