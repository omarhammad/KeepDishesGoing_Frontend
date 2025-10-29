import {Box, Button, Divider, keyframes, Paper, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useOrder} from "../../hooks/OrdersHooks.tsx";
import {LocationOn, Person} from "@mui/icons-material";

const blink = keyframes`
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.3;
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
`;

type OrderTimeline = {
    status: string;
    time?: string;
    message?: string;
};

export default function OrderTrackingPage() {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const [timeline, setTimeline] = useState<OrderTimeline[]>([]);
    const {order} = useOrder(orderId!);

    const allStatuses = [
        "PLACED",
        "ACCEPTED",
        "READY_FOR_PICKUP",
        "PICKED_UP",
        "DELIVERED",
    ];


    const mapDeclineReason = (reason?: string) => {
        if (!reason) return undefined;
        if (reason === "RESPONSE_TIME_EXCEEDED") {
            return "The restaurant didn’t respond in time.";
        }
        return reason;
    };

    useEffect(() => {
        if (!order) return;

        const formatTime = (time: string | undefined) => {
            if (!time) return undefined;
            const date = new Date(time);
            return date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        const reachedIndex = allStatuses.indexOf(order.orderStatus);
        const isFinal =
            order.orderStatus === "REJECTED" || order.orderStatus === "DECLINED";

        const newTimeline: OrderTimeline[] = [];


        newTimeline.push({
            status: "PLACED",
            time: order.orderStatus === "PLACED" ? formatTime(order.statusOccurredAt) : undefined,
        });

        if (isFinal) {
            newTimeline.push({
                status: order.orderStatus,
                time: formatTime(order.statusOccurredAt),
                message:
                    order.orderStatus === "REJECTED"
                        ? order.rejectedMsg
                        : mapDeclineReason(order.declinedMsg),
            });
        } else {
            for (let i = 1; i <= reachedIndex; i++) {
                newTimeline.push({
                    status: allStatuses[i],
                    time: i === reachedIndex ? formatTime(order.statusOccurredAt) : undefined,
                });
            }

            const nextStatus = allStatuses[reachedIndex + 1];
            if (nextStatus) newTimeline.push({status: nextStatus});
        }

        setTimeline(newTimeline);
    }, [allStatuses, order]);

    if (!order) return <></>;


    const currentIndex = timeline.findIndex((ot) => ot.time);

    return (
        <Box
            sx={{
                color: "white",
                minHeight: "100vh",
                py: 6,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    maxWidth: 700,
                    width: "100%",
                    bgcolor: "white",
                    color: "black",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "80vh",
                }}
            >
                <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
                    Order Tracking
                </Typography>

                <Box
                    sx={{
                        gap: 3,
                        mb: 3,
                        textAlign: "start",
                        bgcolor: "#f9f9f9",
                        borderRadius: 2,
                        p: 2,
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="body2">
                            <Person/> {order.customer.firstName} {order.customer.lastName}
                        </Typography>
                        <Typography variant="body2">
                            <LocationOn/> {order.customer.deliveryAddress.street}{" "}
                            {order.customer.deliveryAddress.number},{" "}
                            {order.customer.deliveryAddress.postalCode}{" "}
                            {order.customer.deliveryAddress.city},{" "}
                            {order.customer.deliveryAddress.country}
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{my: 3}}/>

                <Typography variant="h6" fontWeight={600} mb={2}>
                    Order Progress
                </Typography>

                <Stack
                    direction="column"
                    spacing={0}
                    sx={{
                        position: "relative",
                        pl: 3,
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 14,
                            top: 0,
                            bottom: 0,
                            width: 2,
                            bgcolor: "grey.300",
                        },
                    }}
                >
                    {timeline.map((step, i) => {
                        const isActive = i === currentIndex;
                        const isCompleted = i < currentIndex;
                        const isDeclinedOrRejected =
                            step.status === "DECLINED" || step.status === "REJECTED";

                        return (
                            <Stack
                                key={i}
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{mb: i !== timeline.length - 1 ? 3 : 0}}
                            >
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        bgcolor: isDeclinedOrRejected
                                            ? "error.main"
                                            : isActive
                                                ? "success.main"
                                                : isCompleted
                                                    ? "success.main"
                                                    : "grey.400",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        animation: isActive ? `${blink} 1.5s infinite` : "none",
                                        boxShadow: isActive ? "0 0 8px rgba(76,175,80,0.5)" : "none",
                                    }}
                                >
                                    {isCompleted ? "✓" : isActive ? "●" : "○"}
                                </Box>

                                <Stack>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={isActive ? 700 : 500}
                                        color={
                                            isDeclinedOrRejected
                                                ? "error.main"
                                                : isActive
                                                    ? "success.main"
                                                    : "text.primary"
                                        }
                                        sx={{display: "flex", alignItems: "center", gap: 1}}
                                    >
                                        {step.status}
                                        {step.time && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{fontStyle: "italic"}}
                                            >
                                                {step.time}
                                            </Typography>
                                        )}
                                    </Typography>

                                    {step.message && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                ml: 0.5,
                                                bgcolor: "#ffebee",
                                                p: 0.5,
                                                borderRadius: 1,
                                                display: "inline-block",
                                            }}
                                        >
                                            <strong>Reason:</strong> {step.message}
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>
                        );
                    })}
                </Stack>
                <Box sx={{flexGrow: 1}}/> {/* spacer to push button down */}

                <Button
                    variant="contained"
                    color="success"
                    sx={{alignSelf: "center", mt: 3}}
                    onClick={() => {
                        navigate("/")
                    }}
                >
                    Back to Home
                </Button>
            </Paper>
        </Box>
    );
}
