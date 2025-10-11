import {useEffect, useState} from "react";
import {Alert, Box, Grid, Snackbar} from "@mui/material";
import {useNavigate} from "react-router";
import {getUserId} from "../services/authService.tsx";
import {hasOwnerRestaurant} from "../services/restaurantService.tsx";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader.tsx";
import AddDishCard from "../components/AddDishCard/AddDishCard.tsx";
import PublishDialog from "../components/PublishDialog/PublishDialog.tsx";
import {useRestaurantDashboard} from "../hooks/RestaurantDashboardHooks.tsx";
import DishCard from "../components/DishCard/DishCard.tsx";

export type DishWithMeta = Dish & {
    isDraft?: boolean;
    hasLiveVersion?: boolean;
};

function RestaurantDashboardPage() {

    const [publishOpen, setPublishOpen] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "info" }>({
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
    ];


    const handlePublishAll = () => setPublishOpen(true);

    const handleConfirmPublish = (mode: "now" | "schedule", time?: string) => {
        setPublishOpen(false);
        if (mode === "now") {
            setToast({open: true, severity: "success", message: "All dishes published now."});
        } else {
            setToast({open: true, severity: "info", message: `All dishes scheduled for ${time}.`});
        }
    };

    const handleEditDish = (id: string) => {
        navigate(`/owner/dishes/${id}/edit`);
    };

    const handleAddDish = () => {
        navigate("/owner/dishes/add");
    };


    return (
        <Box
            sx={{
                textAlign: "left",
                width: "100%",
                maxWidth: "1600px", // stretch wider
                mx: "auto",          // center horizontally
                px: {xs: 2, sm: 3, md: 4}, // a bit of breathing room on sides
            }}
        >
            <DashboardHeader
                name={restaurant.name}
                imageUrl={restaurant.resPictureUrl}
                totalDishes={drafts.length}/*TODO THE NUMBER OF DISHES DRAFTS*/
                onPublishAll={handlePublishAll}
            />

            <Grid container spacing={2}>

                {/*TODO Fill with dishes from backend*/}
                {visibleDishes.map((dish) => (
                    <Grid key={dish.id} item xs={12} sm={6} md={4} lg={3}>
                        <DishCard dish={dish} onEdit={handleEditDish}/>
                    </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AddDishCard onAdd={handleAddDish}/>
                </Grid>
            </Grid>

            <PublishDialog
                open={publishOpen}
                onClose={() => setPublishOpen(false)}
                onConfirm={handleConfirmPublish}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={2500}
                onClose={() => setToast((t) => ({...t, open: false}))}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    severity={toast.severity}
                    variant="filled"
                    onClose={() => setToast((t) => ({...t, open: false}))}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );

}

export default RestaurantDashboardPage;
