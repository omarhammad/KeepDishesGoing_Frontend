import type {Address} from "../Address.tsx";
import type {OpeningHours} from "../OpeningHours.tsx";

export type CreateRestaurantRequest = {
    name: string,
    email: string,
    address: Address,
    resPictureUrl: string,
    dayOpeningHoursMap: Record<string, OpeningHours>,
    cuisine: string,
    defaultPrepTime: number
}