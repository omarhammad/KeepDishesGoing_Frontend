import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {AccessTime, Cancel, CheckCircle, InfoOutlined, Restaurant,} from "@mui/icons-material";
import {useState} from "react";
import type {Order} from "../../../../model/Order.tsx";
import type {Dish} from "../../../../model/Dish.tsx";
import {acceptOrder, markOrderReady, rejectOrder} from "../../../../services/orderService.tsx";

interface OrderCardProps {
    order: Order;
    restaurantDishes: Dish[]
}

interface OrderCardDish {
    name: string,
    quantity: number
}

const OrderCard = ({restaurantDishes, order}: OrderCardProps) => {
    const [openDishesDialog, setOpenDishesDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmType, setConfirmType] = useState<
        "accept" | "reject" | "ready" | null
    >(null);
    const [rejectReason, setRejectReason] = useState("");
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);


    const getStatusColor = (status: string) => {
        switch (status) {
            case "PLACED":
                return "info";
            case "ACCEPTED":
                return "warning";
            case "READY":
                return "success";
            case "REJECTED":
            case "DECLINED":
                return "error";
            case "PICKED_UP":
                return "primary";
            case "DELIVERED":
                return "secondary";
            default:
                return "default";
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const orderCardDishes: OrderCardDish[] = [];

    for (const dishId of order.dishes) {
        const matchedDish = restaurantDishes.find((dish) => dish.id === dishId);

        if (!matchedDish) continue;

        const existing = orderCardDishes.find((d) => d.name === matchedDish.name);

        if (existing) {
            existing.quantity += 1;
        } else {
            orderCardDishes.push({name: matchedDish.name, quantity: 1});
        }
    }

    const visibleDishes = orderCardDishes.slice(0, 3);
    const hiddenCount = orderCardDishes.length - visibleDishes.length;
    const fullName = `${order.customer.firstName} ${order.customer.lastName}`


    const handleConfirm = (type: "accept" | "reject" | "ready") => {
        setConfirmType(type);
        setRejectReason("");
        setOpenConfirmDialog(true);
    };

    const handleConfirmAction = async () => {
        try {
            if (confirmType === "accept") {
                await acceptOrder(order.id, order.restaurantId)
                console.log("Accepted order:", order.id);

            } else if (confirmType === "reject") {
                await rejectOrder(order.id, rejectReason, order.restaurantId)
                console.log("Rejected order:", order.id, "Reason:", rejectReason);
            } else if (confirmType === "ready") {
                await markOrderReady(order.id, order.restaurantId)
                console.log("Marked ready:", order.id);
            }
            setOpenConfirmDialog(false);
        } catch (err: any) {
            console.log(err.message)
            setOpenConfirmDialog(false);
        }

    };

    const handleCloseDialogs = () => {
        setOpenDishesDialog(false);
        setOpenConfirmDialog(false);
        setOpenCustomerDialog(false);
    };

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    },
                    height: 340,
                }}
            >
                {/* Header */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" fontWeight="600">
                            {fullName}
                        </Typography>
                        <Tooltip title="Customer Info">
                            <IconButton
                                size="small"
                                onClick={() => setOpenCustomerDialog(true)}
                            >
                                <InfoOutlined fontSize="small" color="success"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Chip
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        sx={{fontWeight: 600}}
                    />
                </Box>

                <Divider sx={{my: 2}}/>

                {/* Order Info */}
                <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                        <AccessTime
                            sx={{
                                fontSize: "1rem",
                                mr: 0.5,
                                verticalAlign: "middle",
                            }}
                        />
                        {formatDate(order.statusOccurredAt)}
                    </Typography>

                    <Typography variant="body1" fontWeight="500">
                        Total:{" "}
                        <Typography component="span" color="primary" fontWeight="700">
                            ${order.totalPrice.toFixed(2)}
                        </Typography>
                    </Typography>

                    {/* Dishes */}
                    <Stack spacing={0.5} mt={1}>
                        {visibleDishes.map((dish, i: number) => (
                            <Box
                                key={i}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                    }}
                                >
                                    <Restaurant sx={{fontSize: "1rem", color: "#666"}}/>
                                    {dish.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    × {dish.quantity}
                                </Typography>
                            </Box>
                        ))}

                        {hiddenCount > 0 && (
                            <Button
                                size="small"
                                variant="text"
                                onClick={() => setOpenDishesDialog(true)}
                                sx={{
                                    mt: 1,
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                +{hiddenCount} more
                            </Button>
                        )}
                    </Stack>
                </Stack>

                {/* Rejected & Declined Message */}
                {order.orderStatus === "REJECTED" &&
                    order.rejectedMsg && (
                        <Box
                            sx={{
                                mt: 2,
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                                borderRadius: 1,
                                p: 1.5,
                            }}
                        >
                            <Typography variant="body2" fontWeight={600} color="error">
                                Rejection Reason:
                            </Typography>
                            <Typography variant="body2" color="error">
                                {order.rejectedMsg}
                            </Typography>
                        </Box>
                    )}

                {order.orderStatus === "DECLINED" &&
                    order.declinedMsg && (
                        <Box
                            sx={{
                                mt: 2,
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                                borderRadius: 1,
                                p: 1.5,
                            }}
                        >
                            <Typography variant="body2" fontWeight={600} color="error">
                                Declined Reason:
                            </Typography>
                            <Typography variant="body2" color="error">
                                {order.declinedMsg}
                            </Typography>
                        </Box>
                    )}

                <Divider sx={{my: 2}}/>

                {/* Buttons */}
                {order.orderStatus === "PLACED" && (
                    <Stack direction="row" justifyContent="space-between" mt="auto">
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle/>}
                            sx={{
                                flex: 1,
                                mr: 1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                            onClick={() => handleConfirm("accept")}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel/>}
                            sx={{
                                flex: 1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                            onClick={() => handleConfirm("reject")}
                        >
                            Reject
                        </Button>
                    </Stack>
                )}

                {order.orderStatus === "ACCEPTED" && (
                    <Stack direction="row" justifyContent="center" mt="auto">
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle/>}
                            sx={{
                                flex: 1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                            onClick={() => handleConfirm("ready")}
                        >
                            Mark as Ready
                        </Button>
                    </Stack>
                )}
            </Paper>

            {/* View All Dishes */}
            <Dialog open={openDishesDialog} onClose={handleCloseDialogs}>
                <DialogTitle>All Dishes — {fullName}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={1}>
                        {orderCardDishes.map((dish, i: number) => (
                            <Typography key={i}>
                                🍽 {dish.name} × {dish.quantity}
                            </Typography>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Customer Info */}
            <Dialog
                open={openCustomerDialog}
                onClose={handleCloseDialogs}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Customer Information</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" fontWeight={600}>
                        {fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📧 {order.customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        📞 {order.customer.phoneNumber}
                    </Typography>
                    <Divider sx={{my: 2}}/>
                    <Typography variant="body2">
                        {order.customer.deliveryAddress.street}{" "}
                        {order.customer.deliveryAddress.number},{" "}
                        {order.customer.deliveryAddress.postalCode}{" "}
                        {order.customer.deliveryAddress.city},{" "}
                        {order.customer.deliveryAddress.country}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseDialogs}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {borderRadius: 3, p: 1.5},
                }}
            >
                <DialogTitle sx={{fontWeight: 700, textAlign: "center"}}>
                    {confirmType === "accept"
                        ? "Confirm Accept Order"
                        : confirmType === "reject"
                            ? "Reject Order"
                            : "Mark Order as Ready"}
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        textAlign: "center",
                        pt: 2,
                        pb: 1,
                        backgroundColor:
                            confirmType === "ready"
                                ? "rgba(76, 175, 80, 0.05)"
                                : confirmType === "reject"
                                    ? "rgba(244, 67, 54, 0.05)"
                                    : "inherit",
                    }}
                >
                    {confirmType === "reject" ? (
                        <TextField
                            label="Rejection Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            sx={{mt: 1}}
                        />
                    ) : confirmType === "ready" ? (
                        <>
                            <Typography variant="body1" sx={{mb: 1.5}}>
                                You’re about to mark this order as{" "}
                                <strong style={{color: "#2e7d32"}}>Ready for Pickup</strong>.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Customer: <strong>{fullName}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" sx={{mb: 1}}>
                            Confirm you want to accept this order from{" "}
                            <strong>{fullName}</strong>?
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{justifyContent: "center", pt: 2}}>
                    <Button onClick={handleCloseDialogs} sx={{textTransform: "none"}}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        variant="contained"
                        color={
                            confirmType === "accept"
                                ? "success"
                                : confirmType === "reject"
                                    ? "error"
                                    : "success"
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        {confirmType === "accept"
                            ? "Confirm"
                            : confirmType === "reject"
                                ? "Reject"
                                : "Mark Ready"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderCard;
