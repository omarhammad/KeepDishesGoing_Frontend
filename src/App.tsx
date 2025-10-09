import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage.tsx";
import AddNewRestaurantPage from "./pages/AddNewRestaurantPage.tsx";
import AddNewDishPage from "./pages/AddNewDishPage.tsx";
import DishViewPage from "./pages/DishViewPage.tsx";
import RestaurantViewPage from "./pages/RestaurantViewPage.tsx";
import EditDishDraftPage from "./pages/EditDishDraftPage.tsx";
import BasketPage from "./pages/BasketPage.tsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";

axios.defaults.baseURL = "http://localhost:8080";
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/*Home + Public pages */}
                    <Route element={<MainLayout/>}>
                        <Route path={"/"} element={<LandingPage/>}/>
                        <Route path={"/restaurants/:restaurantId/dishes/:id"} element={<DishViewPage/>}/>
                        <Route path={"/restaurants/:restaurantId"} element={<RestaurantViewPage/>}/>
                        <Route path={"/basket/:basketId"} element={<BasketPage/>}/>
                        <Route path={"/basket/:basketId/checkout"} element={<CheckoutPage/>}/>
                        <Route path={"/order/:orderId/tracking"} element={<OrderTrackingPage/>}/>
                    </Route>
                    {/*Auth + Owner pages*/}
                    <Route path={"/auth/login"} element={<LoginPage/>}/>
                    <Route path={"/auth/register"} element={<RegisterPage/>}/>
                    <Route path={"/owner/restaurants/add"} element={<AddNewRestaurantPage/>}/>
                    <Route path={"/owner/dashboard"} element={<RestaurantDashboardPage/>}/>
                    <Route path={"/owner/dishes/add"} element={<AddNewDishPage/>}/>
                    <Route path={"/owner/dishes/:id/edit"} element={<EditDishDraftPage/>}/>


                    {/* 404 ROUTE*/}
                    <Route path={"*"} element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>

    );
}

export default App
