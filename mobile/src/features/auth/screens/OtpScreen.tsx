import Screen from '@/components/Screen'
import { Text } from '@/components/ui/text'
import { Colors, Font, FontSize } from '@/constants/utils'
import { ActivityIndicator, Pressable, View } from 'react-native'
import BottomSection from '../components/BottomSection'
import { router } from 'expo-router'
import OtpInput from '../components/OtpInput'
import { useLocalSearchParams } from "expo-router";
import { api } from '@/api/axios'
import Toast from 'react-native-toast-message'
import { useTimer } from '@/hooks/useTimer'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/stores/auth.store'

export default function OtpScreen() {
    const { email, password, fullName } = useLocalSearchParams<{
        email: string;
        password: string;
        fullName: string;
    }>();
    const { minutes, seconds, isExpired, restart } = useTimer(5 * 60);
    const otpLength = 6;
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);

    const handleBtn = async () => {
        setLoading(true)
        try {
            const verifyOtpResponse = await api.post("/auth/verify-otp", {email, otp});

            if(!verifyOtpResponse.data.success) {
                Toast.show({
                    type: "error",
                    text1: 'Error',
                    text2: verifyOtpResponse.data.message
                });
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await api.post("/users/create-user", {
                idToken,
                fullName
            });
            
            if(response.data.success) {
                await refreshUser()
                router.replace("/onboarding-first")
            }
            
        } catch (error) {
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: (error as Error).message
            });
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setIsLoading(true)
        try {
            const response = await api.post("/auth/send-otp", {email});

            if(response.data.success) {
                restart()
            }

        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: 'Error',
                text2: "Try again, something went wrong."
            });
        } finally {
            setIsLoading(false)
        }
    }

    const validate = otp.length !== otpLength;

    return (
        <Screen screenPaddingBottom={0}
            dismissKeyboard={true}
            avoidKeyboard={true}
        >
            <View className="px-6" 
                style={{
                    marginTop: 60,
                    flexGrow: 1,
                    justifyContent: "flex-start",
                }}
            >
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Verify your account
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.default,
                        marginTop: 40, marginBottom: 16
                    }}
                >
                    Please enter the 6 digit OTP code sent to your email account
                </Text>

                <OtpInput otp={otp} setOtp={setOtp} length={otpLength}/>
                {isExpired ? (
                    <Pressable onPress={handleResend}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: 'center', 
                            marginTop: 10, gap: 8
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.primary, 
                                fontSize: FontSize.sm
                            }}
                        >Resend OTP</Text>
                        {isLoading && <ActivityIndicator size="small" color={Colors.textGrey} /> }
                    </Pressable>
                    ) : (
                    <Text
                        style={{
                            color: Colors.borderColor, 
                            fontSize: FontSize.sm,
                            marginTop: 10
                        }}
                    >
                        Resend in {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                    </Text>
                )}
            </View>

            <BottomSection handleBtn={handleBtn} btnDisabled={validate} />
        </Screen>
    )
}
