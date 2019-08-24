import React, { createContext, useState, useEffect, useMemo } from "react"

import useUser from "../hooks/useUser"
import { getUserSetting } from "../services/user"

import { IUserSetting } from "../../types"

export const SettingContext = createContext(null as {
    setting: IUserSetting
    setSetting: React.Dispatch<IUserSetting>
})

export function SettingProvider({ children }: { children: React.ReactNode }) {
    const [setting, setSetting] = useState<IUserSetting>({
        defaultInvisible: [],
        autoBackup: false
    })
    const { isLoggedIn } = useUser()

    useEffect(() => {
        const init = async () => {
            const res = await getUserSetting()
            setSetting(res.data)
        }
        if (isLoggedIn) init()
    }, [])

    const value = useMemo(() => ({ setting, setSetting }), [setting])

    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    )
}
