export type CheckoutRequest = {
    "firstName": string,
    "lastName": string,
    "deliveryAddress": {
        "street": string,
        "number": number,
        "postalCode": string,
        "city": string,
        "country": string
    },
    "email": string,
    "phoneNumber": string,
    "paymentInfo": {
        "method": string,
        "amount": number,
        "paymentToken": string
    }
}
