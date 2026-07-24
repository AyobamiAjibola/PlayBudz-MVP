import { auth } from "@/config/firebase";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
   headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      await auth.authStateReady();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();

        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      "Something went wrong.";

    return Promise.reject(new Error(message));
  }
);