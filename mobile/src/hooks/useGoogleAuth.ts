import { auth } from "@/config/firebase";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  exchangeCodeAsync,
  makeRedirectUri,
} from "expo-auth-session";
import { useRef } from "react";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
  scheme: "com.mobalabs.gameon",
});

export function useGoogleAuth() {
  const [request, , promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri,
  });

  const signingInRef = useRef(false);

  const signInWithGoogle = async () => {
    if (signingInRef.current) return null;

    signingInRef.current = true;

    try {
      const result = await promptAsync();

      if (result.type !== "success") {
        return null;
      }

      const code = result.params?.code;

      if (!code || !request?.codeVerifier) {
        throw new Error("Google sign in failed. No authorization code.");
      }

      const tokenResult = await exchangeCodeAsync(
        {
          clientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        {
          tokenEndpoint: "https://oauth2.googleapis.com/token",
        }
      );

      const idToken = tokenResult.idToken;
      const accessToken = tokenResult.accessToken;

      if (!idToken && !accessToken) {
        console.log("Token result:", tokenResult);
        throw new Error("Google sign in failed. No token returned.");
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      return signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Google sign in error:", error);
      return null;
    } finally {
      signingInRef.current = false;
    }
  };

  return {
    request,
    signInWithGoogle,
  };
}