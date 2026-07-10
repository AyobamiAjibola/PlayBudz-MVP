import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
export * from "@/features/auth/auth.config";

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};


export const logout = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const signInWithApple = async () => {
  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!appleCredential.identityToken) {
    throw new Error("Apple sign in failed");
  }

  const provider = new OAuthProvider("apple.com");

  const credential = provider.credential({
    idToken: appleCredential.identityToken,
  });

  return signInWithCredential(auth, credential);
};