import {Alert, Box, Button, Container, Typography} from '@mui/material';
import {useForm} from "react-hook-form";
import {type loginInterface, loginSchema} from "../../model/schemas/loginInterface.tsx";
import Input from "../Input/Input.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import type {LoginOwnerRequest} from "../../model/requests/LoginOwnerRequest.tsx";
import {getJwtTokenValue, postLogin, saveJwtData} from "../../services/authService.tsx";
import {useNavigate} from "react-router";
import {hasOwnerRestaurant} from "../../services/restaurantService.tsx";

function LoginForm() {


    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<loginInterface>({resolver: zodResolver(loginSchema)});
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenValue = getJwtTokenValue();

        if (!tokenValue) return;

        (async () => {

            try {
                const hasRestaurant = await hasOwnerRestaurant();
                if (hasRestaurant) {
                    navigate("/owner/dashboard");
                } else {
                    navigate("/owner/restaurants/add");

                }
            } catch (err) {
                if (err instanceof Error) {
                    setErrorMsg(err.message);
                } else {
                    setErrorMsg("Unexpected Error")
                }
            }

        })();

    }, [isLoggedIn, navigate]);


    const onSubmit = async (data: loginInterface) => {
        const loginRequest: LoginOwnerRequest = {
            username: data.username,
            password: data.password,

        }
        try {
            const jwtDTO = await postLogin(loginRequest);
            saveJwtData(jwtDTO)
            setIsLoggedIn(true)
        } catch (err) {
            if (err instanceof Error) {
                setErrorMsg(err.message)
            }
        }
    }

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
            }}
        >
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 4,
                    backgroundColor: "white",
                    width: "100%",          // ensures full width within container
                    maxWidth: 400,          // optional, keeps form compact
                }}
            >
                <Typography variant="h5" textAlign="center" fontWeight="bold">
                    Login
                </Typography>

                {errorMsg && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {errorMsg}
                    </Alert>
                )}

                <Input<loginInterface> register={register} name="username" label="username" error={errors.username}/>
                <Input<loginInterface> register={register} name="password" label="password" error={errors.password}
                                       type="password"/>

                <Button type="submit" variant="contained" color="primary" size="large">
                    Login
                </Button>
            </Box>
        </Container>

    );

}

export default LoginForm;