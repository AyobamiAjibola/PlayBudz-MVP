import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Sport } from "../types/types";

export const useFetchSports = () => {
    const query = useQuery({
        queryKey: ["sports"],

        queryFn: async () => {
        const response = await api.get(`/games/sports`);

        return response.data.data as Sport[];
        },
    });

    const sports = query.data ?? [];

    const sportOptions = sports.map((sport: Sport) => ({
        label: sport.sport,
        value: sport.sport,
    }));

    const sportStr = sports.map(s => s.sport.split(" ")[1])

    return {
        sports,
        sportOptions,
        sportStr,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};