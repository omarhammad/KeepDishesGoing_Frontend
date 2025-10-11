import {useQuery} from "@tanstack/react-query";
import type {Dish} from "../model/Dish.tsx";
import {getDishesOfRestaurant} from "../services/dishesServices.tsx";

export function useDishes(state: 'draft' | 'live', restaurantId?: string) {
    const {isError, isLoading, data: dishes} = useQuery<Dish[]>({
        queryKey: ["dishes", state, restaurantId],
        queryFn: () => getDishesOfRestaurant(restaurantId!, state),
        enabled: !!restaurantId
    })

    return {
        isError,
        isLoading,
        dishes
    }
}