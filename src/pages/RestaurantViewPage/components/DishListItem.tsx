import {Box, Card, Chip, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LabelIcon from "@mui/icons-material/Label";
import {useState} from "react";
import type {Dish} from "../../../model/Dish.tsx";
import {getJwtTokenValue} from "../../../services/authService.tsx";
import {saveItemToBasket} from "../../../services/basketServices.tsx";

interface DishListItemProps {
    dish: Dish;
}

function DishListItem({dish}: DishListItemProps) {
    const [quantity, setQuantity] = useState(0);
    const [openInfo, setOpenInfo] = useState(false);
    const access_token = getJwtTokenValue();

    const isAvailable = dish.isInStock ?? true;

    const handleOnCartClick = () => {
        saveItemToBasket({
            dishId: dish.id,
            dishName: dish.name,
            dishPrice: dish.price,
            quantity: quantity
        });
        setQuantity(0)
    };

    return (
        <>
            {/* Main Dish Row */}
            <Card
                sx={{
                    mb: 1.2,
                    px: 2,
                    py: 1.4,
                    borderRadius: 2,
                    bgcolor: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    transition: "box-shadow 0.2s ease",
                    "&:hover": {boxShadow: "0 2px 10px rgba(0,0,0,0.15)"},
                    opacity: isAvailable ? 1 : 0.6,
                }}
            >
                {/* Left side */}
                <Box sx={{flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{lineHeight: 1.2}}>
                            {dish.name}
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={() => setOpenInfo(true)}
                            sx={{
                                color: "rgba(0,0,0,0.4)",
                                p: 0.2,
                                "&:hover": {color: "primary.main"},
                            }}
                        >
                            <InfoOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.85,
                            fontWeight: 500,
                            mt: 0.3,
                            lineHeight: 1.3,
                        }}
                    >
                        €{dish.price.toFixed(2)}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.3,
                            maxWidth: "90%",
                            lineHeight: 1.4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {dish.description}
                    </Typography>
                </Box>

                {/* Right side — quantity + basket */}
                {!access_token && <Stack direction="row" alignItems="center" spacing={0.8} sx={{mt: 0.5}}>
                    <IconButton
                        size="small"
                        disabled={quantity === 0}
                        onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                        sx={{
                            color: quantity > 0 ? "#333" : "rgba(0,0,0,0.3)",
                            transition: "color 0.2s ease",
                        }}
                    >
                        <RemoveIcon fontSize="small"/>
                    </IconButton>

                    <Typography
                        sx={{
                            minWidth: 20,
                            textAlign: "center",
                            fontWeight: 600,
                            color: quantity > 0 ? "#000" : "rgba(0,0,0,0.4)",
                        }}
                    >
                        {quantity}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => setQuantity((q) => q + 1)}
                        disabled={!isAvailable}
                        sx={{
                            color: "primary.main",
                            transition: "all 0.2s ease",
                            "&:hover": {color: "primary.dark"},
                        }}
                    >
                        <AddIcon fontSize="small"/>
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={handleOnCartClick}
                        disabled={quantity === 0}
                        sx={{
                            ml: 0.5,
                            bgcolor: "rgba(0,0,0,0.05)",
                            color: "rgba(0,0,0,0.5)",
                            opacity: 0.6,
                            transition: "opacity 0.2s ease, transform 0.15s ease",
                            "&:hover": {
                                opacity: 1,
                                bgcolor: "rgba(0,0,0,0.08)",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <ShoppingCartOutlinedIcon
                            fontSize="small"/>
                    </IconButton>
                </Stack>}
            </Card>

            {/* Info Dialog */}
            <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>{dish.name}</DialogTitle>
                <DialogContent dividers>
                    {/* Dish Type Section */}
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{mb: 1, color: "text.primary"}}
                    >
                        Dish Type
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap sx={{mb: 3}}>
                        <Chip
                            icon={<LocalDiningIcon sx={{color: "success.main"}}/>}
                            label={dish.dishType.toUpperCase()}
                            variant="outlined"
                            sx={{
                                fontWeight: 600,
                                color: "black",
                                borderColor: "rgba(0,0,0,0.2)",
                                "& .MuiChip-icon": {color: "success.main"},
                            }}
                        />
                    </Stack>

                    {/* Food Tags Section */}
                    {dish.foodTags.length > 0 && (
                        <>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{mb: 1, color: "text.primary"}}
                            >
                                Food Tags
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap sx={{mb: 3}}>
                                {dish.foodTags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        icon={<LabelIcon sx={{color: "success.main"}}/>}
                                        label={tag.toUpperCase()}
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            color: "black",
                                            borderColor: "rgba(0,0,0,0.2)",
                                            "& .MuiChip-icon": {color: "success.main"},
                                        }}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}

                    {/* Availability Section */}
                    <Typography variant="subtitle1" fontWeight={600}>
                        Availability
                    </Typography>
                    <Typography
                        variant="body2"
                        color={isAvailable ? "success.main" : "error.main"}
                        sx={{fontWeight: 500}}
                    >
                        {isAvailable ? "In Stock" : "Out of Stock"}
                    </Typography>

                    {/* Scheduled time if exists */}
                    {dish.scheduledTime && (
                        <>
                            <Typography variant="subtitle1" fontWeight={600} sx={{mt: 1}}>
                                Scheduled Time
                            </Typography>
                            <Typography variant="body2">
                                {new Date(dish.scheduledTime).toLocaleString()}
                            </Typography>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DishListItem;
