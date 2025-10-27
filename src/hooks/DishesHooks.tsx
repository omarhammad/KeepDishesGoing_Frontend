import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Dish} from "../model/Dish.tsx";
import {
    dishStockStatus,
    getDishById,
    getDishesOfRestaurant,
    postNewDishDraft,
    publishAllPendingDishes,
    publishDish,
    schedulePublishForAllPendingDishes,
    updateDishData
} from "../services/dishesServices.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";


export function useDishes(state: 'draft' | 'live', restaurantId?: string) {
    const {isError, isLoading, refetch, data: dishes} = useQuery<Dish[]>({
        queryKey: ["dishes", state, restaurantId],
        queryFn: () => getDishesOfRestaurant(restaurantId!, state),
        enabled: !!restaurantId
    })

    return {
        isError,
        isLoading,
        refetch,
        dishes
    }
}

export function useDish(restaurantId: string, dishId: string, state: 'draft' | 'live', isEnabled: boolean) {
    const {isError, isLoading, data: dish, refetch} = useQuery<Dish>({
        queryKey: ['dish', restaurantId, dishId, state],
        queryFn: () => getDishById(restaurantId, dishId, state),
        retry: 1,
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

export function usePublishDish() {
    const queryClient = useQueryClient();

    const {isError, isPending, error, mutate: publishDishMutation} = useMutation<ResponseDTO, Error, {
        restaurantId: string,
        dishId: string,
        isPublished: boolean
    }>({
        mutationFn: ({restaurantId, dishId, isPublished}) =>
            publishDish(restaurantId, dishId, isPublished),
        onSuccess: async (data, {restaurantId}) => {
            if (!("errorCode" in data))
                await Promise.all([
                        queryClient.invalidateQueries({queryKey: ["dishes", "draft", restaurantId]}),
                        queryClient.invalidateQueries({queryKey: ["dishes", "live", restaurantId]})
                    ]
                )
        }


    })

    return {isError, isPending, error, publishDishMutation}
}

export function useDishStockStatus() {
    const queryClient = useQueryClient();

    const {
        isError, isPending, error, mutate: dishStockStatusMutation
    } = useMutation<ResponseDTO, Error, {
        restaurantId: string,
        dishId: string,
        isStock: boolean
    }>({
        mutationFn: ({restaurantId, dishId, isStock}) =>
            dishStockStatus(restaurantId, dishId, isStock),
        onSuccess: async (_data, {restaurantId}) => {
            await Promise.all([
                    queryClient.invalidateQueries({queryKey: ["dishes", "draft", restaurantId]}),
                    queryClient.invalidateQueries({queryKey: ["dishes", "live", restaurantId]})
                ]
            )
        }


    })

    return {isError, isPending, error, dishStockStatusMutation}
}

export function usePublishAllPendingDishes() {
    const queryClient = useQueryClient();

    const {
        isError,
        isPending,
        error,
        mutate: publishAllPendingDishesMutation,
    } = useMutation<ResponseDTO, Error, { restaurantId: string }>({
        mutationFn: ({restaurantId}) => publishAllPendingDishes(restaurantId),
        onSuccess: async (_data, {restaurantId}) => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["dishes", "draft", restaurantId]}),
                queryClient.invalidateQueries({queryKey: ["dishes", "live", restaurantId]}),
            ]);
        },
    });

    return {isError, isPending, error, publishAllPendingDishesMutation};
}

export function useSchedulePublishForAllPendingDishes() {
    const queryClient = useQueryClient();

    const {
        isError,
        isPending,
        error,
        mutate: schedulePublishForAllPendingDishesMutation,
    } = useMutation<ResponseDTO, Error, { restaurantId: string, scheduleTime: string }>({
        mutationFn: ({restaurantId, scheduleTime}) =>
            schedulePublishForAllPendingDishes(restaurantId, scheduleTime),
        onSuccess: async (_data, {restaurantId}) => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["dishes", "draft", restaurantId]}),
                queryClient.invalidateQueries({queryKey: ["dishes", "live", restaurantId]}),
            ]);
        },
    });

    return {isError, isPending, error, schedulePublishForAllPendingDishesMutation};
}

export function usePostNewDishDraft() {
    const queryClient = useQueryClient();
    const {isError, isPending, error, mutate: postNewDishDraftMutation} = useMutation<
        ResponseDTO,
        Error,
        { restaurantId: string, request: Dish }
    >({
        mutationFn: ({restaurantId, request}) => postNewDishDraft(restaurantId, request),
        onSuccess: async (_data, {restaurantId}) =>
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["dishes", 'draft', restaurantId]}),
                queryClient.invalidateQueries({queryKey: ["dishes", 'live', restaurantId]})
            ])
    });

    return {isError, isPending, error, postNewDishDraftMutation}
}