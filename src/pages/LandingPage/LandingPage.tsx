import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Slider, Typography,} from "@mui/material";
import {useState} from "react";
import RestaurantCard from "./components/RestaurantCard";
import LandingPageFallback from "./components/LandingPageFallback.tsx";
import {useRestaurants} from "../../hooks/RestaurantsHooks.tsx";

function LandingPage() {
    const [filters, setFilters] = useState({
        cuisine: "",
        price: [0, 50],
        distance: 10,
        deliveryTime: 30,
    });

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
                    height: "calc(100vh - 80px)",
                    overflow: "hidden",
                    px: 6,
                    py: 4,
                    gap: 5,
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        flex: "0 0 25%",
                        backgroundColor: "#fff",
                        borderRadius: 3,
                        p: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        height: "100%",
                        position: "sticky",
                        top: 80,
                        overflowY: "auto",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        textAlign="center"
                        mb={2}
                        color="#222"
                    >
                        Filters
                    </Typography>
                    <Divider sx={{mb: 2}}/>

                    <Typography variant="subtitle2" fontWeight={600} color="#444" gutterBottom>
                        Cuisine
                    </Typography>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>Cuisine</InputLabel>
                        <Select
                            label="Cuisine"
                            value={filters.cuisine}
                            onChange={(e) =>
                                setFilters((prev) => ({...prev, cuisine: e.target.value}))
                            }
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="ITALIAN">Italian</MenuItem>
                            <MenuItem value="JAPANESE">Japanese</MenuItem>
                            <MenuItem value="FRENCH">French</MenuItem>
                            <MenuItem value="MEXICAN">Mexican</MenuItem>
                            <MenuItem value="INDIAN">Indian</MenuItem>
                            <MenuItem value="CHINESE">Chinese</MenuItem>
                            <MenuItem value="AMERICAN">American</MenuItem>
                            <MenuItem value="VEGAN">Vegan</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2" fontWeight={600} color="#444">
                        Price Range (€)
                    </Typography>
                    <Slider
                        value={filters.price}
                        onChange={(_, val) =>
                            setFilters((prev) => ({...prev, price: val as number[]}))
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        sx={{mb: 4}}
                    />

                    <Typography variant="subtitle2" fontWeight={600} color="#444">
                        Max Distance (km)
                    </Typography>
                    <Slider
                        value={filters.distance}
                        onChange={(_, val) =>
                            setFilters((prev) => ({...prev, distance: val as number}))
                        }
                        valueLabelDisplay="auto"
                        min={1}
                        max={20}
                        sx={{mb: 4}}
                    />

                    <Typography variant="subtitle2" fontWeight={600} color="#444">
                        Max Delivery Time (min)
                    </Typography>
                    <Slider
                        value={filters.deliveryTime}
                        onChange={(_, val) =>
                            setFilters((prev) => ({
                                ...prev,
                                deliveryTime: val as number,
                            }))
                        }
                        valueLabelDisplay="auto"
                        min={10}
                        max={90}
                    />
                </Box>

                {/* Restaurant Grid */}
                <Box
                    sx={{
                        flex: "1",
                        overflowY: "auto",
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
