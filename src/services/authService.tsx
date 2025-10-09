import axios from "axios";
import type {JwtDTO} from "../model/responseDtos/JwtDTO.tsx";
import type {RegisterOwnerRequest} from "../model/requests/RegisterOwnerRequest.tsx";

export async function postRegister(requestBody: RegisterOwnerRequest) {
    try {
        const {data: jwtDTO} = (await axios.post<JwtDTO>('/api/auth/register', requestBody))
        return jwtDTO;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const backendMsg = error.response?.data.errorMessage || "Registration failed";
            throw new Error(backendMsg)
        }
        throw new Error("Unexpected error occurred during registration");
    }

}