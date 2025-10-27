import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Popover,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Logo from "../assets/logo.webp";
import {Link, Outlet} from "react-router-dom";
import {clearAllTokenData, getJwtTokenValue} from "../services/authService.tsx";
import {useNavigate} from "react-router";
import {hasOwnerRestaurant} from "../services/restaurantService.tsx";
import {useEffect, useState} from "react";
import type {BasketItem} from "../model/BasketItem.tsx";
import {deleteBasketItem, getBasketItems} from "../services/basketServices.tsx";
import {useCreateNewOrder} from "../hooks/OrdersHooks.tsx";
import Toast from "../components/Toast/Toast.tsx";
import type {ToastData} from "../pages/RestaurantDashboardPage/RestaurantDashboardPage.tsx";


function MainLayout() {

    const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
    const [anchorElBasket, setAnchorElBasket] = useState<null | HTMLElement>(null);
    const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
    const [hasCreateNewOrder, setHasCreateNewOrder] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastData>({
        open: false,
        message: "",
        severity: "success"
    });
    const navigate = useNavigate();
    const {isError, isPending, orderIdDto, error, createOrderMutation} = useCreateNewOrder()


    useEffect(() => {
        const handleBasketUpdated = () => {
            const items = getBasketItems();
            setBasketItems(items);
        }

        window.addEventListener("basketUpdated", handleBasketUpdated)
        handleBasketUpdated()

        return () =>
            window.removeEventListener("basketUpdated", handleBasketUpdated);
    }, []);

    useEffect(() => {

        if (!hasCreateNewOrder) return

        if (!isPending && !isError && orderIdDto) {
            setAnchorElBasket(null);
            setHasCreateNewOrder(false)
            navigate(`/checkout/${orderIdDto.orderId}`, {replace: true});
        }

        if (!isPending && isError && error) {
            setToast({
                open: true,
                message: error.message,
                severity: "error"
            })
            setHasCreateNewOrder(false)
        }

    }, [isError, error, isPending, orderIdDto, navigate, hasCreateNewOrder]);


    const access_token = getJwtTokenValue();
    const basketCount = basketItems.reduce((acc, i) => acc + i.quantity, 0);

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
        setAnchorElMenu(e.currentTarget);
    const handleMenuClose = () => setAnchorElMenu(null);


    const handleBasketClick = (e: React.MouseEvent<HTMLElement>) =>
        setAnchorElBasket(e.currentTarget);
    const handleBasketClose = () => setAnchorElBasket(null);

    const handleRemoveItem = (id: string) => {
        deleteBasketItem(id);
    }

    const handleContinue = () => {
        const dishes: string[] = [];

        for (const basketItem of basketItems) {
            for (let i = 0; i < basketItem.quantity; i++) {
                dishes.push(basketItem.dishId)
            }
        }
        createOrderMutation({request: {dishes: dishes}})
        setHasCreateNewOrder(true);

    };

    const handleLogout = () => {
        clearAllTokenData();
        navigate("/", {replace: true});
        setAnchorElMenu(null);
    };

    const handleDashboard = async () => {
        try {
            const hasRestaurant = await hasOwnerRestaurant();
            navigate(hasRestaurant ? "/owner/dashboard" : "/owner/restaurants/add", {
                replace: true,
            });
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Unknown Error");
        } finally {
            setAnchorElMenu(null);
        }
    };

    const handleLogoOnClick = () => navigate("/", {replace: true});

    return (
        <>
            {/* Navbar */}
            <AppBar position="fixed" color="primary">
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* Logo */}
                    <Box
                        component="img"
                        onClick={handleLogoOnClick}
                        src={Logo}
                        alt="Logo"
                        sx={{height: 40, cursor: "pointer"}}
                    />

                    {/* Basket + Menu */}
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        {/* Basket */}
                        {!access_token && <IconButton color="inherit" onClick={handleBasketClick}>
                            <Badge badgeContent={basketCount} color="error">
                                <ShoppingCartOutlinedIcon/>
                            </Badge>
                        </IconButton>
                        }
                        <Popover
                            open={Boolean(anchorElBasket)}
                            anchorEl={anchorElBasket}
                            onClose={handleBasketClose}
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            transformOrigin={{vertical: "top", horizontal: "right"}}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    borderRadius: 2,
                                    minWidth: 320,
                                    maxHeight: 400,
                                    overflowY: "auto",
                                    bgcolor: "#fff",
                                    color: "#000",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                                },
                            }}
                        >
                            <Box sx={{p: 2}}>
                                <Typography variant="h6" fontWeight={600} mb={1}>
                                    Your Basket
                                </Typography>
                                <Divider sx={{mb: 1}}/>
                                {basketItems.length === 0 ? (
                                    <Typography variant="body2" sx={{color: "gray", py: 2}}>
                                        Your basket is empty.
                                    </Typography>
                                ) : (
                                    <Stack spacing={1}>
                                        {basketItems.map((item) => (
                                            <Box
                                                key={item.dishId}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    bgcolor: "#f8f8f8",
                                                    borderRadius: 1,
                                                    p: 1,
                                                }}
                                            >
                                                <Box>
                                                    <Typography fontWeight={600}>{item.dishName}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.quantity} × €{item.dishPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.dishId)}
                                                >
                                                    <DeleteOutlineIcon/>
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Divider sx={{my: 1}}/>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleContinue}
                                        >
                                            Continue to Checkout
                                        </Button>
                                    </Stack>
                                )}
                            </Box>
                        </Popover>

                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <MenuIcon/>
                        </IconButton>

                        <Menu
                            anchorEl={anchorElMenu}
                            open={Boolean(anchorElMenu)}
                            onClose={handleMenuClose}
                            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                            transformOrigin={{vertical: "top", horizontal: "right"}}
                        >
                            {access_token ? (
                                <>
                                    <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem component={Link} to="/auth/login">
                                        Login
                                    </MenuItem>
                                    <MenuItem component={Link} to="/auth/register">
                                        Register
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Page Content */}
            <Container sx={{mt: 10, mb: 8}}>
                <Outlet/>
            </Container>
            <Toast open={toast.open} message={toast.message} severity={toast.severity}
                   onClose={() => setToast(prev => ({...prev, open: false}))}/>
        </>
    );
}

export default MainLayout;
