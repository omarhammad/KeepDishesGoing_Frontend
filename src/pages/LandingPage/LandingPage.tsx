import {Box, Grid, Typography,} from "@mui/material";
import RestaurantCard from "./components/RestaurantCard";
import LandingPageFallback from "./components/LandingPageFallback.tsx";
import {useRestaurants} from "../../hooks/RestaurantsHooks.tsx";

function LandingPage() {

    const {isError, isLoading, refetch, restaurants} = useRestaurants()

    const handleOnRetry = () => {
        refetch();
    }

    return (
        <LandingPageFallback isLoading={isLoading} isError={isError} onRetry={handleOnRetry}>
            <Box
                sx={{
                    display: "flex",
                    bgcolor: "#181212",
                    height: "100vh",
                    px: 6,
                    py: 4,
                    gap: 5,
                }}
            >

                <Box
                    sx={{
                        flex: "1",
                        height: "100%",
                        pb: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color="white"
                        mb={4}
                        textAlign="center"
                    >
                        Explore Restaurants
                    </Typography>

                    <Grid
                        container
                        spacing={4}
                    >
                        {restaurants?.map((res) => (
                            // @ts-expect-error MUI Grid type mismatch
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4} // 3 per row on desktop
                                display="flex"
                                justifyContent="center"
                                width={"200px"}
                                key={res.id}
                            >
                                <RestaurantCard restaurant={res}/>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </LandingPageFallback>
    );
}

export default LandingPage;
