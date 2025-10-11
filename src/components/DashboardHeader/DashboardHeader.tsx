import {Badge, Box, Button, Stack, Typography} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";

interface DashboardHeaderProps {
    name: string;
    imageUrl: string;
    totalDishes: number;   // number of dishes to be published
    onPublishAll: () => void;
}

export default function DashboardHeader({name, imageUrl, totalDishes, onPublishAll}: DashboardHeaderProps) {
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
                src={imageUrl}
                alt={name}
                sx={{
                    width: "100%",
                    height: {xs: 180, sm: 240, md: 300},
                    objectFit: "cover",
                    filter: "brightness(65%)",
                    display: "block",
                }}
            />

            {/* Overlay Content */}
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
                {/* Restaurant name box */}
                <Box
                    sx={{
                        bgcolor: "rgba(0,0,0,0.6)",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.4)",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{color: "white", fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.6)"}}
                    >
                        {name}
                    </Typography>
                </Box>

                {/* Publish button with badge */}
                <Badge
                    color="error"
                    badgeContent={totalDishes}
                    overlap="rectangular"
                    anchorOrigin={{vertical: "top", horizontal: "right"}}
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: "0.8rem",
                            height: 30,
                            minWidth: 30,
                            borderRadius: "50%",
                            fontWeight: 600,
                        }
                    }}
                >
                    <Button
                        onClick={onPublishAll}
                        variant="contained"
                        startIcon={<PublishIcon/>}
                        sx={{
                            bgcolor: "primary.main",
                            fontWeight: 600,
                            "&:hover": {bgcolor: "primary.dark"},
                            boxShadow: "0px 3px 6px rgba(0,0,0,0.3)",
                        }}
                    >
                        Publish All
                    </Button>
                </Badge>
            </Stack>
        </Box>
    );
}
