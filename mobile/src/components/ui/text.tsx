import { FontSize } from "@/constants/utils";
import { Text as RNText, TextProps } from "react-native";

interface Props extends TextProps {
  className?: string;
}

export function Text({ className, style, ...props }: Props) {
  return (
    <RNText
      {...props}
      className={className}
      style={[
        { fontFamily: "RethinkSans", fontSize: FontSize.default },
        style,
      ]}
    />
  );
}