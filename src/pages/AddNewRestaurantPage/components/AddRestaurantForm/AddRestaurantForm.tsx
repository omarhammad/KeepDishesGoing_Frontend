import {
    Alert,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {type newRestaurantInterface, newRestaurantSchema,} from "../../../../model/schemas/newRestaurantInterface.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import Input from "../../../../components/Input/Input.tsx";
import type {CreateRestaurantRequest} from "../../../../model/requests/CreateRestaurantRequest.tsx";
import {hasOwnerRestaurant, postRestaurant} from "../../../../services/restaurantService.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {clearAllTokenData} from "../../../../services/authService.tsx";


const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

function AddRestaurantForm() {


    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: {errors}
    } = useForm<newRestaurantInterface>({
        resolver: zodResolver(newRestaurantSchema)
    })

    useEffect(() => {

        (async () => {

            try {
                const hasRestaurant = await hasOwnerRestaurant();
                if (hasRestaurant) navigate("/owner/dashboard", {replace: true});

            } catch (err) {
                if (err instanceof Error) {
                    setErrorMsg(err.message);
                } else {
                    setErrorMsg("Unknown Error");
                }
            }

        })();

    }, [navigate]);

    const onSubmit = async (data: newRestaurantInterface) => {

        // TODO : MAKE A POST REQUEST TO THE /API/RESTAURANTS THEN REDIRECT IF SUCCESS TO THE DASHBOARD

        const request: CreateRestaurantRequest = {
            name: data.name,
            email: data.email,
            cuisine: data.cuisine,
            defaultPrepTime: parseInt(data.defaultPrepTime),
            resPictureUrl: data.pictureUrl,
            address: {
                street: data.street,
                number: data.number,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country
            },
            dayOpeningHoursMap: Object.fromEntries(
                Object.entries(data.dayOpeningHoursMap).map(([day, hours]) => [
                    day,
                    {
                        open: hours.open,
                        close: hours.close
                    }
                ])
            )
        };
        console.log(request)

        const response = await postRestaurant(request);
        if ("errorCode" in response) {
            if (response.errorCode === "UNAUTHORIZED") {
                clearAllTokenData()
                navigate("/", {replace: true})
            }

            setErrorMsg(response.errorMessage)
        } else {
            navigate("/owner/dashboard", {replace: true})
            console.log("Success:", response.statusMsg);
        }

    };

    return (
        <Container maxWidth="md" sx={{mt: 6, mb: 6}}>
            <Paper
                elevation={3}
                sx={{
                    p: {xs: 3, sm: 5},
                    borderRadius: 3,
                    backgroundColor: "white",
                }}>
                <Box
                    component={"form"}
                    onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={5}>
                        <Box textAlign="center">
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Add New Restaurant
                            </Typography>
                            <Divider sx={{width: "80%", mx: "auto", mb: 2}}/>
                            <Typography variant="body2" color="text.secondary">
                                Fill in the details below to create your restaurant profile.
                            </Typography>
                        </Box>

                        {/* Section 1: General Info */}
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                General Information
                            </Typography>
                            <Divider sx={{mb: 3}}/>

                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                spacing={2}
                                useFlexGap
                                flexWrap="wrap"
                            >
                                <Input<newRestaurantInterface> register={register} name={"name"} error={errors.name}
                                                               label={"Restaurant Name"} fullWidth={true}/>
                                <Input<newRestaurantInterface> register={register} name={"email"} error={errors.email}
                                                               label={"Email"} fullWidth={true} type={"email"}/>
                            </Stack>

                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                spacing={2}
                                mt={2}
                                useFlexGap
                                flexWrap="wrap"
                            >
                                <Controller
                                    name="cuisine"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <FormControl fullWidth error={!!fieldState.error}>
                                            <InputLabel id="cuisine-label">Cuisine</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="cuisine-label"
                                                label="Cuisine"
                                                sx={{backgroundColor: "white", borderRadius: 1}}
                                            >
                                                <MenuItem value="ITALIAN">Italian</MenuItem>
                                                <MenuItem value="ASIAN">Asian</MenuItem>
                                                <MenuItem value="ARABIC">Arabic</MenuItem>
                                                <MenuItem value="MEXICAN">Mexican</MenuItem>
                                                <MenuItem value="INDIAN">Indian</MenuItem>
                                                <MenuItem value="BURGER">Burger</MenuItem>
                                                <MenuItem value="FRENCH">Burger</MenuItem>
                                                <MenuItem value="JAPANESE">Burger</MenuItem>
                                                <MenuItem value="STEAKHOUSE">Burger</MenuItem>

                                            </Select>
                                            {fieldState.error && (
                                                <Typography variant="caption" color="error">
                                                    {fieldState.error.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />

                                <Input<newRestaurantInterface> register={register} name={"defaultPrepTime"}
                                                               error={errors.defaultPrepTime}
                                                               label={"Default Preparation Time (minutes)"}
                                                               type={"number"}
                                                               fullWidth={true}/>

                            </Stack>

                            <Box mt={2}>
                                <Input<newRestaurantInterface> register={register} name={"pictureUrl"}
                                                               error={errors.pictureUrl}
                                                               label={"Picture URL"}
                                                               type={"url"}
                                                               fullWidth={true}/>
                            </Box>
                        </Box>

                        {/* Section 2: Address */}
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Address
                            </Typography>
                            <Divider sx={{mb: 3}}/>
                            <Stack spacing={2}>
                                <Input<newRestaurantInterface> register={register} name={"street"}
                                                               error={errors.street}
                                                               label={"Street"}
                                                               fullWidth={true}/>
                                <Stack direction={{xs: "column", sm: "row"}} spacing={2}>

                                    <Input<newRestaurantInterface> register={register} name={"city"}
                                                                   error={errors.city}
                                                                   label={"City"}
                                                                   fullWidth={true}/>
                                    <Input<newRestaurantInterface> register={register} name={"number"}
                                                                   error={errors.number}
                                                                   label={"Number"}
                                                                   fullWidth={true}/>
                                </Stack>
                                <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                    <Input<newRestaurantInterface> register={register} name={"postalCode"}
                                                                   error={errors.postalCode}
                                                                   label={"Postal Code"}
                                                                   fullWidth={true}/>

                                    <Input<newRestaurantInterface> register={register} name={"country"}
                                                                   error={errors.country}
                                                                   label={"Country"}
                                                                   fullWidth={true}/>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Section 3: Opening Hours */}
                        <Box
                            sx={{
                                backgroundColor: "#fafafa",
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                p: 3,
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Opening Hours
                            </Typography>
                            <Divider sx={{mb: 2}}/>

                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                gap={2}
                                justifyContent="space-between"
                            >
                                {days.map((day) => (
                                    <Box
                                        key={day}
                                        sx={{
                                            flexBasis: {xs: "100%", sm: "48%", md: "30%"},
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight="bold"
                                            color="text.secondary"
                                        >
                                            {day}
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Input<newRestaurantInterface>
                                                register={register}
                                                name={`dayOpeningHoursMap.${day}.open`}
                                                label={"Open"}
                                                type={"time"}
                                                fullWidth={true}
                                                error={errors.dayOpeningHoursMap?.[day]?.open}
                                                inputLabelPropsShrink={true}
                                                inputPropsSteps={300}
                                            />

                                            <Input<newRestaurantInterface>
                                                register={register}
                                                name={`dayOpeningHoursMap.${day}.close`}
                                                label={"Close"}
                                                type={"time"}
                                                fullWidth={true}
                                                error={errors.dayOpeningHoursMap?.[day]?.close}
                                                inputLabelPropsShrink={true}
                                                inputPropsSteps={300}
                                            />
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        {/*Error*/}

                        {errorMsg && (
                            <>
                                <Divider sx={{mb: 2}}/>
                                <Alert severity="error" sx={{mb: 2}}>
                                    {errorMsg}
                                </Alert>
                                <Divider sx={{mb: 2}}/>

                            </>
                        )}

                        {/* Submit Button */}
                        <Box textAlign="center">
                            <Button
                                variant="contained"
                                type={"submit"}
                                color="primary"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.4,
                                    borderRadius: 3,
                                    fontWeight: "bold",
                                    backgroundColor: "#2e7d32",
                                    "&:hover": {backgroundColor: "#1b5e20"},
                                }}
                            >
                                Save Restaurant
                            </Button>
                        </Box>
                    </Stack>
                </Box>

            </Paper>
        </Container>
    );
}


export default AddRestaurantForm;
