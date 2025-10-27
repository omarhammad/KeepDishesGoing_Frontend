import {Box, Button, Grid, Skeleton, Stack, Typography} from "@mui/material";

interface RestaurantDashboardFallbackProps {
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    children: React.ReactNode;
}

function RestaurantDashboardFallback({
                                         isLoading,
                                         isError,
                                         onRetry,
                                         children
                                     }: RestaurantDashboardFallbackProps) {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1600px",
                mx: "auto",
                px: {xs: 2, sm: 3, md: 4},
                py: 4,
            }}
        >
            {isLoading && (
                <Box>
                    <Box
                        sx={{
                            position: "relative",
                            mb: 4,
                            borderRadius: 3,
                            overflow: "hidden",
                            height: 250,
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 20,
                                left: 20,
                                color: "white",
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width={180}
                                height={36}
                                sx={{bgcolor: "rgba(255,255,255,0.3)"}}
                            />
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 20,
                                right: 20,
                                bgcolor: "rgba(255,255,255,0.15)",
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={120}
                                height={32}
                                sx={{bgcolor: "rgba(255,255,255,0.3)"}}
                            />
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        {Array.from({length: 8}).map((_, idx) => (
                            // @ts-expect-error MUI Grid typing
                            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        backgroundColor: "white",
                                        width: "350px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        flexDirection: "column",
                                        height: 320,
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        height={160}
                                        animation="wave"
                                    />
                                    <Box sx={{p: 2}}>
                                        <Skeleton
                                            variant="text"
                                            width="60%"
                                            height={28}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="80%"
                                            height={20}
                                        />
                                        <Stack direction="row" spacing={1} mt={2}>
                                            <Skeleton
                                                variant="rounded"
                                                width={60}
                                                height={30}
                                            />
                                            <Skeleton
                                                variant="rounded"
                                                width={60}
                                                height={30}
                                            />
                                            <Skeleton
                                                variant="rounded"
                                                width={60}
                                                height={30}
                                            />
                                        </Stack>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{mt: 6}}>
                        <Typography
                            variant="h6"
                            sx={{mb: 2, color: "text.secondary"}}
                        >
                            <Skeleton width={180} height={28}/>
                        </Typography>
                        <Stack spacing={2}>
                            {Array.from({length: 3}).map((_, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        bgcolor: "white",
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Skeleton variant="circular" width={40} height={40}/>
                                        <Skeleton variant="text" width={140} height={24}/>
                                    </Stack>
                                    <Skeleton variant="rounded" width={100} height={36}/>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            )}

            {!isLoading && !isError && children}

            {isError && (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h6" color="error" gutterBottom>
                        Something went wrong while loading your restaurant dashboard.
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{mb: 3}}
                    >
                        Please try again.
                    </Typography>
                    {onRetry && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onRetry}
                            sx={{textTransform: "none"}}
                        >
                            Try Again
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default RestaurantDashboardFallback;
