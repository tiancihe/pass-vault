import React, { createContext, useState, useMemo, useEffect } from "react"

import { Auth } from "../../types/auth"
import { getCurrentUser } from "../services/auth"

export const AuthContext = createContext(null as {
    auth: Auth
    setAuth: React.Dispatch<Auth>
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState({} as Auth)

    useEffect(() => {
        const init = async () => {
            const res = await getCurrentUser()
            if (res.success) {
                setAuth({
                    ...auth,
                    name: res.data.name
                })
            }
        }
        init()
    }, [])

    const value = useMemo(() => ({ auth, setAuth }), [auth])

    return <AuthContext.Provider value={value} children={children} />
}
