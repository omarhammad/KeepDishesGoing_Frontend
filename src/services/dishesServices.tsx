import axios from "axios";
import type {Dish} from "../model/Dish.tsx";
import {getJwtTokenValue} from "./authService.tsx";
import type {ErrorResponseDTO} from "../model/responseDtos/ErrorResponseDTO.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";


export async function getDishesOfRestaurant(restaurantId: string, state: 'draft' | 'live') {

    const {data: dishes} = await axios.get<Dish[]>(`/api/restaurants/${restaurantId}/dishes?state=${state}`);
    return dishes;

}


export async function getDishById(restaurantId: string, dishId: string, state: 'draft' | 'live') {

    const {data: dish} = await axios
        .get<Dish>(`/api/restaurants/${restaurantId}/dishes/${dishId}?state=${state}`);
    return dish
}

export async function postNewDishDraft(restaurantId: string, request: Dish) {
    const access_token = getJwtTokenValue();
    const {data} = await axios.post<ResponseDTO>(`/api/restaurants/${restaurantId}/dishes`, request,
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        }
    );

    return data;

}


export async function updateDishData(restaurantId: string, dishId: string, request: Dish): Promise<ResponseDTO> {


    const access_token = getJwtTokenValue();

    try {
        const {data} = await axios.patch<ResponseDTO>(
            `/api/restaurants/${restaurantId}/dishes/${dishId}`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const err = error.response.data as ErrorResponseDTO;
            throw new Error(err.errorMessage || "Unknown server error");
        }
        throw error;
    }
}


export async function publishDish(restaurantId: string, dishId: string, isPublished: boolean): Promise<ResponseDTO> {
    const access_token = getJwtTokenValue();
    const request = {isPublished: isPublished}
    try {
        const {data} = await axios.patch<ResponseDTO>(
            `/api/restaurants/${restaurantId}/dishes/${dishId}/published`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
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

export async function dishStockStatus(restaurantId: string, dishId: string, isInStock: boolean): Promise<ResponseDTO> {
    const access_token = getJwtTokenValue();
    const request = {isInStock: isInStock}
    try {
        const {data} = await axios.patch<ResponseDTO>(
            `/api/restaurants/${restaurantId}/dishes/${dishId}/stock`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
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


export async function publishAllPendingDishes(restaurantId: string): Promise<ResponseDTO> {
    const access_token = getJwtTokenValue();
    try {
        const {data} = await axios.post<ResponseDTO>(
            `/api/restaurants/${restaurantId}/dishes/publish-all`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
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


export async function schedulePublishForAllPendingDishes(restaurantId: string, scheduleTime: string): Promise<ResponseDTO> {
    const access_token = getJwtTokenValue();
    const request = {scheduleTime: scheduleTime};
    try {
        const {data} = await axios.post<ResponseDTO>(
            `/api/restaurants/${restaurantId}/dishes/schedule-publish`,
            request,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
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


