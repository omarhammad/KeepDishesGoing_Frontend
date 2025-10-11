import {useQuery} from "@tanstack/react-query";
import {getRestaurantByOwnerId} from "../services/restaurantService.tsx";
import type {Restaurant} from "../model/Restaurant.tsx";

export default function useRestaurant(userId: string) {
    const {isError, isLoading, data: restaurant} = useQuery<Restaurant>({
        queryKey: ['restaurant', userId],
        queryFn: () => getRestaurantByOwnerId(userId),
    });
    return {
        isLoading,
        isError,
        restaurant,
    }
}