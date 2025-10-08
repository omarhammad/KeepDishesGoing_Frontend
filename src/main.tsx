import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {createTheme, ThemeProvider} from "@mui/material/styles";

import './index.css'
import App from './App.tsx'


// Takeaway-style theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#087135",
        },
        secondary: {
            main: "#000000",
        },
        background: {
            default: "#ffffff",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});


createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <StrictMode>
            <App/>
        </StrictMode>,
    </ThemeProvider>
)
