import { TextInput, TextInputProps, View } from "react-native";

interface AppTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function AppTextInput({
  style,
  secureTextEntry,
  leftIcon,
  rightIcon,
  ...props
}: AppTextInputProps) {

  const isPasswordField = secureTextEntry === true;

  return (
    <View className="relative">
      { leftIcon }

      <TextInput
        {...props}
        secureTextEntry={isPasswordField}
        className="h-14 rounded-xl border border-gray-300 bg-white px-4 pr-12 text-base text-black"
        style={style}
      />

      { rightIcon }
    </View>
  );
}