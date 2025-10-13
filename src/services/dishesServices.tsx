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

