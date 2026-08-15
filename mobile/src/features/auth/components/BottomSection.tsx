import { AppButton } from '@/components/ui/button'
import { Colors } from '@/constants/utils';
import { View } from 'react-native'

type IProps = {
    handleBtn?: ()=>void;
    btnDisabled?: boolean;
    title?: string;
    titleSecond?: string;
    showSecondBtn?: boolean;
    handleSecondBtn?: ()=>void;
    btn2Disabled?: boolean;
    showBtn?: boolean;
    bottomHeight?: number;
    isLoading?: boolean;
}

export default function BottomSection({
    handleBtn, btnDisabled = false, 
    title="Continue", 
    titleSecond="Upload photo",
    showSecondBtn=false,
    handleSecondBtn,
    btn2Disabled = false,
    showBtn=true,
    bottomHeight=110,
    isLoading
}: IProps) {
  return (
    <View className="px-6"
        style={[{
            backgroundColor: "white",
            height: bottomHeight, //showSecondBtn ? 180 : 110,
            width: "100%",
            display: 'flex',
            alignItems: "center",
            // iOS
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: -0.2, // Negative for shadow above
            },
            shadowOpacity: 0.15,
            shadowRadius: 2,

            // Android
            elevation: 6,
        }]}
    >
        {showSecondBtn && <AppButton
            title={titleSecond}
            onPress={handleSecondBtn} 
            textStyle={{fontFamily: "RethinkSans-SemiBold", color: Colors.primary}}
            buttonStyle={{marginTop: 15, width: "100%", backgroundColor: Colors.lightPrimary}}
            disabled={btn2Disabled}
        />}

        {showBtn && <AppButton
            title={title}
            onPress={handleBtn} 
            textStyle={{fontFamily: "RethinkSans-SemiBold"}}
            buttonStyle={{marginTop: 15, width: "100%"}}
            disabled={btnDisabled}
            isLoading={isLoading}
        />}
    </View>
  )
}
