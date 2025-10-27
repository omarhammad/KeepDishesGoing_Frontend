import {Box, Button, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: "50vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
                px: 2,
            }}
        >
            <Stack spacing={2} alignItems="center">
                <RestaurantMenuIcon sx={{fontSize: 90, color: "error.main"}}/>
                <Typography variant="h4" fontWeight={700}>
                    404 – Page Not Found
                </Typography>
                <Typography variant="body1" color="text.white" sx={{maxWidth: 400}}>
                    Looks like this page is off the menu.
                    Try heading back to explore delicious dishes instead.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        mt: 2,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        fontWeight: 600,
                    }}
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
}

export default NotFoundPage;
