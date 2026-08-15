import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Game } from "../types/types";

interface RecommendedEventParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  sport?: string;
}

export const useRecommendedEvent = ({
  page = 1,
  limit = 10,
  search,
  date,
  sport,
}: RecommendedEventParams = {}) => {
  const query = useQuery({
    queryKey: [
      "recommended-games",
      { page, limit, search, date, sport },
    ],

    queryFn: async () => {
      const response = await api.get("/games/recommended-games", {
        params: {
          page,
          limit,
          search,
          date,
          sport,
        },
      });

      return response.data.data as Game[];
    },
    staleTime: 1000 * 60 * 2,
  });

  return {
    recommendedEvents: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};