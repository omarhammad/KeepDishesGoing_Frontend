import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getUserId} from "../../services/authService.tsx";
import {Grid} from '@mui/material'
import {hasOwnerRestaurant} from "../../services/restaurantService.tsx";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader.tsx";
import AddDishCard from "./components/AddDishCard/AddDishCard.tsx";
import Toast from "../../components/Toast/Toast.tsx";
import {useRestaurantDashboard} from "../../hooks/RestaurantDashboardHooks.tsx";
import DishCard from "./components/DishCard/DishCard.tsx";
import type {Dish} from "../../model/Dish.tsx";
import OrdersView from "./components/OrdersView/OrdersView.tsx";
import RestaurantDashboardFallback from "./components/RestaurantDashboardFallback.tsx";

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

    const {
        isError,
        isLoading,
        restaurantRefetch,
        livesRefetch,
        draftsRefetch,
        restaurant,
        drafts,
        lives
    } = useRestaurantDashboard(userId!)


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

    const handleOnRetry = () => {
        restaurantRefetch()
        livesRefetch()
        draftsRefetch()
    };

    return (
        <RestaurantDashboardFallback isLoading={isLoading} isError={isError} onRetry={handleOnRetry}>
            {restaurant && <>
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
                        // @ts-expect-error MUI Grid type mismatch
                        <Grid key={dish.id} item xs={12} sm={6} md={4} lg={3}>
                            <DishCard dish={dish} restaurantId={restaurant.id} setToast={setToast} onEdit={() =>
                                handleEditDish(restaurant.id, dish.id)}/>
                        </Grid>
                    ))}
                    {/*@ts-expect-error MUI Grid type mismatch*/}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AddDishCard onAdd={() => handleAddDish(restaurant.id)}/>
                    </Grid>
                </Grid>
                <OrdersView restaurantId={restaurant.id}/>
                <Toast open={toast.open} message={toast.message} severity={toast.severity}
                       onClose={() => setToast(prev => ({...prev, open: false}))}/>
            </>}
        </RestaurantDashboardFallback>
    );

}

export default RestaurantDashboardPage;
