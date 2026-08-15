import { Text } from "@/components/ui/text";
import { Font } from "@/constants/utils";
import { SetStateAction, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

type IProps = {
  length?: number,
  otp: string,
  setOtp: React.Dispatch<SetStateAction<string>>
}

export default function OtpInput({ length = 6, otp, setOtp }: IProps) {
  const inputRef = useRef<TextInput>(null);
  const [error, setError] = useState<string>("");

  function handleCodeChange(value: string) {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, length);

    setOtp(sanitizedValue);

    if (error) {
      setError("");
    }
  }

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      className="mt-10"
    >
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row"
        }}
      >
          {Array.from({ length: length }).map((_, index) => {
            const digit = otp[index];
            const isActive =
              index === otp.length ||
              (otp.length === length &&
              index === length - 1);
            
            return (
              <View
                key={index}
                style={{
                  height: 64, width: "14.5%",
                  alignItems: "center",
                  justifyContent: 'center',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: error
                    ? "#DC2626"
                    : isActive || !!digit
                      ? "#178029"
                      : "#404040", // neutral-700

                  backgroundColor: error
                    ? "rgba(127, 29, 29, 0.3)"
                    : "#F5F5F5",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font.bold
                  }}
                >
                  {digit ?? ""}
                </Text>
              </View>
            );
          })}
      </View>

      <TextInput
        ref={inputRef}
        value={otp}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        caretHidden
        style={{
          position: "absolute",
          height: 4,
          width: 4,
          opacity: 0
        }}
      />
    </Pressable>
  );
}