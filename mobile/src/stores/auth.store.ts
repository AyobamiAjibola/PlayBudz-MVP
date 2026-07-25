import { api } from "@/api/axios";
import { auth } from "@/config/firebase";
import { FirebaseError } from "firebase/app";
import { User, signOut as firebaseSignOut } from "firebase/auth";
import { create } from "zustand";

type AppUser = {
  auth: User;
  profile: {
    registrationComplete: boolean;
    fullName?: string;
    image?: string;
    location?: string;
  };
};

type AuthState = {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error:  FirebaseError | Error | null;

  setUser: (user: AppUser | null) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: FirebaseError | Error | null) => void;

  refreshUser: (firebaseUser?: User) => Promise<void>;
  signOut: () => Promise<void>;

};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setIsLoading: (value) => set({ isLoading: value }),

  setError: (error) => set({ error }),

  refreshUser: async (providedFirebaseUser) => {
    try {
      set({ isLoading: true, error: null });

      const firebaseUser = providedFirebaseUser ?? auth.currentUser;

      if (!firebaseUser) {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        return;
      }

      const response = await api.get("/auth/me");
      const profile = response.data.data;

      set({
        user: {
          auth: firebaseUser,
          profile: {
            registrationComplete: profile.registrationComplete === true,
            fullName: profile.fullName,
            image: profile.image,
            location: profile.location,
          }
        },
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error("Unable to load user profile");
      
      set({
        user: null,
        isAuthenticated: false,
        error: normalizedError,
      });

      throw normalizedError;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);

    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

}));