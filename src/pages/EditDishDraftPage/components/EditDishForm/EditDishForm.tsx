import {
    Alert,
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
import Input from "../../../../components/Input/Input.tsx";
import {Controller, useForm} from "react-hook-form";
import {type dishInterface, DishSchema} from "../../../../model/schemas/dishInterface.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import type {Dish} from "../../../../model/Dish.tsx";

import {useNavigate} from "react-router";
import {dishTypes} from "../../../../model/constants/dishTypes.tsx";
import {foodTags} from "../../../../model/constants/foodTags.tsx";


interface EditDishFormProps {
    currentData: Dish | undefined;
    onSubmit: (data: dishInterface) => void;
    isPending?: boolean;
    isError?: boolean;
    error?: Error
}

function EditDishForm({currentData, onSubmit, isPending, isError, error}: EditDishFormProps) {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: {errors}
    } = useForm<dishInterface>({
        resolver: zodResolver(DishSchema),
        defaultValues: {
            name: currentData.name,
            dishType: currentData.dishType,
            foodTags: currentData.foodTags,
            description: currentData.description,
            price: String(currentData.price),
            pictureUrl: currentData.pictureUrl,
        }
    })

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
                <Box textAlign="center">
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Edit Dish Data
                    </Typography>
                    <Divider sx={{width: "80%", mx: "auto", mb: 2}}/>
                    <Typography variant="body2" color="text.secondary">
                        Update the details below to modify your dish information.
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
                                    <Select {...field} label="Dish Type">
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

                {isError && (
                    <Alert severity="error">
                        {error?.message || "Failed to update dish."}
                    </Alert>
                )}

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
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}

export default EditDishForm;