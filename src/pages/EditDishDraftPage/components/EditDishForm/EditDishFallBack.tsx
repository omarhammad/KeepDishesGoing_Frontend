import {Box, Button, Container, Paper, Typography} from "@mui/material";
import {FormSkeleton} from "../../../../components/FormSkeleton/FormSkeleton.tsx";


interface EditDishFallbackProps {
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    children: React.ReactNode
}

function EditDishFallBack({isLoading, isError, onRetry, children}: EditDishFallbackProps) {
    return (
        <Container maxWidth="md" sx={{mt: 6, mb: 6}}>
            <Paper
                elevation={3}
                sx={{
                    p: {xs: 3, sm: 5},
                    borderRadius: 3,
                    backgroundColor: "white",
                }}
            >
                {isLoading && <FormSkeleton/>}
                {(!isLoading && !isError) && children}
                {isError && <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Something went wrong while loading the dish.
                    </Typography>
                    {onRetry && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onRetry}
                            sx={{mt: 2}}
                        >
                            Try Again
                        </Button>
                    )}
                </Box>}
            </Paper>
        </Container>
    );
}

export default EditDishFallBack;
