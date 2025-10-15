import AddNewDishForm from "./components/AddNewDishForm.tsx";
import {Container, Paper} from "@mui/material";

function AddNewDishPage() {
    return (
        <div>
            <Container maxWidth="md" sx={{mt: 6, mb: 6}}>
                <Paper
                    elevation={3}
                    sx={{
                        p: {xs: 3, sm: 5},
                        borderRadius: 3,
                        backgroundColor: "white",
                    }}
                >
                    <AddNewDishForm/>
                </Paper>
            </Container>
        </div>)
}

export default AddNewDishPage;