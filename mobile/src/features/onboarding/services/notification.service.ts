import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export type PushTokenResult = {
  granted: boolean;
  token?: string;
};

export async function getPushToken(): Promise<PushTokenResult> {
  if (!Device.isDevice) {
    return { granted: false };
  }

  let { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const permission =
      await Notifications.requestPermissionsAsync();

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