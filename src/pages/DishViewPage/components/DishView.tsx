import {Box, Button, Chip, Divider, IconButton, Stack, TextField, Typography,} from "@mui/material";
import {Add, Cancel, CheckCircle, LocalOffer, Remove, Restaurant,} from "@mui/icons-material";

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
                    width: "95%",
                    maxWidth: "1250px",
                    minHeight: {md: "600px"},
                }}
            >
                {/* Left: Image */}
                <Box
                    sx={{
                        flex: {xs: "0 0 100%", md: "0 0 40%"},
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
                                fontSize: {xs: "1.8rem", md: "2.3rem"},
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
                        sx={{fontSize: "1.15rem", lineHeight: 1.7}}
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
                            fontSize: "2.4rem",
                            letterSpacing: "0.5px",
                        }}
                    >
                        ${dish.price.toFixed(2)}
                    </Typography>

                    {/* Quantity + Button */}
                    <Stack direction="row" alignItems="center" spacing={2.5}>
                        <Typography
                            variant="h6"
                            fontWeight={500}
                            sx={{fontSize: "1.1rem", color: "#333"}}
                        >
                            Quantity:
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                color="primary"
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    width: 42,
                                    height: 42,
                                }}
                            >
                                <Remove/>
                            </IconButton>
                            <TextField
                                value="1"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    style: {
                                        textAlign: "center",
                                        width: "50px",
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                    },
                                }}
                                sx={{mx: 1}}
                            />
                            <IconButton
                                color="primary"
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    width: 42,
                                    height: 42,
                                }}
                            >
                                <Add/>
                            </IconButton>
                        </Box>
                    </Stack>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{
                            borderRadius: "12px",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            py: 2,
                            fontSize: "1.15rem",
                            mt: 4,
                            boxShadow: "0 4px 12px rgba(8,113,53,0.4)",
                            "&:hover": {boxShadow: "0 6px 18px rgba(8,113,53,0.5)"},
                        }}
                    >
                        Add to Basket
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default DishView;