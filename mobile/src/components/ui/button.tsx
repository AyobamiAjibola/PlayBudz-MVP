import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text } from "./text";
import { Colors, FontSize } from "@/constants/utils";
import { ActivityIndicator } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textClassName?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  loaderColor?: string;
}

export function AppButton({
  title,
  disabled,
  textStyle,
  buttonStyle,
  isLoading,
  loaderColor="white",
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: disabled ? Colors.disabled : Colors.primary,
          height: 54,
          width: 250,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 24,
        },
        buttonStyle,
      ]}
    >
      {!isLoading 
        ? ( <Text
              style={[{ color: "white", fontSize: FontSize.default }, textStyle ]}
            >
              {title}
            </Text>
        ):(
          <ActivityIndicator size="small" color={loaderColor} />
        )}
    </TouchableOpacity>
  );
}