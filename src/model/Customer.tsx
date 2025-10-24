import type {Address} from "./Address.tsx";

export type Customer = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    deliveryAddress: Address
}