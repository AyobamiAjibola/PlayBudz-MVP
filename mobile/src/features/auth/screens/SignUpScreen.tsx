import AppTextInput from "@/components/AppTextInput";
import Screen from "@/components/Screen";
import { AppButton } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import BottomSection from "../components/BottomSection";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import Toast from "react-native-toast-message";
import { emailRegex, passwordRegex } from "@/constants/helper";
import { api } from "@/api/axios";

export default function SignUpScreen() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBtn = async () => {
        setIsLoading(true);
        //check if email exist in google auth
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.length > 0) {
                Toast.show({
                    type: "error",
                    text1: "This email is already in use.",
                    text1Style:{fontFamily: Font.regular, fontSize: FontSize.default}
                });
                setIsLoading(false);
                return;
            }

            if(!emailRegex.test(email)) {
                Toast.show({
                    type: "error",
                    text1: "Please enter a valid email address.",
                    text1Style:{fontFamily: Font.regular, fontSize: FontSize.default}
                });
                setIsLoading(false);
                return;
            }

            if(!passwordRegex.test(password)) {
                Toast.show({
                    type: "error",
                    text1: "Password is incorrect.",
                    text1Style:{fontFamily: Font.regular, fontSize: FontSize.default}
                });
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.post("/auth/send-otp", {email});

                if(response.data.success) {
                    router.push({pathname: "/otp", params: {email, password, fullName: name}})
                }

            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: (error as Error).message,
                    text1Style:{fontFamily: Font.regular, fontSize: FontSize.sm}
                });
            }

        } catch (err: any) {
            console.error("Error checking email availability:", err);
            Toast.show({
                type: "error",
                text1: err.message || 'Could not verify email. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const validate = !email && !name && !password

    return (
        <Screen>
            <View className="flex-1 px-6" style={{marginTop: 80}}>
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Let’s create your account 
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.default,
                        marginTop: 30, marginBottom: 10
                    }}
                >
                    Enter your details below to create account
                </Text>

                <View className="flex" style={{gap: 18}}>
                    <AppTextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        keyboardType="default"
                        autoCapitalize="words"
                        autoCorrect={false}
                    />

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
                </View>
            </View>

            <BottomSection 
                handleBtn={handleBtn} 
                btnDisabled={validate} 
                isLoading={isLoading} 
            />
        </Screen>
    )
}
