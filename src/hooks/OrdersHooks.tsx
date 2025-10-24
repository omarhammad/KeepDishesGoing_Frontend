import {useQuery} from "@tanstack/react-query";
import type {Order} from "../model/Order.tsx";
import {getRestaurantOrders} from "../services/orderService.tsx";

export function useRestaurantOrders(restaurantId: string) {


    const {isError, isLoading, data: orders} = useQuery<Order[]>({
        queryKey: ["orders", restaurantId],
        queryFn: () => getRestaurantOrders(restaurantId),
        refetchInterval: 10000

    });

    return {isError, isLoading, orders}
}
