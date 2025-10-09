import {getJwtTokenValue} from "../../services/authService.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router";

interface AuthGardProps {
    children: React.ReactNode
}

function AuthGuard({children}: AuthGardProps) {

    const navigate = useNavigate();
    const tokenValue = getJwtTokenValue();
    useEffect(() => {

        if (tokenValue) return

        navigate("/auth/login", {replace: true})

    }, [tokenValue, navigate]);


    return (
        <>
            {children}
        </>
    )
}

export default AuthGuard;