import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Dish} from "../model/Dish.tsx";
import {getDishById, getDishesOfRestaurant, updateDishData} from "../services/dishesServices.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";

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


export function useDish(restaurantId: string, dishId: string, state: 'draft' | 'live', isEnabled: boolean) {
    const {isError, isLoading, data: dish, refetch} = useQuery<Dish>({
        queryKey: ['dish', restaurantId, dishId, state],
        queryFn: () => getDishById(restaurantId, dishId, state),
        enabled: isEnabled
    })

    return {
        isError,
        isLoading,
        dish,
        refetch
    }

}

export function useUpdateDish() {
    const queryClient = useQueryClient();

    const {
        mutateAsync: updateDishMutation,
        isPending,
        isError,
        error,
    } = useMutation<ResponseDTO, Error,
        { restaurantId: string; dishId: string; request: Dish }>({

        mutationFn: ({restaurantId, dishId, request}) =>
            updateDishData(restaurantId, dishId, request),

        onSuccess: async (data, {restaurantId, dishId}) => {
            if (!("errorCode" in data)) {
                await Promise.all([
                    queryClient.invalidateQueries({queryKey: ["dish", restaurantId, dishId, "draft"]}),
                    queryClient.invalidateQueries({queryKey: ["dishes", "draft", restaurantId]}),
                    queryClient.invalidateQueries({queryKey: ["dishes", "live", restaurantId]})
                ])
            }
        },
    });

    return {updateDishMutation, isPending, isError, error};
}
