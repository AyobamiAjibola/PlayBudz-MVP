import { create } from "zustand";
import * as ImagePicker from "expo-image-picker";

type Theme = "light" | "dark";

interface AppStore {
  theme: Theme;
  language: string;
  isLoading: boolean;

  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  setLoading: (loading: boolean) => void;

  profileImage: ImagePicker.ImagePickerAsset | null;
  setProfileImage: (
    image: ImagePicker.ImagePickerAsset | null
  ) => void;
  clearProfileImage: () => void;
}
// profileImageAsset, setProfileImageAsset
export const useAppStore = create<AppStore>((set) => ({
  theme: "light",
  language: "en",
  isLoading: false,
  profileImage: null,

  setTheme: (theme) => set({ theme }),

  setLanguage: (language) =>
    set({ language }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setProfileImage: (image) =>
    set({
      profileImage: image,
    }),

  clearProfileImage: () =>
    set({
      profileImage: null,
    }),

}));