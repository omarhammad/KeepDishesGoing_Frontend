import {z} from "zod";

const OpeningHoursSchema = z.object({
    open: z.string().min(1, {message: "Open time required"}),
    close: z.string().min(1, {message: "Close time required"}),
});

export const newRestaurantSchema = z.object({
    name: z.string()
        .min(1, {message: "Restaurant name is required"}),
    email: z.string()
        .min(1, {message: "Email name is required"})
        .email({message: "Invalid email format"}),
    cuisine: z.preprocess(
        (val) => (val === undefined ? "" : String(val)),
        z.string().min(1, "Cuisine is required")
    ),
    defaultPrepTime: z.preprocess(
        (val) => (val === "" ? 0 : Number(val)),
        z.number().min(10, {message: "Preparation time must be at least 10 minutes"})
    ),
    pictureUrl: z.string()
        .min(1, {message: "Url Picture is required"})
        .url({message: "Picture must be provided as URL"}),
    street: z.string()
        .min(1, {message: "Street is required"}),
    number: z.string()
        .min(1, {message: "Number is required"}),
    city: z.string()
        .min(1, {message: "City is required"}),
    postalCode: z.string()
        .min(1, {message: "Postal code is required"}),
    country: z.string()
        .min(1, {message: "Country is required"}),
    dayOpeningHoursMap: z.object({
        MONDAY: OpeningHoursSchema,
        TUESDAY: OpeningHoursSchema,
        WEDNESDAY: OpeningHoursSchema,
        THURSDAY: OpeningHoursSchema,
        FRIDAY: OpeningHoursSchema,
        SATURDAY: OpeningHoursSchema,
        SUNDAY: OpeningHoursSchema,
    }),

});


export type newRestaurantType = z.infer<typeof newRestaurantSchema>;
export type newRestaurantInterface = newRestaurantType
