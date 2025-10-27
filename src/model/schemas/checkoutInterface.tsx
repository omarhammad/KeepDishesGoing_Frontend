import {z} from "zod";

// --- Delivery Address ---
const DeliveryAddressSchema = z.object({
    street: z.string().min(1, {message: "Street is required"}),
    number: z.string().min(1, {message: "House Nr is required"}).refine(val => parseInt(val) > 0, {message: "Invalid House Nr"}),
    postalCode: z.string().min(1, {message: "Postal code is required"}),
    city: z.string().min(1, {message: "City is required"}),
    country: z.string().min(1, {message: "Country is required"}),
});

// --- Payment Info ---
const PaymentInfoSchema = z
    .object({
        method: z.string().min(1, {message: "Method is required"}),
        cardNumber: z
            .string()
            .min(1, {message: "Card number is required"})
            .refine(
                (val) =>
                    !val ||
                    /^(\d{4}[-\s]?){3}\d{4}$/.test(val.replace(/\s+/g, "")),
                {message: "Invalid card number format"}
            ),
        expiryDate: z
            .string()
            .min(1, {message: "expiry date is required"})
            .refine(
                (val) => !val || /^((0[1-9])|(1[0-2]))\/?([0-9]{2})$/.test(val),
                {message: "Invalid expiry date format (MM/YY)"}
            ),
        cvv: z
            .string()
            .min(1, {message: "cvv is required"})
            .refine((val) => !val || /^[0-9]{3,4}$/.test(val), {
                message: "Invalid CVV format",
            }),
    })
    .refine(
        (data) =>
            data.method === "CASH" ||
            (data.cardNumber && data.expiryDate && data.cvv),
        {
            message: "Card details are required for card payments",
            path: ["cardNumber"], // highlights the first missing field
        }
    );

// --- Main Checkout Schema ---
export const CheckoutSchema = z.object({
    firstName: z.string().min(1, {message: "First name is required"}),
    lastName: z.string().min(1, {message: "Last name is required"}),
    deliveryAddress: DeliveryAddressSchema,
    email: z
        .string()
        .min(1, {message: "Email is required"})
        .email({message: "Invalid email format"}),
    phoneNumber: z
        .string()
        .min(1, {message: "Phone number is required"})
        .regex(/^\+?[0-9\s\-()]+$/, {message: "Invalid phone number format"}),
    paymentInfo: PaymentInfoSchema,
});

// --- Types ---
export type CheckoutType = z.infer<typeof CheckoutSchema>;
export type checkoutInterface = CheckoutType;
