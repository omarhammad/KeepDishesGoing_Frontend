import {AppBar, Box, Button, Container, TextField, Toolbar, Typography} from "@mui/material";
import Logo from "../assets/logo.png"
import {Link, Outlet} from "react-router-dom";

function MainLayout() {
    return (
        <>
            {/*Navbar*/}
            <AppBar position={"fixed"} color={"primary"}>
                <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Box
                        component="img"
                        src={Logo}
                        alt="Logo"
                        sx={{height: 40, mr: 2}}
                    />

                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            variant={"outlined"}
                            size={"small"}
                            placeholder={"Search restaurants or dishes..."}
                            sx={{width: "50%", backgroundColor: "white", borderRadius: 1}}
                        />

                    </Box>

                    <Box>
                        <Button color={'inherit'} component={Link} to={"/auth/login"}>Login</Button>
                        <Button color={'inherit'} component={Link} to={"/auth/register"}>Register</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/*PageContent*/}
            <Container sx={{mt: 10, mb: 8}}>
                <Outlet/>
            </Container>

            {/*Footer*/}
            <Box

                component="footer"
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    textAlign: "center",
                    py: 2,
                    width: '100%',
                    position: "fixed",
                    bottom: 0,
                    left: 0

                }}
            >
                <Typography variant="body2">
                    © 1997 Keep Dishes Going — All Rights Reserved
                </Typography>
            </Box>
        </>
    );
}


export default MainLayout;