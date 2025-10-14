import axios from "axios";
import type {Restaurant} from "../model/Restaurant.tsx";
import type {CreateRestaurantRequest} from "../model/requests/CreateRestaurantRequest.tsx";
import type {ResponseDTO} from "../model/responseDtos/ResponseDTO.tsx";
import {getJwtTokenValue, getUserId} from "./authService.tsx";
import type {ErrorResponseDTO} from "../model/responseDtos/ErrorResponseDTO.tsx";

export async function getRestaurantByOwnerId(ownerId: string) {
    const {data: restaurant} = await axios.get<Restaurant>(`/api/owners/${ownerId}/restaurant`);
    console.log(restaurant)
    return restaurant


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
        return errorHandler(err)
    }

}


export async function hasOwnerRestaurant(): Promise<boolean> {
    const userId = getUserId();

    try {
        await axios.get<Restaurant>(`/api/owners/${userId}/restaurant`);
        return true;

    } catch (error) {
        const err = errorHandler(error);

        if (err.errorCode === "NOT_FOUND") {
            return false;
        }
        throw new Error(err.errorMessage ?? "Unknown server error");
    }
}

function errorHandler(err: unknown): ErrorResponseDTO {
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
