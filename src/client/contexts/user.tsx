import React, { createContext, useState, useMemo, useEffect } from "react"

import { IUser } from "../../types"
import { getCurrentUser } from "../services/user"

export const UserContext = createContext(null as {
    user: IUser
    setUser: React.Dispatch<IUser>
})

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState("" as IUser)

    useEffect(() => {
        const init = async () => {
            const res = await getCurrentUser()
            if (res.success) {
                setUser(res.data.user)
            }
        }
        init()
    }, [])

    const value = useMemo(() => ({ user, setUser }), [user])

    return <UserContext.Provider value={value} children={children} />
}
