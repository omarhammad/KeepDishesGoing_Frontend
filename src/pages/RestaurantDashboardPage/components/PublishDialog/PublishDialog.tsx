import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {useState} from "react";

interface PublishDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (mode: "now" | "schedule", time?: string) => void; // time in HH:MM
}

export default function PublishDialog({open, onClose, onConfirm}: PublishDialogProps) {
    const [mode, setMode] = useState<"now" | "schedule">("now");

    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    const [time, setTime] = useState<string>(localISOTime);


    const handleConfirm = () => {
        if (mode === "now") onConfirm("now");
        else onConfirm("schedule", time);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Publish All</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{mt: 1}}>
                    <ToggleButtonGroup
                        exclusive
                        color="primary"
                        value={mode}
                        onChange={(_, val) => val && setMode(val)}
                    >
                        <ToggleButton value="now">Now</ToggleButton>
                        <ToggleButton value="schedule">Schedule</ToggleButton>
                    </ToggleButtonGroup>

                    {mode === "schedule" && (
                        <TextField
                            label="Select date & time"
                            type="datetime-local"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            InputLabelProps={{shrink: true}}
                            inputProps={{
                                step: 300,
                                min: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .slice(0, 16),
                            }}
                            fullWidth
                        />

                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">Cancel</Button>
                <Button onClick={handleConfirm} variant="contained">OK</Button>
            </DialogActions>
        </Dialog>
    );
}

