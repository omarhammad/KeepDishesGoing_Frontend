import {TextField} from "@mui/material";
import type {FieldError, FieldValues, Path, UseFormRegister} from "react-hook-form";
import type {ReactNode} from "react";

interface InputProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    name: Path<T>;
    label?: string;
    type?: string;
    error?: FieldError;
    fullWidth?: boolean;
    inputLabelPropsShrink?: boolean;
    inputPropsSteps?: number;
    select?: boolean;
    children?: ReactNode;
}

function Input<T extends FieldValues>({
                                          register,
                                          label,
                                          name,
                                          type = "text",
                                          error,
                                          fullWidth,
                                          inputLabelPropsShrink,
                                          inputPropsSteps,
                                          select = false,
                                          children,
                                      }: InputProps<T>) {
    return (
        <TextField
            {...register(name)}
            error={!!error}
            label={label ?? name}
            name={name}
            type={type}
            fullWidth={fullWidth}
            helperText={error?.message}
            InputLabelProps={{shrink: inputLabelPropsShrink}}
            inputProps={{step: inputPropsSteps}}
            select={select} // 👈 this enables dropdown behavior
        >
            {select && children}
        </TextField>
    );
}

export default Input;
