import * as AppleAuthentication from "expo-apple-authentication";
import { randomUUID } from "expo-crypto";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/config/firebase";

export function useAppleAuth() {
  const signInWithApple = async () => {
    const rawNonce = randomUUID();

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: rawNonce,
    });

    if (!credential.identityToken) {
      throw new Error("Apple sign in failed. No identity token returned.");
    }

    const provider = new OAuthProvider("apple.com");

    const firebaseCredential = provider.credential({
      idToken: credential.identityToken,
      rawNonce,
    });

    return signInWithCredential(auth, firebaseCredential);
  };

  return {
    signInWithApple,
  };
}