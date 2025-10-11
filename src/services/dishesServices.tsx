import axios from "axios";
import type {Dish} from "../model/Dish.tsx";


export async function getDishesOfRestaurant(restaurantId: string, state: 'draft' | 'live') {

    const {data: dishes} = await axios.get<Dish[]>(`/api/restaurants/${restaurantId}/dishes?state=${state}`);
    return dishes;

}