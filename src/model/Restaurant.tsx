import type {Address} from "./Address.tsx";
import type {OpeningHours} from "./OpeningHours.tsx";
import type {Owner} from "./Owner.tsx";

export type Restaurant = {
    id: string,
    name: string,
    email: string,
    address: Address,
    resPictureUrl: string,
    dayOpeningHours: Record<string, OpeningHours>,
    cuisine: string,
    defaultPrepTime: number,
    owner: Owner,
    hasScheduledPublish?: boolean
}