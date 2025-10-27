import './App.scss'
import {BrowserRouter, Route, Routes} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage/RestaurantDashboardPage.tsx";
import AddNewRestaurantPage from "./pages/AddNewRestaurantPage/AddNewRestaurantPage.tsx";
import AddNewDishPage from "./pages/AddNewDishPage/AddNewDishPage.tsx";
import DishViewPage from "./pages/DishViewPage/DishViewPage.tsx";
import RestaurantViewPage from "./pages/RestaurantViewPage/RestaurantViewPage.tsx";
import EditDishDraftPage from "./pages/EditDishDraftPage/EditDishDraftPage.tsx";
import OrderTrackingPage from "./pages/OrderTrackingPage/OrderTrackingPage.tsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import AuthGuard from "./components/AuthGuard/AuthGuard.tsx";

axios.defaults.baseURL = "http://localhost:8080";
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainLayout/>}>
                        {/*Home + Public pages */}

                        <Route path={"/"} element={<LandingPage/>}/>
                        <Route path={"/restaurants/:restaurantId"} element={<RestaurantViewPage/>}/>
                        <Route path={"/restaurants/:restaurantId/dishes/:dishId"} element={<DishViewPage/>}/>
                        <Route path={"/checkout/:orderId"} element={<CheckoutPage/>}/>
                        <Route path={"/tracking/:orderId"} element={<OrderTrackingPage/>}/>

                        {/*Auth + Owner pages*/}

                        <Route path={"/auth/login"} element={<LoginPage/>}/>
                        <Route path={"/auth/register"} element={<RegisterPage/>}/>
                        <Route path={"/owner/restaurants/add"}
                               element={<AuthGuard><AddNewRestaurantPage/></AuthGuard>}/>
                        <Route path={"/owner/dashboard"} element={<AuthGuard><RestaurantDashboardPage/></AuthGuard>}/>
                        <Route path={"/owner/restaurants/:restaurantId/dishes/add"}
                               element={<AuthGuard><AddNewDishPage/></AuthGuard>}/>
                        <Route path={"/owner/restaurants/:restaurantId/dishes/:dishId/edit"}
                               element={<AuthGuard><EditDishDraftPage/></AuthGuard>}/>
                    </Route>


                    {/* NotFound ROUTE*/}
                    <Route path={"*"} element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>

    );
}

export default App
