import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Game } from "../types/types";

export const useEvent = (eventId: string) => {
    const query = useQuery({
        queryKey: [
        "game",
        { eventId },
        ],

        queryFn: async () => {
        const response = await api.get(`/games/game`, {params: {eventId}});

        return response.data.data as Game;
        },
    });

    return {
        event: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};