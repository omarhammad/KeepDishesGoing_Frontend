import {Box, Card, CardActionArea, CardContent, CardMedia, Typography,} from "@mui/material";
import type {Restaurant} from "../../../model/Restaurant.tsx";
import {Link} from "react-router";


interface RestaurantCardProps {
    restaurant: Restaurant
}

function RestaurantCard({restaurant}: RestaurantCardProps) {


    return (
        <Link to={`/restaurants/${restaurant.id}`} style={{textDecoration: "none"}}>

            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    position: "relative",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 28px rgba(255,140,0,0.3)",
                    },
                }}
            >
                <CardActionArea>
                    <Box sx={{position: "relative"}}>
                        <CardMedia
                            component="img"
                            height="180"
                            image={restaurant.resPictureUrl}
                            alt={restaurant.name}
                            sx={{objectFit: "cover", filter: "brightness(0.95)"}}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)",
                            }}
                        />
                    </Box>

                    <CardContent sx={{p: 2}}>
                        <Typography variant="h6" fontWeight={700} color="#222" gutterBottom>
                            {restaurant.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                            {restaurant.cuisine} Cuisine
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                            {restaurant.address.street + ' ' +
                                restaurant.address.number + ', ' +
                                restaurant.address.postalCode + ' ' +
                                restaurant.address.city}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{fontStyle: "italic"}}
                        >
                            Prep time: ~{restaurant.defaultPrepTime} min
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>

    );
}

export default RestaurantCard;