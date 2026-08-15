import { api } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export const useJoinEvent = () => {
  const mutation = useMutation({
    mutationFn: async (gameId: string) => {
      const response = await api.post("/games/join-game", {
        gameId,
      });

      return response.data.data;
    },
  });

  return {
    joinEvent: mutation.mutate,
    joinEventAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};