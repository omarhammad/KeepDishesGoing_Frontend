import {Box, Button, Container, TextField, Typography} from '@mui/material';

function LoginForm() {

    return (
        <>
            <Container maxWidth={"sm"} sx={{mt: 8}}>
                <Box
                    component={'form'}
                    noValidate
                    autoComplete={'off'}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 4,
                    }}
                >
                    <Typography variant="h5" textAlign="center" fontWeight="bold">Login</Typography>
                    <TextField label={"username"} name={"username"}/>
                    <TextField label={"password"} name={"password"}/>
                    <Button variant="contained" color={"primary"} size={"large"}>Login</Button>
                </Box>

            </Container>
        </>
    );

}

export default LoginForm;