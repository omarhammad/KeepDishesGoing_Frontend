import {Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {useState} from "react";
import type {Restaurant} from "../../../model/Restaurant.tsx";
import {useRestaurantOPenStatus} from "../../../hooks/RestaurantsHooks.tsx";

interface RestaurantHeaderProps {
    restaurant: Restaurant
}

function RestaurantHeader({restaurant}: RestaurantHeaderProps) {

    const [openInfo, setOpenInfo] = useState(false);

    const {isError, isLoading, status} = useRestaurantOPenStatus(restaurant.id)
    let isOpen;
    if (!isLoading && !isError && status) {
        isOpen = status.openStatus;
    }

    return (
        <Box
            sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                textAlign: "left",
            }}
        >
            <Box
                component="img"
                src={restaurant.resPictureUrl}
                alt={restaurant.name}
                sx={{
                    width: "100%",
                    height: {xs: 200, sm: 280, md: 320},
                    objectFit: "cover",
                    filter: "brightness(60%)",
                    display: "block",
                }}
            />

            <Stack
                direction={{xs: "column", sm: "row"}}
                spacing={2}
                sx={{
                    position: "absolute",
                    left: 24,
                    bottom: 24,
                    right: 24,
                    alignItems: {xs: "flex-start", sm: "center"},
                    justifyContent: "space-between",
                }}
            >
                {/* Info Section */}
                <Box
                    sx={{
                        bgcolor: "rgba(0,0,0,0.55)",
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.4)",
                        maxWidth: {xs: "100%", sm: "60%"},
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                        }}
                    >
                        {restaurant.name}
                    </Typography>

                </Box>

                {/* Status + Info */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                        label={isOpen ? "Open Now" : "Closed"}
                        color={isOpen ? "success" : "error"}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: isOpen ? "success.main" : "error.main",
                            color: "white",
                            boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
                        }}
                    />
                    <Tooltip title="More details">
                        <IconButton
                            onClick={() => setOpenInfo(true)}
                            sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                "&:hover": {bgcolor: "rgba(255,255,255,0.35)"},
                            }}
                        >
                            <InfoOutlinedIcon sx={{color: "white"}}/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
            <Dialog
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        bgcolor: "background.paper",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        pb: 0,
                        fontSize: "1.3rem",
                        color: "text.primary",
                    }}
                >
                    {restaurant.name} Info
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        mt: 1,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        px: {xs: 2, sm: 3},
                        py: {xs: 2, sm: 3},
                        bgcolor: "rgba(250,250,250,0.95)",
                    }}
                >
                    {/* Address */}
                    <Stack spacing={0.5} mb={3}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{color: "text.secondary"}}
                        >
                            Address
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.primary"}}>
                            {restaurant.address.street} {restaurant.address.number},{" "}
                            {restaurant.address.postalCode} {restaurant.address.city},{" "}
                            {restaurant.address.country}
                        </Typography>
                    </Stack>

                    {/* Opening Hours */}
                    <Stack spacing={1.5} mb={3}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{color: "text.secondary"}}
                        >
                            Opening Hours
                        </Typography>

                        <Box
                            component="table"
                            sx={{
                                width: "100%",
                                borderCollapse: "collapse",
                                "& th, & td": {
                                    py: 0.6,
                                    fontSize: "0.9rem",
                                },
                                "& th": {
                                    textAlign: "left",
                                    color: "text.secondary",
                                    fontWeight: 600,
                                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                                },
                                "& td": {
                                    color: "text.primary",
                                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                                },
                            }}
                        >
                            <thead>
                            <tr>
                                <th>Day</th>
                                <th>Open</th>
                                <th>Close</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(restaurant.dayOpeningHours).map(
                                ([day, {open, close}]) => (
                                    <tr key={day}>
                                        <td>{day}</td>
                                        <td>{open}</td>
                                        <td>{close}</td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </Box>
                    </Stack>

                    {/* Owner */}
                    <Stack spacing={0.5}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{color: "text.secondary"}}
                        >
                            Owner
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.primary"}}>
                            {restaurant.owner.firstName} {restaurant.owner.lastName}
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.primary"}}>
                            {restaurant.owner.email}
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.primary"}}>
                            {restaurant.owner.phoneNumber}
                        </Typography>
                    </Stack>
                </DialogContent>
            </Dialog>

        </Box>
    );
}


export default RestaurantHeader;