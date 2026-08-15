import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushTokenResult = {
  granted: boolean;
  token?: string;
};

export async function getPushToken(): Promise<PushTokenResult> {
  if (!Device.isDevice) {
    return { granted: false };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  let { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const permission = await Notifications.requestPermissionsAsync();
    status = permission.status;
  }

  if (status !== "granted") {
    return { granted: false };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error("Missing EAS projectId.");
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return {
    granted: true,
    token: token.data,
  };
}