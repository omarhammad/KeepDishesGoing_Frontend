import {Box, Button, Skeleton, Stack, Typography} from "@mui/material";

interface DishViewFallbackProps {
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    children: React.ReactNode;
}

function DishViewFallback({isLoading, isError, onRetry, children}: DishViewFallbackProps) {
    return (
        <Box
            sx={{
                mt: 6,
                mb: 6,
                px: {xs: 2, sm: 4},
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                backgroundColor: "transparent", // no white bg
            }}
        >
            {/* Loading Skeleton */}
            {isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {xs: "column", md: "row"},
                        backgroundColor: "#fafafa",
                        borderRadius: "20px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        width: "95%",
                        maxWidth: "1250px",
                        minHeight: {md: "600px"},
                    }}
                >
                    {/* Left Image Skeleton */}
                    <Box
                        sx={{
                            flex: {xs: "0 0 100%", md: "0 0 40%"},
                            backgroundColor: "#fff",
                        }}
                    >
                        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave"/>
                    </Box>

                    {/* Right Details Skeleton */}
                    <Box
                        sx={{
                            flex: {xs: "0 0 100%", md: "0 0 60%"},
                            p: {xs: 4, sm: 6},
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Stack spacing={3}>
                            <Skeleton variant="text" width="60%" height={50}/>
                            <Stack direction="row" spacing={1}>
                                <Skeleton variant="rounded" width={80} height={32}/>
                                <Skeleton variant="rounded" width={100} height={32}/>
                                <Skeleton variant="rounded" width={90} height={32}/>
                            </Stack>

                            <Skeleton variant="rectangular" width="100%" height={2}/>
                            <Skeleton variant="text" width="90%" height={28}/>
                            <Skeleton variant="text" width="70%" height={28}/>
                            <Skeleton variant="text" width="40%" height={48}/>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Skeleton variant="text" width={100} height={36}/>
                                <Skeleton variant="rounded" width={150} height={40}/>
                            </Stack>

                            <Skeleton variant="rounded" width="100%" height={55}/>
                        </Stack>
                    </Box>
                </Box>
            )}

            {/* Loaded Content */}
            {!isLoading && !isError && children}

            {/* Error State */}
            {isError && (
                <Box textAlign="center" py={5}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Something went wrong while loading the dish.
                    </Typography>
                    {onRetry && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onRetry}
                            sx={{mt: 2}}
                        >
                            Try Again
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default DishViewFallback;
