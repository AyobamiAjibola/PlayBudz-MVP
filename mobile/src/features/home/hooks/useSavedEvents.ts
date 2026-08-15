import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Game } from "../types/types";

interface EventParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useSavedEvent = ({
  page = 1,
  limit = 10,
  search,
}: EventParams = {}) => {
    const query = useQuery({
        queryKey: [
        "all",
        { page, limit, search },
        ],

        queryFn: async () => {
        const response = await api.get("/games/saved-games", {
            params: {
            page,
            limit,
            search,
            },
        });
   
        return response.data.data as Game[];
        },
        //staleTime: 1000 * 60 * 2, // Dont consider the data stale for 2min
        //gcTime: // Keep unused cached data in memory for 30 minutes
    });

    return {
        events: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};