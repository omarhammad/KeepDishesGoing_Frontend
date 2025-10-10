import axios from "axios";
import type {Restaurant} from "../model/Restaurant.tsx";
import type {CreateRestaurantRequest} from "../model/requests/CreateRestaurantRequest.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";
import {getJwtTokenValue} from "./authService.tsx";
import type {ErrorResponseDTO} from "../model/responseDtos/ErrorResponseDTO.tsx";

export async function getRestaurantByOwnerId(ownerId: string) {

    try {
        const {data: restaurant} = await axios.get<Restaurant>(`/api/owners/${ownerId}/restaurant`)
        console.log(restaurant)
        return restaurant
    } catch {
        return null;
    }

}

export async function postRestaurant(request: CreateRestaurantRequest) {

    try {
        const access_token = getJwtTokenValue();
        const {data: response} = await axios.post<ResponseDTO>('/api/restaurants', request, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
            console.log(err.response.data)
            return err.response.data as ErrorResponseDTO;
        }
        return {
            apiPath: "/api/restaurants",
            errorCode: "INTERNAL_SERVER_ERROR",
            errorMessage: (err as Error).message ?? "Unknown error",
            errorTime: new Date().toISOString()
        } satisfies ErrorResponseDTO;
    }

}