import {TextField} from "@mui/material";
import type {FieldError, Path, UseFormRegister} from "react-hook-form";
import type {registerInterface} from "../../model/schemas/registerInterface.tsx";

interface InputProps {
    register: UseFormRegister<registerInterface>
    name: Path<registerInterface>,
    label?: string
    type?: string
    error?: FieldError
}

function Input({register, label, name, type = "text", error}: InputProps) {
    return (
        <TextField
            {...register(name)}
            error={!!error}
            label={label ?? name}
            name={name}
            type={type}
            helperText={error?.message}
        />
    )
}

export default Input