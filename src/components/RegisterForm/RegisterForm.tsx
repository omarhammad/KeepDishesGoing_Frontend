import {Alert, Box, Button, Container, Typography,} from "@mui/material";
import {useForm} from "react-hook-form";
import {type registerInterface, RegisterSchema} from "../../model/schemas/registerInterface.tsx";
import Input from "../Input/Input.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import type {RegisterOwnerRequest} from "../../model/requests/RegisterOwnerRequest.tsx";
import {useState} from "react";
import {postRegister} from "../../services/authService.tsx";
import type {JwtDTO} from "../../model/responseDtos/JwtDTO.tsx";


function RegisterForm() {


    const [errorMsg, setErrorMsg] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<registerInterface>({resolver: zodResolver(RegisterSchema)})

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
            setErrorMsg("");

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
                    <Input register={register} name={"firstName"} error={errors.firstName} label={"First Name"}/>
                    <Input register={register} name={"lastName"} error={errors.lastName} label={"Last Name"}/>
                </Box>
                <Input register={register} name={"username"} error={errors.username} label={"Username"}/>
                <Input register={register} name={"email"} error={errors.email} label={"Email"} type={"email"}/>
                <Input register={register} name={"phoneNumber"} error={errors.phoneNumber} label={"Phone Number"}
                       type={"tel"}/>
                <Input register={register} name={"password"} error={errors.password} label={"Password"}
                       type={"password"}/>
                <Input register={register} name={"passwordConfirmation"} error={errors.passwordConfirmation}
                       label={"Confirm Password"}
                       type={"password"}/>

                <Button type={"submit"} variant="contained" color="primary"
                        size="large">
                    Register
                </Button>
            </Box>
        </Container>
    );
}


function saveJwtData(jwtDTO: JwtDTO) {
    localStorage.setItem("accessToken", jwtDTO.accessToken)
    localStorage.setItem("userId", jwtDTO.userId)
    localStorage.setItem("username", jwtDTO.username)
}

export default RegisterForm;
