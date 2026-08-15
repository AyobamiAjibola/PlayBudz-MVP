import { api } from "@/api/axios";
import { auth } from "@/config/firebase";
import { Interest, Location } from "@/features/home/types/types";
import { FirebaseError } from "firebase/app";
import { User, signOut as firebaseSignOut } from "firebase/auth";
import { create } from "zustand";

type LocationType = {
  id: string;
  longitude: number;
  latitude: number;
  name: string;
  userId: string;
}

type InterestType = {
  id: string;
  interest: string;
  skill_level: string;
  userId: string;
}

type ProfileType = {
  id: string;
  createdAt?: Date;
  email?: string;
  firebaseUid?: string;
  fullName?: string;
  dob?: string;
  gender?: string;
  biography?: string;
  image?: string;
  notificationEnabled?: boolean;
  pushToken?: string;
  password?: string;
  updatedAt?: Date;
  refreshToken?: string;
  provider?: string;
  registrationComplete?: boolean;
  location?: Location;
  interests?: Interest;
}

type AppUser = {
  auth: User;
  profile: ProfileType;
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
            interests: profile.interests,
            id: profile.id,
            dob: profile.dob,
            gender: profile.gender,
            biography: profile.biography,
            notificationEnabled: profile.notificationEnabled
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