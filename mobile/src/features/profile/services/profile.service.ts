import { api } from "@/api/client";

export const getProfile = async () => {
  const res = await api.get("/me");
  return res.data;
};