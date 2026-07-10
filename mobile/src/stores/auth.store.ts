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

  refreshUser: () => Promise<void>;
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

  refreshUser: async () => {
    try {
      set({ isLoading: true });

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        return;
      }

      const response = await api.get("/auth/me");
      const user = response.data.data
      set({
        user: {
          auth: firebaseUser,
          profile: {
            registrationComplete: user.registrationComplete,
            fullName: user.fullName,
            image: user.image,
            location: user.location,
          }
        },
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({ error: error as Error });
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