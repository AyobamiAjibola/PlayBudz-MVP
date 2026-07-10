import { Colors } from "@/constants/utils";
import { View } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="px-6" style={{marginTop: 15}}>
      <View
        style={{
            height: 8,
            width: "100%",
            overflow: "hidden",
            borderRadius: 9999,
            backgroundColor: "#e5e7eb"
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            backgroundColor: Colors.primary,
            height: "100%",
            borderRadius: 9999
          }}
        />
      </View>
    </View>
  );
}