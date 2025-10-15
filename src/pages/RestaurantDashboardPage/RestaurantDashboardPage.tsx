import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getUserId} from "../../services/authService.tsx";
import {Box, Grid} from '@mui/material'
import {hasOwnerRestaurant} from "../../services/restaurantService.tsx";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader.tsx";
import AddDishCard from "./components/AddDishCard/AddDishCard.tsx";
import Toast from "../../components/Toast/Toast.tsx";
import {useRestaurantDashboard} from "../../hooks/RestaurantDashboardHooks.tsx";
import DishCard from "./components/DishCard/DishCard.tsx";
import type {Dish} from "../../model/Dish.tsx";

export type DishWithMeta = Dish & {
    isDraft?: boolean;
    hasLiveVersion?: boolean;
};

export type ToastData = {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error"
}


function RestaurantDashboardPage() {

    // TODO
    //  1) EDIT DISH CASE - DONE
    //  2) UNPUBLISH/PUBLISH ONE DISH CASE - LOOK DISH CARD -DONE
    //  3) IN/OUT STOCK CASE - LOOK DISH CARD - DONE
    //  4) PUBLISH ALL NOW/SCHEDULE CASE - DONE
    //  5) ADD NEW DISH DRAFT -DONE
    //  6) DISH VIEW CASE
    //  7) MAKE THE MANUAL OPEN/CLOSE


    const [toast, setToast] = useState<ToastData>({
        open: false,
        message: "",
        severity: "success"
    });
    const navigate = useNavigate();
    const userId = getUserId();

    useEffect(() => {
        (async () => {
            try {
                const hasRestaurant = await hasOwnerRestaurant();
                if (!hasRestaurant) navigate("/owner/restaurants/add");
            } catch (err) {
                if (err instanceof Error) console.log(err.message);
                else console.log("UseEffect: Unknown Error!");
            }
        })();
    }, [navigate]);

    const {isError, isLoading, restaurant, drafts, lives} = useRestaurantDashboard(userId!)

    if (isError || !restaurant || !drafts || !lives) {
        return <Box>Error loading Restaurant Dashboard.</Box>;
    }

    if (isLoading) {
        return <Box>Loading Restaurant Dashboard...</Box>;
    }

    const visibleDishes: DishWithMeta[] = [
        ...drafts.map(draft => ({
            ...draft,
            isDraft: true,
            hasLiveVersion: lives.some(live => live.id === draft.id)
        })),

        ...lives
            .filter(live => !drafts.some(draft => draft.id === live.id))
            .map(live => ({
                ...live,
                isDraft: false,
                hasLiveVersion: false
            }))
    ].sort((a, b) => a.name.localeCompare(b.name));

    const allScheduledTimes = visibleDishes
        .map(d => d.scheduledTime)
        .filter(Boolean) as string[];

    const nextScheduledTime = allScheduledTimes.length
        ? new Date(
            Math.min(...allScheduledTimes.map(t => new Date(t).getTime()))
        ).toLocaleString()
        : null;

    const handleEditDish = (restaurantId: string, dishId: string) => {
        navigate(`/owner/restaurants/${restaurantId}/dishes/${dishId}/edit`);
    };

    const handleAddDish = (restaurantId: string) => {
        navigate(`/owner/restaurants/${restaurantId}/dishes/add`);
    };


    return (
        <Box
            sx={{
                textAlign: "left",
                width: "100%",
                maxWidth: "1600px",
                mx: "auto",
                px: {xs: 2, sm: 3, md: 4},
            }}
        >
            <DashboardHeader
                name={restaurant.name}
                imageUrl={restaurant.resPictureUrl}
                totalDishes={drafts.length}
                setToast={setToast}
                restaurantId={restaurant.id}
                nextScheduledTime={nextScheduledTime}
            />
            <Grid container spacing={2}>
                {visibleDishes.map((dish) => (
                    <Grid key={dish.id} item xs={12} sm={6} md={4} lg={3}>
                        <DishCard dish={dish} restaurantId={restaurant.id} setToast={setToast} onEdit={() =>
                            handleEditDish(restaurant.id, dish.id)}/>
                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AddDishCard onAdd={() => handleAddDish(restaurant.id)}/>
                </Grid>
            </Grid>
            <Toast open={toast.open} message={toast.message} severity={toast.severity}
                   onClose={() => setToast(prev => ({...prev, open: false}))}/>
        </Box>
    );

}

export default RestaurantDashboardPage;
