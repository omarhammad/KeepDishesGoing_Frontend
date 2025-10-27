import type {Order} from "../model/Order.tsx";
import axios from "axios";
import {getJwtTokenValue} from "./authService.tsx";
import type {ErrorResponseDTO} from "../model/responseDtos/ErrorResponseDTO.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";
import type {CreateOrderRequest} from "../model/requests/CreateOrderRequest.tsx";
import type {OrderIdDTO} from "../model/responseDtos/OrderIdDTO.tsx";
import type {CheckoutRequest} from "../model/requests/CheckoutRequest.tsx";

export async function getRestaurantOrders(restaurantId: string) {

    const {data: orders} = await axios.get<Order[]>(`/api/orders?resId=${restaurantId}`)
    return orders;

}

export async function getOrderbyId(orderId: string) {

    const {data: order} = await axios.get<Order>(`/api/orders/${orderId}`)
    return order;

}

export async function createOrder(request: CreateOrderRequest) {

    try {
        const {data: orderId} = await axios.post<OrderIdDTO>('/api/orders', request);

        return orderId;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }
}


export async function checkout(orderId: string, request: CheckoutRequest) {

    try {
        const {data: responseDto} = await axios.post<ResponseDTO>(
            `/api/orders/${orderId}/checkout`,
            request
        );
        return responseDto
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }
}


export async function rejectOrder(orderId: string, reason: string, restaurantId: string) {


    const access_token = getJwtTokenValue();
    try {
        const {data} = await axios.post<ResponseDTO>(`/api/restaurants/${restaurantId}/reject-order`,
            {"orderId": orderId, "reason": reason},
            {
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            }
        )

        return data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }


}


export async function acceptOrder(orderId: string, restaurantId: string) {


    const access_token = getJwtTokenValue();
    try {
        const {data} = await axios.post<ResponseDTO>(`/api/restaurants/${restaurantId}/accept-order`,
            {"orderId": orderId},
            {
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            }
        )

        return data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }


}


export async function markOrderReady(orderId: string, restaurantId: string) {


    const access_token = getJwtTokenValue();
    try {
        const {data} = await axios.post<ResponseDTO>(`/api/restaurants/${restaurantId}/ready-order`,
            {"orderId": orderId},
            {
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            }
        )

        return data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }


}