import * as AuthSession from "expo-auth-session";
import { clientId, discovery, redirectUri } from "@/features/auth/auth.config";

export function useAzureAuth() {
  return AuthSession.useAuthRequest(
    {
      clientId,
      scopes: [
        "openid",
        "profile",
        "email",
        "offline_access",
      ],
      redirectUri,
    },
    discovery
  );
}