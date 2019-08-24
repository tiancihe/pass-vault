import { useContext } from "react"

import { SettingContext } from "../contexts/setting"

export default function useSetting() {
    return useContext(SettingContext)
}
