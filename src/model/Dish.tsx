export type  Dish = {
    id: string,
    name: string,
    dishType: string,
    foodTags: string[],
    description: string,
    price: number,
    pictureUrl: string,
    isInStock?: boolean
}