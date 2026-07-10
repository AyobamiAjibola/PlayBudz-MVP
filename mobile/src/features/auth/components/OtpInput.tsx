import { SetStateAction, useRef, useState } from "react";
import { TextInput, View } from "react-native";

type IProps = {
  length?: number,
  otp: string[],
  setOtp: React.Dispatch<SetStateAction<string[]>>
}

export default function OtpInput({ length = 6, otp, setOtp }: IProps) {
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    console.log(code);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6, 
      }}
    >
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputsRef.current[index] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          className="border border-gray-300 bg-white text-xl font-semibold text-black"
          style={{
            height: 54,
            width: 54,
            borderRadius: 12
          }}
        />
      ))}
    </View>
  );
}