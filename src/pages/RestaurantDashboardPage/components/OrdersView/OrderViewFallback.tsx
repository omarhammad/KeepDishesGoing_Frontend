import {Box, Grid, Skeleton, Typography} from "@mui/material";
import * as React from "react";

interface OrderViewFallbackProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    children?: React.ReactNode;
}

const OrderViewFallback = ({
                               isLoading,
                               isError,
                               isEmpty,
                               children,
                           }: OrderViewFallbackProps) => {
    if (isLoading)
        return (
            <Box sx={{width: "100%", py: 5}}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={4}
                    color="white"
                    sx={{letterSpacing: "0.5px"}}
                >
                    Incoming Orders
                </Typography>

                <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
                    {[...Array(6)].map((_, i) => (
                        // @ts-expect-error MUI Grid type mismatch
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={i}
                            sx={{display: "flex", width: "345px"}}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    backgroundColor: "#fff",
                                    flexGrow: 1,
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    height: 340,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Skeleton variant="text" width="60%" height={30}/>
                                    <Skeleton variant="text" width="40%" height={25}/>
                                </Box>

                                <Box>
                                    {[...Array(3)].map((_, j) => (
                                        <Skeleton key={j} variant="text" height={20} sx={{mb: 1}}/>
                                    ))}
                                </Box>

                                <Box>
                                    <Skeleton variant="rectangular" height={36} sx={{mb: 1, borderRadius: 1}}/>
                                    <Skeleton variant="rectangular" height={36} sx={{borderRadius: 1}}/>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );

    if (isError)
        return (
            <Typography color="error" textAlign="center" mt={4}>
                Failed to load orders. Please try again later.
            </Typography>
        );

    if (isEmpty)
        return (
            <Typography color="white" textAlign="center" mt={4}>
                No orders yet.
            </Typography>
        );

    return <>{children}</>;
};

export default OrderViewFallback;
