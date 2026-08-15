import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Player } from "../types/types";

interface PlayersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const usePlayers = ({
  page = 1,
  limit = 10,
  search,
}: PlayersParams = {}) => {
  const query = useQuery({
    queryKey: [
      "find-players-like-you",
      { page, limit, search },
    ],

    queryFn: async () => {
      const response = await api.get("/users/find-players-like-you", {
        params: {
          page,
          limit,
          search,
        },
      });

      return response.data.data as Player[];
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    players: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};