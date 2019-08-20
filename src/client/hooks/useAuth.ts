import { useContext } from "react"

import { AuthContext } from "../contexts/auth"

export default function useAuth() {
    const { auth, setAuth } = useContext(AuthContext)

    return {
        isLoggedIn: Boolean(auth.name),
        auth,
        setAuth
    }
}
