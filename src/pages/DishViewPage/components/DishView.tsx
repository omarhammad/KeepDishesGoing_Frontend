import {Box, Chip, Divider, Stack, Typography,} from "@mui/material";
import {Cancel, CheckCircle, LocalOffer, Restaurant,} from "@mui/icons-material";

import type {Dish} from "../../../model/Dish.tsx";

interface DishViewProps {
    dish: Dish
}

function DishView({dish}: DishViewProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: {xs: 4, sm: 6},
                backgroundColor: "transparent",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {xs: "column", md: "row"},
                    backgroundColor: "#fafafa",
                    borderRadius: "20px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    width: "70%",
                    maxWidth: "1000px",
                    minHeight: {md: "300px"},
                }}
            >
                {/* Left: Image */}
                <Box
                    sx={{
                        flex: {xs: "0 0 70%", md: "0 0 40%"},
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    <Box
                        component="img"
                        src={dish.pictureUrl}
                        alt={dish.name}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRight: {md: "1px solid #eee"},
                        }}
                    />
                </Box>

                {/* Right: Details */}
                <Box
                    sx={{
                        flex: {xs: "0 0 100%", md: "0 0 60%"},
                        p: {xs: 4, sm: 6},
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {/* Title + Stock */}
                    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                fontSize: {xs: "1.5rem", md: "1.5rem"},
                                color: "#222",
                            }}
                        >
                            {dish.name}
                        </Typography>
                        <Chip
                            label={dish.isInStock ? "IN STOCK" : "OUT OF STOCK"}
                            color={dish.isInStock ? "success" : "error"}
                            icon={dish.isInStock ? <CheckCircle/> : <Cancel/>}
                            size="small"
                            sx={{
                                fontSize: "0.85rem",
                                height: 26,
                                borderRadius: "6px",
                                backgroundColor: dish.isInStock ? "#e6f4ea" : "#fdecea",
                                color: dish.isInStock ? "#1e4620" : "#b71c1c",
                                "& .MuiChip-icon": {
                                    color: dish.isInStock ? "#2e7d32" : "#d32f2f",
                                },
                            }}
                        />
                    </Box>

                    {/* Tags */}
                    <Stack direction="row" flexWrap="wrap" spacing={1.2} mt={2}>
                        <Chip
                            icon={<Restaurant sx={{fontSize: "1rem"}}/>}
                            label={dish.dishType}
                            variant="outlined"
                            sx={{
                                fontSize: "0.85rem",
                                px: 1,
                                borderRadius: "16px",
                            }}
                        />
                        {dish.foodTags.map((tag) => (
                            <Chip
                                key={tag}
                                icon={<LocalOffer sx={{fontSize: "1rem"}}/>}
                                label={tag}
                                variant="outlined"
                                color="primary"
                                sx={{
                                    fontSize: "0.85rem",
                                    px: 1,
                                    borderRadius: "16px",
                                }}
                            />
                        ))}
                    </Stack>

                    <Divider sx={{my: 3}}/>

                    {/* Description */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        mb={2.5}
                        sx={{fontSize: "1rem", lineHeight: 1.7}}
                    >
                        {dish.description}
                    </Typography>

                    {/* Price */}
                    <Typography
                        variant="h3"
                        color="primary"
                        fontWeight="bold"
                        mb={3}
                        sx={{
                            fontSize: "2rem",
                            letterSpacing: "0.5px",
                        }}
                    >
                        ${dish.price.toFixed(2)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default DishView;