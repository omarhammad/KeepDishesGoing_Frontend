import {Box, Button, Grid, Skeleton, Stack, Typography,} from "@mui/material";
import * as React from "react";

interface RestaurantViewFallbackProps {
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    children: React.ReactNode;
}

export default function RestaurantViewFallback({
                                                   isLoading,
                                                   isError,
                                                   onRetry,
                                                   children,
                                               }: RestaurantViewFallbackProps) {
    if (isLoading)
        return (
            <Box sx={{bgcolor: "#181212", minHeight: "100vh", color: "white"}}>
                {/* Header Skeleton */}
                <Box sx={{position: "relative", borderRadius: 2, overflow: "hidden", mb: 4}}>
                    <Skeleton
                        variant="rectangular"
                        height={320}
                        sx={{borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)"}}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 30,
                            left: 40,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        <Skeleton variant="text" width={200} height={32}/>
                        <Skeleton variant="text" width={120} height={22}/>
                    </Box>
                </Box>

                {/* Filter Bar Skeleton */}
                <Box
                    sx={{
                        bgcolor: "#231818",
                        mx: 6,
                        mb: 4,
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {[...Array(8)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                width={80 + (i % 3) * 30}
                                height={32}
                                sx={{borderRadius: "16px"}}
                            />
                        ))}
                    </Stack>

                    <Box>
                        <Skeleton variant="text" width={60} height={22}/>
                        <Skeleton variant="rounded" width={100} height={36}/>
                    </Box>
                </Box>

                {/* Dishes Section */}
                <Box sx={{px: 6, pb: 5}}>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Explore Dishes
                    </Typography>

                    <Grid container spacing={2}>
                        {[...Array(5)].map((_, i) => (
                            <Grid item xs={12} key={i}>
                                <Box
                                    sx={{
                                        bgcolor: "#fff",
                                        borderRadius: 2,
                                        color: "#000",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        px: 2,
                                        py: 1.5,
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box sx={{flexGrow: 1}}>
                                        <Skeleton variant="text" width="35%" height={26}/>
                                        <Skeleton variant="text" width="20%" height={22}/>
                                        <Skeleton variant="text" width="50%" height={20}/>
                                    </Box>

                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Skeleton variant="rounded" width={90} height={32}/>
                                        <Skeleton variant="circular" width={36} height={36}/>
                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        );

    if (isError)
        return (
            <Box
                textAlign="center"
                py={8}
                sx={{
                    bgcolor: "#181212",
                    color: "white",
                    minHeight: "calc(100vh - 80px)",
                }}
            >
                <Typography variant="h6" color="error" gutterBottom>
                    Failed to load the restaurant data.
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onRetry}
                    sx={{mt: 2}}
                >
                    Retry
                </Button>
            </Box>
        );

    return <>{children}</>;
}
