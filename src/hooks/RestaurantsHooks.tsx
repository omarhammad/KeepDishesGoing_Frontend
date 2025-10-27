import {useQuery} from "@tanstack/react-query";
import {
    getAllRestaurants,
    getRestaurantById,
    getRestaurantByOwnerId,
    getRestaurantOpenStatus
} from "../services/restaurantService.tsx";
import type {Restaurant} from "../model/Restaurant.tsx";

export function useOwnerRestaurant(userId: string) {
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


export function useRestaurant(restaurantId: string) {
    const {isError, isLoading, refetch, data: restaurant} = useQuery<Restaurant>({
        queryKey: ['restaurant', restaurantId],
        queryFn: () => getRestaurantById(restaurantId),
    });
    return {
        isLoading,
        isError,
        refetch,
        restaurant,
    }
}

export function useRestaurants() {
    const {isError, isLoading, refetch, data: restaurants} = useQuery<Restaurant[]>({
        queryKey: ["restaurants"],
        queryFn: getAllRestaurants
    })


    return {
        isError,
        isLoading,
        refetch,
        restaurants

    }
}

export function useRestaurantOPenStatus(restaurateurId: string) {
    const {isError, isLoading, refetch, data: status} = useQuery<{ openStatus: boolean }>({
        queryKey: ["restaurantsStatus", restaurateurId],
        queryFn: () => getRestaurantOpenStatus(restaurateurId)
    })


    return {
        isError,
        isLoading,
        refetch,
        status

    }
}

