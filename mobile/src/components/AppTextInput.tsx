import { Font, FontSize } from "@/constants/utils";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

interface AppTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPressRightIcon?: ()=>void;
  onPressLeftIcon?: ()=>void;
}

export default function AppTextInput({
  style,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onPressRightIcon,
  onPressLeftIcon,
  ...props
}: AppTextInputProps) {

  const isPasswordField = secureTextEntry === true;

  return (
    <View className="relative">
      <Pressable
        onPress={onPressLeftIcon}
        style={{
          position: "absolute",
          right: 0,
          left: 16,
          top: 0,
          height: 56,
          justifyContent: "center",
          zIndex: 999,
          width: 22
        }}
        hitSlop={10}
      >{ leftIcon }</Pressable>

      <TextInput
        {...props}
        secureTextEntry={isPasswordField}
        style={[{
          height: 54,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "white",
          paddingLeft: leftIcon ? 48 : 16,
          fontSize: FontSize.default,
          paddingRight: rightIcon ? 48 : 16
        }, style]}
      />

      <Pressable
        onPress={onPressRightIcon}
        style={{
          position: "absolute",
          right: 16,
          top: 0,
          height: 56,
          justifyContent: "center",
          width: 22
        }}
        hitSlop={10}
      >{ rightIcon }</Pressable>
    </View>
  );
}