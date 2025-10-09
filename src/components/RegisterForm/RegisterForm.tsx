import {Alert, Box, Button, Container, Typography,} from "@mui/material";
import {useForm} from "react-hook-form";
import {type registerInterface, RegisterSchema} from "../../model/schemas/registerInterface.tsx";
import Input from "../Input/Input.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import type {RegisterOwnerRequest} from "../../model/requests/RegisterOwnerRequest.tsx";
import {useEffect, useState} from "react";
import {getJwtTokenValue, getUserId, postRegister, saveJwtData} from "../../services/authService.tsx";
import {useNavigate} from "react-router";
import {getRestaurantByOwnerId} from "../../services/restaurantService.tsx";


function RegisterForm() {

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<registerInterface>({resolver: zodResolver(RegisterSchema)});
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [registered, setRegistered] = useState<boolean>(false)

    const navigate = useNavigate();

    useEffect(() => {
        const tokenValue = getJwtTokenValue();

        if (!tokenValue) return;

        const userId = getUserId();

        (async () => {
            const restaurant = await getRestaurantByOwnerId(userId!);

            if (restaurant) {
                navigate("/owner/dashboard");
            } else {
                navigate("/owner/restaurants/add")
            }

        })();
    }, [registered, navigate]);


    const onSubmit = async (data: registerInterface) => {
        const requestBody: RegisterOwnerRequest = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            username: data.username,
            password: data.password
        }
        try {
            const jwtDTO = await postRegister(requestBody);
            saveJwtData(jwtDTO)
            setRegistered(true)
        } catch (err) {
            if (err instanceof Error) {
                setErrorMsg(err.message);
            }
        }
    }

    return (
        <Container maxWidth="sm" sx={{mt: 8}}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete="off"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 4,
                    backgroundColor: "white",

                }}
            >
                <Typography variant="h5" textAlign="center" fontWeight="bold">
                    Create an Account
                </Typography>

                {errorMsg && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {errorMsg}
                    </Alert>
                )}

                <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
                    <Input<registerInterface> register={register} name={"firstName"} error={errors.firstName}
                                              label={"First Name"}/>
                    <Input<registerInterface> register={register} name={"lastName"} error={errors.lastName}
                                              label={"Last Name"}/>
                </Box>
                <Input<registerInterface> register={register} name={"username"} error={errors.username}
                                          label={"Username"}/>
                <Input<registerInterface> register={register} name={"email"} error={errors.email} label={"Email"}
                                          type={"email"}/>
                <Input<registerInterface> register={register} name={"phoneNumber"} error={errors.phoneNumber}
                                          label={"Phone Number"} type={"tel"}/>
                <Input<registerInterface> register={register} name={"password"} error={errors.password}
                                          label={"Password"} type={"password"}/>
                <Input<registerInterface> register={register} name={"passwordConfirmation"}
                                          error={errors.passwordConfirmation}
                                          label={"Confirm Password"} type={"password"}/>

                <Button type={"submit"} variant="contained" color="primary"
                        size="large">
                    Register
                </Button>
            </Box>
        </Container>
    );
}


export default RegisterForm;
