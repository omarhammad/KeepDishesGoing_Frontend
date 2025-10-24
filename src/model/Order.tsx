import type {Customer} from "./Customer.tsx";

export type Order = {
    id: string,
    rejectedMsg: string,
    declinedMsg: string,
    orderStatus: string,
    statusOccurredAt: string
    restaurantId: string,
    totalPrice: number,
    dishes: (string | undefined) []
    customer: Customer,

}