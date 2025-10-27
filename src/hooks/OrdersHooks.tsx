import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Order} from "../model/Order.tsx";
import {checkout, createOrder, getOrderbyId, getRestaurantOrders} from "../services/orderService.tsx";
import type {OrderIdDTO} from "../model/responseDtos/OrderIdDTO.tsx";
import type {CreateOrderRequest} from "../model/requests/CreateOrderRequest.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";
import type {CheckoutRequest} from "../model/requests/CheckoutRequest.tsx";

export function useRestaurantOrders(restaurantId: string) {


    const {isError, isLoading, data: orders} = useQuery<Order[]>({
        queryKey: ["orders", restaurantId],
        queryFn: () => getRestaurantOrders(restaurantId),
        refetchInterval: 1000
    });

    return {isError, isLoading, orders}
}

export function useOrder(orderId: string) {

    const {isError, isLoading, refetch, data: order} = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: () => getOrderbyId(orderId),
        refetchInterval: 3000
    })

    return {isError, isLoading, refetch, order}
}

export function useCreateNewOrder() {

    const queryClient = useQueryClient();
    const {isPending, isError, error, data: orderIdDto, mutate: createOrderMutation} = useMutation<
        OrderIdDTO,
        Error,
        { request: CreateOrderRequest }>
    ({
        mutationFn: ({request}) => createOrder(request),
        onSuccess: async (_data) =>
            await queryClient.invalidateQueries({queryKey: ['order', _data.orderId]})


    })

    return {isPending, isError, error, orderIdDto, createOrderMutation}
}

export function useCheckout() {

    const queryClient = useQueryClient();
    const {isPending, isError, error, data: orderIdDto, mutate: checkoutMutation} = useMutation<
        ResponseDTO,
        Error,
        { orderId: string, request: CheckoutRequest }>
    ({
        mutationFn: ({orderId, request}) => checkout(orderId, request),
        onSuccess: async (_data, {orderId}) =>
            await queryClient.invalidateQueries({queryKey: ['order', orderId]})


    })

    return {isPending, isError, error, orderIdDto, checkoutMutation}
}

