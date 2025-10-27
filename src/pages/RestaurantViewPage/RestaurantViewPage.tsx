import {Box, Typography} from "@mui/material";
import RestaurantHeader from "./components/RestaurantHeader";
import DishListItem from "./components/DishListItem";
import {useState} from "react";
import DishFilterBar from "./components/DishFilterBar.tsx";
import {useRestaurant} from "../../hooks/RestaurantsHooks.tsx";
import {useParams} from "react-router";
import RestaurantViewFallback from "./components/RestaurantViewFallback.tsx";
import {useDishes} from "../../hooks/DishesHooks.tsx";


export type DishFilter = { type: string | null; tags: string[]; sort: string }


export default function RestaurantViewPage() {

    const {restaurantId} = useParams();
    const [filters, setFilters] = useState<DishFilter>({type: null, tags: [], sort: "default"});
    const {
        isError: isRestaurantError,
        isLoading: isRestaurantLoading,
        refetch: refetchRestaurant,
        restaurant
    } = useRestaurant(restaurantId!)
    const {
        isError: isDishesError,
        isLoading: isDishesLoading,
        refetch: refetchDishes,
        dishes
    } = useDishes('live', restaurantId!);
    let filteredDishes
    if (dishes) {
        filteredDishes = dishes
            .filter((dish) =>
                (!filters.type || dish.dishType === filters.type) &&
                (filters.tags.length === 0 || filters.tags.every((t) => dish.foodTags.includes(t)))
            ).sort((a, b) => {
                switch (filters.sort) {
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
    }


    const handleOnRetry = () => {
        refetchRestaurant()
        refetchDishes();
    };
    return (
        <RestaurantViewFallback isLoading={isRestaurantLoading || isDishesLoading}
                                isError={isDishesError || isRestaurantError} onRetry={handleOnRetry}>
            {(filteredDishes && restaurant && dishes) &&
                <Box sx={{bgcolor: "#181212", minHeight: "100vh", color: "white"}}>
                    <RestaurantHeader restaurant={restaurant}/>

                    <Box sx={{px: 6, pt: 2}}>
                        <DishFilterBar
                            dishTypes={[...new Set(dishes.map((d) => d.dishType))]}
                            foodTags={[...new Set(dishes.flatMap((d) => d.foodTags))]}
                            onFilterChange={setFilters}
                        />
                    </Box>

                    <Box sx={{px: 6, pb: 5}}>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Explore Dishes
                        </Typography>
                        {filteredDishes.map((dish) => (
                            <DishListItem key={dish.id} dish={dish}/>
                        ))}
                    </Box>
                </Box>}
        </RestaurantViewFallback>
    );
}
