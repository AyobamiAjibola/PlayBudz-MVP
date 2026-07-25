import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Href } from "expo-router";
import { getSecureItem } from "@/components/SecureStore";

export default function OnboardingCheckScreen() {
  const [route, setRoute] = useState<Href | null>(null);

  useEffect(() => {
    let mounted = true;

    const resolveStep = async () => {
      const step = await getSecureItem("onboardingStep");

      if (!mounted) return;

      switch (step) {
        case "2":
          setRoute("/onboarding-second");
          break;

        case "3":
          setRoute("/onboarding-third");
          break;

        case "1":
        default:
          setRoute("/onboarding-first");
      }
    };

    void resolveStep();

    return () => {
      mounted = false;
    };
  }, []);

  if (!route) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={route} />;
}