import {useDishes} from "./DishesHooks.tsx";
import useRestaurant from "./RestaurantsHooks.tsx";

export function useRestaurantDashboard(userId: string) {


    const restaurantQuery = useRestaurant(userId!);
    const restaurant = restaurantQuery.restaurant;

    const draftsQuery = useDishes("draft", restaurant?.id);
    const liveQuery = useDishes("live", restaurant?.id);

    const isLoading = restaurantQuery.isLoading || liveQuery.isLoading || draftsQuery.isLoading;
    const isError = restaurantQuery.isError || liveQuery.isError || draftsQuery.isError;

    const drafts = draftsQuery.dishes ?? [];
    const lives = liveQuery.dishes ?? [];


    return {
        isError,
        isLoading,
        restaurant,
        drafts,
        lives
    }

}