import {Box, Button, Divider, Grid, Skeleton, Typography} from "@mui/material";

interface LandingPageFallbackProps {
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    children: React.ReactNode;
}

function LandingPageFallback({
                                 isLoading,
                                 isError,
                                 onRetry,
                                 children,
                             }: LandingPageFallbackProps) {
    if (isLoading)
        return (
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
                    <Skeleton variant="text" width="40%" height={30} sx={{mb: 2, mx: "auto"}}/>
                    <Divider sx={{mb: 3}}/>

                    <Skeleton variant="text" width="60%" height={25} sx={{mb: 1}}/>
                    <Skeleton variant="rectangular" height={45} sx={{mb: 4, borderRadius: 1}}/>

                    <Skeleton variant="text" width="70%" height={25} sx={{mb: 1}}/>
                    <Skeleton variant="rectangular" height={30} sx={{mb: 4, borderRadius: 1}}/>

                    <Skeleton variant="text" width="70%" height={25} sx={{mb: 1}}/>
                    <Skeleton variant="rectangular" height={30} sx={{mb: 4, borderRadius: 1}}/>

                    <Skeleton variant="text" width="70%" height={25} sx={{mb: 1}}/>
                    <Skeleton variant="rectangular" height={30} sx={{mb: 2, borderRadius: 1}}/>
                </Box>

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

                    <Grid container spacing={4}>
                        {[...Array(9)].map((_, i) => (
                            // @ts-expect-error MUI Grid type mismatch
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={i}
                                display="flex"
                                justifyContent="center"
                            >
                                <Box
                                    sx={{
                                        width: 250,
                                        borderRadius: 3,
                                        bgcolor: "#fff",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Skeleton variant="rectangular" height={180}/>
                                    <Box sx={{p: 2}}>
                                        <Skeleton variant="text" width="70%" height={28}/>
                                        <Skeleton variant="text" width="60%" height={22}/>
                                        <Skeleton variant="text" width="80%" height={22}/>
                                    </Box>
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
                py={6}
                sx={{bgcolor: "#181212", color: "white", minHeight: "calc(100vh - 80px)"}}
            >
                <Typography variant="h6" color="error" gutterBottom>
                    Something went wrong while loading restaurants.
                </Typography>
                <Button variant="contained" color="error" onClick={onRetry} sx={{mt: 2}}>
                    Try Again
                </Button>
            </Box>
        );

    return <>{children}</>;
}

export default LandingPageFallback;
