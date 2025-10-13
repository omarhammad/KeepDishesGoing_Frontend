/*
name: string,
dishType: string,
foodTags: string[],
description: string,
price: number,
pictureUrl: string,
isInStock: boolean*/
import {z} from "zod";

export const editDishSchema = z.object({
    name: z.string().min(1, {message: "Dish name is required"}),
    dishType: z.string()
        .min(1, {message: "Dish type is required"}),
    foodTags: z.array(z.string())
        .min(1, {message: "Food tags is required"}),
    description: z.string()
        .min(1, {message: "Description is required"}),
    price: z.string({message: "price is required"})
        .min(1, {message: "price is required"})
        .refine(value => parseFloat(value) > 0, {message: "Price should be greater than zero"}),
    pictureUrl: z.string()
});

export type editDishType = z.infer<typeof editDishSchema>;

export interface editDishInterface extends editDishType {

}