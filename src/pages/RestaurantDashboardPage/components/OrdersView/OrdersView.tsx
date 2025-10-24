import {Box, Grid, Typography} from "@mui/material";

import OrderCard from "../OrderCard/OrderCard.tsx";
import {useRestaurantOrders} from "../../../../hooks/OrdersHooks.tsx";
import OrderViewFallback from "./OrderViewFallback.tsx";
import {useDishes} from "../../../../hooks/DishesHooks.tsx";

interface OrdersViewProps {
    restaurantId: string;
}

function OrdersView({restaurantId}: OrdersViewProps) {
    const {orders, isError: isErrorOrders, isLoading: isLoadingOrders} = useRestaurantOrders(restaurantId);
    const {dishes, isError: isErrorDishes, isLoading: isLoadingDishes} = useDishes('live', restaurantId)


    return (
        <OrderViewFallback isError={isErrorOrders || isErrorDishes} isLoading={isLoadingOrders || isLoadingDishes}
                           isEmpty={orders?.length === 0}>
            {orders && <Box sx={{width: "100%", py: 5}}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={4}
                    color="white"
                    sx={{letterSpacing: "0.5px"}}
                >
                    Incoming Orders
                </Typography>

                <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
                    {orders.map((order) => (
                        // @ts-expect-error MUI Grid type mismatch
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={order.id}
                            sx={{display: "flex", width: "345px"}}
                        >
                            <OrderCard restaurantDishes={dishes!} order={order}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>}
        </OrderViewFallback>
    );
}

export default OrdersView;
