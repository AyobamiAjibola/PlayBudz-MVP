import Screen from "@/components/Screen";
import ProgressBar from "../component/ProgressBar";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Colors, Font, FontSize } from "@/constants/utils";
import BottomSection from "@/features/auth/components/BottomSection";
import { router } from "expo-router";
import { Image } from "expo-image";
import Feather from '@expo/vector-icons/Feather';
import { pickImage } from "@/utils/pickImage";
import { useAppStore } from "@/stores/app.store";

export default function FourthScreen() {
    const { profileImage, setProfileImage } = useAppStore();

    const handleSecondBtn = async () => {
        const asset = await pickImage();

        if (asset) {
            setProfileImage(asset);
        }
    };

    const handleBtn = async () => {
        router.push("/onboarding-fifth");
    };

    return (
        <Screen>
            <ProgressBar currentStep={4} totalSteps={5}/>
            <View className="flex-1 justify-start px-6" style={{marginTop: 40}}>
                <Text className="text-left font-bold text-black" style={{fontSize: FontSize.screenTitle, fontFamily: Font.semiBold}}>
                    Let’s put a face to the name
                </Text>
                <Text className="text-left"  
                    style={{
                        color: Colors.textGrey, 
                        fontSize: FontSize.md,
                        marginTop: 30, marginBottom: 6
                    }}
                >
                    Choose a profile picture, that shows your face clearly.
                </Text>

                <View style={{display: "flex", marginTop: 20, gap: 14}}>
                    {!profileImage && <View style={styles.imageUpload}>
                        <Feather name="camera" size={40} color="white" />
                    </View>}
                    {profileImage && (
                        <Image
                            source={{ uri: profileImage.uri }}
                            style={{ width: 200, height: 200, borderRadius: 16 }}
                            contentFit="cover"
                        />
                        )
                    }
                </View>
            </View>

            <BottomSection 
                handleBtn={handleBtn} 
                showSecondBtn={true} 
                handleSecondBtn={handleSecondBtn}
                titleSecond={profileImage ? "Change photo" : "Upload photo"}
                showBtn={profileImage ? true : false}
                bottomHeight={ profileImage ? 180 : 110 }
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
    imageUpload: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        height: 200,
        width: 200,
        backgroundColor: "#B4B4BB",
        borderRadius: 16
    }
})
