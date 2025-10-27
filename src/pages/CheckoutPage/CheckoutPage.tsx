import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {useCheckout} from "../../hooks/OrdersHooks.tsx";
import {useNavigate, useParams} from "react-router";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type checkoutInterface, CheckoutSchema,} from "../../model/schemas/checkoutInterface.tsx";
import Input from "../../components/Input/Input.tsx";
import type {CheckoutRequest} from "../../model/requests/CheckoutRequest.tsx";
import {clearBasket, getBasketItems} from "../../services/basketServices.tsx";
import {useEffect, useState} from "react";
import type {ToastData} from "../RestaurantDashboardPage/RestaurantDashboardPage.tsx";
import Toast from "../../components/Toast/Toast.tsx";

function CheckoutPage() {
    const {orderId} = useParams()
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastData>({
        open: false,
        message: "",
        severity: "success"
    });
    const {isError, isPending, error, checkoutMutation} = useCheckout();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<checkoutInterface>({
        resolver: zodResolver(CheckoutSchema),
    });
    const totalPrice = getBasketItems().reduce((total, item) => {
        total += (item.dishPrice * item.quantity)
        return total
    }, 0)


    useEffect(() => {

        if (!isSubmitted) return

        if (!isPending && !isError) {

            setIsSubmitted(false)
            setShowDialog(true)
            clearBasket();

        }

        if (!isPending && isError && error) {
            setToast({
                open: true,
                message: error.message,
                severity: "error"
            })
            setIsSubmitted(false)
            setShowDialog(false)
        }

    }, [isError, error, isPending, navigate, isSubmitted]);

    const onSubmit = (data: checkoutInterface) => {
        const request: CheckoutRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            deliveryAddress: {
                street: data.deliveryAddress.street,
                number: parseInt(data.deliveryAddress.number),
                postalCode: data.deliveryAddress.postalCode,
                city: data.deliveryAddress.city,
                country: data.deliveryAddress.country
            },
            email: data.email,
            phoneNumber: data.phoneNumber,
            paymentInfo: {
                method: data.paymentInfo.method,
                amount: totalPrice,
                paymentToken: "tok_kdg_test_987654321"
            }
        }
        checkoutMutation({orderId: orderId!, request: request});
        setIsSubmitted(true)
    };

    return (
        <Container maxWidth="sm" sx={{py: 6}}>
            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
            >
                <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
                    Checkout
                </Typography>

                {/* Customer Info */}
                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Personal Details
                    </Typography>
                    <Box sx={{display: "flex", gap: 2}}>
                        <Input<checkoutInterface>
                            register={register}
                            name="firstName"
                            label="First Name"
                            error={errors.firstName}
                            fullWidth
                        />
                        <Input<checkoutInterface>
                            register={register}
                            name="lastName"
                            label="Last Name"
                            error={errors.lastName}
                            fullWidth
                        />
                    </Box>

                    <Input<checkoutInterface>
                        register={register}
                        name="email"
                        label="Email"
                        error={errors.email}
                        fullWidth
                    />
                    <Input<checkoutInterface>
                        register={register}
                        name="phoneNumber"
                        label="Phone Number"
                        error={errors.phoneNumber}
                        fullWidth
                    />
                </Box>

                {/* Address */}
                <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 4}}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Delivery Address
                    </Typography>
                    <Input<checkoutInterface>
                        register={register}
                        name="deliveryAddress.street"
                        label="Street"
                        error={errors.deliveryAddress?.street}
                        fullWidth
                    />
                    <Box sx={{display: "flex", gap: 2}}>
                        <Input<checkoutInterface>
                            register={register}
                            name="deliveryAddress.number"
                            label="Number"
                            type={"number"}
                            error={errors.deliveryAddress?.number}
                            fullWidth
                        />
                        <Input<checkoutInterface>
                            register={register}
                            name="deliveryAddress.postalCode"
                            label="Postal Code"
                            error={errors.deliveryAddress?.postalCode}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{display: "flex", gap: 2}}>
                        <Input<checkoutInterface>
                            register={register}
                            name="deliveryAddress.city"
                            label="City"
                            error={errors.deliveryAddress?.city}
                            fullWidth
                        />
                        <Input<checkoutInterface>
                            register={register}
                            name="deliveryAddress.country"
                            label="Country"
                            error={errors.deliveryAddress?.country}
                            fullWidth
                        />
                    </Box>
                </Box>

                {/* Payment */}
                <Box sx={{mt: 4, display: "flex", flexDirection: "column", gap: 2}}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Payment Details
                    </Typography>

                    <Input<checkoutInterface>
                        name={"paymentInfo.method"}
                        select={true}
                        label="Payment Method"
                        fullWidth
                        register={register}

                        error={errors.paymentInfo?.method}
                    >
                        <MenuItem value="CASH_ON_PICKUP">Cash on Pickup</MenuItem>
                        <MenuItem value="BANCONTACT">Bancontact</MenuItem>
                        <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                    </Input>

                    {/* Mock Card Inputs */}
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                        <Input<checkoutInterface>
                            register={register}
                            name="paymentInfo.cardNumber"
                            label="Card Number"
                            error={errors.paymentInfo?.cardNumber}
                            fullWidth
                        />
                        <Box sx={{display: "flex", gap: 2}}>
                            <Input<checkoutInterface>
                                register={register}
                                name="paymentInfo.expiryDate"
                                label="Expiry Date"
                                error={errors.paymentInfo?.expiryDate}
                                fullWidth
                            />
                            <Input<checkoutInterface>
                                register={register}
                                name="paymentInfo.cvv"
                                label="CVV"
                                error={errors.paymentInfo?.cvv}
                                fullWidth
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Confirm */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 4,
                    }}
                >
                    <Button color="inherit" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button sx={{
                        fontWeight: 600,
                        textTransform: "none"
                    }} variant="contained" color="success" type="submit">
                        Confirm and Pay € {totalPrice}
                    </Button>
                </Box>
            </Paper>
            <Toast open={toast.open} message={toast.message} severity={toast.severity}
                   onClose={() => setToast(prev => ({...prev, open: false}))}/>


            {/* Confirmation dialog */}
            <Dialog
                open={showDialog}
                onClose={() => navigate(`/tracking/${orderId}`)}
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: 3,
                        textAlign: "center",
                        p: 2,
                    },
                }}
            >
                <DialogTitle>
                    <CheckCircleIcon color="success" sx={{fontSize: 50, mb: 1}}/>
                    <Typography variant="h6">Order Confirmed</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>Your order has been placed successfully!</Typography>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center"}}>
                    <Button
                        variant="text"
                        color="success"
                        onClick={() => navigate(`/tracking/${orderId}`, {replace: true})}>
                        Go to Tracking
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
}

export default CheckoutPage;