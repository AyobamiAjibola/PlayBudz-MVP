import { View, Keyboard, TouchableOpacity, Pressable } from "react-native";
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

const googleIcon = require("@/assets/images/Google.svg");

export default function LoginScreen() {
    const { signInWithGoogle } = useGoogleAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleEmailLogin = async () => {
        try {
            const userCredential = await loginWithEmail(email, password);

            const idToken = await userCredential.user.getIdToken();

            await api.post("/auth/login", {
                idToken,
            });

            await refreshUser();
        } catch (error) {
            console.error(error, "error from login");
            Toast.show({
                type: "error",
                text1: (error as Error).message,
                text1Style:{fontFamily: Font.regular, fontSize: FontSize.sm}
            });
        }
    };

    const handleGoogleLogin = async () => {
        if (isGoogleLoading) return;

        try {
            setIsGoogleLoading(true);
            Keyboard.dismiss();

            const userCredential = await signInWithGoogle();

            if (!userCredential) return;

            const idToken = await userCredential.user.getIdToken();

            await api.post("/auth/login", {
                idToken,
            });

            await refreshUser();
        } catch (error) {
            console.error(error);
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
            onPress: ()=>handleGoogleLogin(),
            border: Colors.borderColor,
            textColor: "black"
        }
    ]

    return (
        <Screen>
            <View className="flex-1 justify-center px-6">
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
                        rightIcon={
                            <Pressable
                                onPress={() => setIsPasswordVisible((prev) => !prev)}
                                style={{
                                    position: "absolute",
                                    right: 16,
                                    top: 0,
                                    height: 56,
                                    justifyContent: "center",
                                }}
                                hitSlop={10}
                                >
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                    size={22}
                                    color="#6B7280"
                                />
                            </Pressable>
                        }
                    />

                    <Text
                        onPress={()=>console.log("forgot password")}
                        style={{
                            fontFamily: "RethinkSans-Bold",
                            fontSize: FontSize.default,
                            color: Colors.primary
                        }}
                    >Forgot password?</Text>
                </View>

                <AppButton
                    title="Log in" 
                    onPress={handleEmailLogin} 
                    textStyle={{fontFamily: "RethinkSans-SemiBold"}}
                    buttonStyle={{marginTop: 30, width: "100%"}}
                />
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
        height: 0.6,
        backgroundColor: Colors.borderColor,
        width: "100%",
        marginVertical: 16,
    },
})