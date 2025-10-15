import {Alert, Snackbar} from "@mui/material";
import * as React from "react";

export type ToastProps = {
    open: boolean;
    message: string;
    severity: "success" | "info" | "error",
    onClose: () => void
}

function Toast({open, message, severity, onClose}: ToastProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={2500}
            onClose={onClose}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        >
            <Alert
                severity={severity}
                variant="filled"
                onClose={onClose}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Toast;