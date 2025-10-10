import axios from "axios";
import type {JwtDTO} from "../model/responseDtos/JwtDTO.tsx";
import type {RegisterOwnerRequest} from "../model/requests/RegisterOwnerRequest.tsx";
import type {LoginOwnerRequest} from "../model/requests/LoginOwnerRequest.tsx";

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

export async function postLogin(requestBody: LoginOwnerRequest) {
    try {
        const {data: jwtDTO} = (await axios.post<JwtDTO>('/api/auth/login', requestBody))
        return jwtDTO;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const backendMsg = error.response?.data.errorMessage || "Login failed";
            throw new Error(backendMsg)
        }
        throw new Error("Unexpected error occurred during login");
    }

}


export function saveJwtData(jwtDTO: JwtDTO) {

    const expiresIn = new Date().getTime() + jwtDTO.expiresIn * 1000
    const jwtToken = {value: jwtDTO.accessToken, expiry: expiresIn}
    localStorage.setItem("accessToken", JSON.stringify(jwtToken));
    localStorage.setItem("userId", jwtDTO.userId)
    localStorage.setItem("username", jwtDTO.username)
}

export function getJwtTokenValue(): string | null {

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;

    try {
        const accessTokenJson = JSON.parse(accessToken);


        if (new Date().getTime() > accessTokenJson.expiry) {
            clearAllTokenData()
            return null;
        }

        return accessTokenJson.value;
    } catch {
        clearAllTokenData()
        return null;
    }
}

export function getUserId(): string | null {
    return localStorage.getItem("userId")
}

export function getUsername(): string | null {
    return localStorage.getItem("username")
}

export function clearAllTokenData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
}
