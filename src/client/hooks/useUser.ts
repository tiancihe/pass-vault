import { useContext } from "react"

import { UserContext } from "../contexts/user"

export default function useUser() {
    const { user, setUser } = useContext(UserContext)

    return {
        isLoggedIn: Boolean(user),
        user,
        setUser
    }
}
