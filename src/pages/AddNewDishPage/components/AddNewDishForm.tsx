import {useNavigate, useParams} from "react-router";
import {usePostNewDishDraft} from "../../../hooks/DishesHooks.tsx";
import {Controller, useForm} from "react-hook-form";
import {type dishInterface, DishSchema} from "../../../model/schemas/dishInterface.tsx";
import type {Dish} from "../../../model/Dish.tsx";

import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Typography
} from "@mui/material";
import Input from "../../../components/Input/Input.tsx";
import {dishTypes} from "../../../model/constants/dishTypes.tsx";
import {foodTags} from "../../../model/constants/foodTags.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import Toast from "../../../components/Toast/Toast.tsx";
import type {ToastData} from "../../RestaurantDashboardPage/RestaurantDashboardPage.tsx";

function AddNewDishForm() {
    const {restaurantId} = useParams();
    const navigate = useNavigate();
    const [hasSaveTriggerd, setHasSaveTriggerd] = useState(false)
    const [toast, setToast] = useState<ToastData>({
        open: false,
        message: "",
        severity: "success"
    });
    const {isError, isPending, error, postNewDishDraftMutation} = usePostNewDishDraft();
    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<dishInterface>({
        resolver: zodResolver(DishSchema),
        defaultValues: {
            name: "",
            dishType: "",
            foodTags: [],
            description: "",
            pictureUrl: "",
            price: 0.0
        }
    })

    useEffect(() => {
        if (!hasSaveTriggerd) return;

        const handleAfterSave = async () => {
            if (!isPending && !isError && error == null) {
                setHasSaveTriggerd(false)
                setToast({
                    open: true,
                    severity: 'success',
                    message: "new dish added"
                })
                await new Promise(resolve => setTimeout(resolve, 2000))
                navigate("/owner/dashboard")

            }
            if (isError) {
                setHasSaveTriggerd(false)
                setToast({
                    open: true,
                    severity: 'error',
                    message: error?.message ?? "Unknow message while saving new dish"
                })
            }
        }
        handleAfterSave();
    }, [navigate, isError, isPending, error, hasSaveTriggerd, setHasSaveTriggerd]);


    const onSubmit = (data: dishInterface) => {
        const request: Dish = {
            name: data.name,
            dishType: data.dishType,
            foodTags: data.foodTags,
            description: data.description,
            price: parseFloat(data.price),
            pictureUrl: data.pictureUrl
        }

        console.log(request)
        console.log(restaurantId)
        postNewDishDraftMutation({restaurantId: restaurantId, request: request});
        setHasSaveTriggerd(true)


    };


    return (
        <>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={5}>
                    <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            New Dish Draft
                        </Typography>
                        <Divider sx={{width: "80%", mx: "auto", mb: 2}}/>
                        <Typography variant="body2" color="text.secondary">
                            enter the details below to create new dish.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Basic Information
                        </Typography>
                        <Divider sx={{mb: 3}}/>

                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            spacing={2}
                            mt={2}
                            useFlexGap
                            flexWrap="wrap"
                        >
                            <Input<dishInterface>
                                register={register}
                                name="name"
                                label="Dish Name"
                                error={errors.name}
                                fullWidth
                            />

                            <Controller
                                name="dishType"
                                control={control}
                                rules={{required: "Dish type is required"}}
                                render={({field}) => (
                                    <FormControl fullWidth error={!!errors.dishType}>
                                        <InputLabel>Dish Type</InputLabel>
                                        <Select
                                            {...field}
                                            label="Dish Type">
                                            {dishTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.dishType?.message?.toString()}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            />

                            <Controller
                                name="foodTags"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth error={!!errors.foodTags}>
                                        <InputLabel>Food Tags</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            value={field.value ?? []}
                                            input={<OutlinedInput label="Food Tags"/>}
                                            renderValue={(selected) => (selected as string[]).join(", ")}
                                        >
                                            {foodTags.map((tag) => (
                                                <MenuItem key={tag} value={tag}>
                                                    <Checkbox
                                                        checked={(field.value || []).includes(tag)}
                                                    />
                                                    {tag}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.foodTags?.message?.toString()}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Details
                        </Typography>
                        <Divider sx={{mb: 3}}/>

                        <Stack spacing={2}>
                            <Input<dishInterface>
                                register={register}
                                name="description"
                                label="Description"
                                error={errors.description}
                                fullWidth
                                inputLabelPropsShrink
                            />

                            <Input<dishInterface>
                                register={register}
                                name="price"
                                label="Price (€)"
                                type="number"
                                error={errors.price}
                                fullWidth
                                inputPropsSteps={0.01}
                                inputLabelPropsShrink
                            />

                            <Input<dishInterface>
                                register={register}
                                name="pictureUrl"
                                label="Picture URL"
                                type="url"
                                error={errors.pictureUrl}
                                fullWidth
                                inputLabelPropsShrink
                            />
                        </Stack>
                    </Box>

                    <Box textAlign="center" display="flex" justifyContent="center" gap={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.4,
                                borderRadius: 3,
                                fontWeight: "bold",
                            }}
                            onClick={() => navigate("/owner/dashboard")}
                        >
                            Return
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isPending}
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.4,
                                borderRadius: 3,
                                fontWeight: "bold",
                            }}
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>
                </Stack>
                <Toast open={toast.open} message={toast.message} severity={toast.severity}
                       onClose={() => setToast(prev => ({...prev, open: false}))}/>
            </Box>
        </>
    )
}

export default AddNewDishForm;