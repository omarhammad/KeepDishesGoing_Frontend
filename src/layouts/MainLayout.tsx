import {AppBar, Box, Button, Container, TextField, Toolbar} from "@mui/material";
import Logo from "../assets/logo.webp"
import {Link, Outlet} from "react-router-dom";
import {clearAllTokenData, getJwtTokenValue} from "../services/authService.tsx";
import {useNavigate} from "react-router";
import {hasOwnerRestaurant} from "../services/restaurantService.tsx";

function MainLayout() {


    const navigate = useNavigate();
    const access_token = getJwtTokenValue();


    const handleLogout = () => {
        clearAllTokenData()
        navigate("/", {replace: true})

    };


    const handleDashboard = async () => {

        try {
            const hasRestaurant = await hasOwnerRestaurant();

            if (hasRestaurant) {
                navigate("/owner/dashboard", {replace: true})
            } else {
                navigate("/owner/restaurants/add", {replace: true})
            }

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("handleDashboard: Unknown Error");
            }
        }
    };

    const handleLogoOnClick = () => {
        navigate("/", {replace: true})
    }


    return (
        <>
            {/*Navbar*/}
            <AppBar position={"fixed"} color={"primary"}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Box
                        component="img"
                        onClick={handleLogoOnClick}
                        src={Logo}
                        alt="Logo"
                        sx={{height: 40, mr: 2}}
                    />

                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        {!access_token && <TextField
                            variant={"outlined"}
                            size={"small"}
                            placeholder={"Search restaurants or dishes..."}
                            sx={{width: "50%", backgroundColor: "white", borderRadius: 1}}
                        />}

                    </Box>

                    <Box sx={{display: "flex", gap: 1}}>
                        {access_token ? <>
                                <Button color={'inherit'} sx={{border: 1, borderColor: 'white'}}
                                        onClick={handleDashboard}>Dashboard</Button>
                                <Button color={'inherit'} sx={{border: 1, borderColor: 'white'}}
                                        onClick={handleLogout}>Logout</Button>
                            </>
                            : <>
                                <Button color={'inherit'} sx={{border: 1, borderColor: 'white'}} component={Link}
                                        to={"/auth/login"}>Login</Button>
                                <Button color={'inherit'} sx={{border: 1, borderColor: 'white'}} component={Link}
                                        to={"/auth/register"}>Register</Button>
                            </>}

                    </Box>
                </Toolbar>
            </AppBar>

            {/*Page content*/}
            <Container sx={{mt: 10, mb: 8}}>
                <Outlet/>
            </Container>


        </>
    )
        ;
}


export default MainLayout;