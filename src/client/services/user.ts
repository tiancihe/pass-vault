import request from "./request"

import {
    IUser,
    ILoginPayload,
    ILoginResponseData,
    IUserSetting
} from "../../types"

export function getCurrentUser() {
    return request<{ user: IUser }>("/current-user")
}

export function login({ name, password }: ILoginPayload) {
    return request<ILoginResponseData>("/login", {
        method: "POST",
        body: {
            name,
            password
        }
    })
}

export function logout() {
    return request("/logout", {
        method: "POST"
    })
}

export function getUserSetting() {
    return request<IUserSetting>("/setting")
}

export function setUserSetting(payload: Partial<IUserSetting>) {
    return request<IUserSetting>("/setting", {
        method: "POST",
        body: payload
    })
}

export function getBackups() {
    return request<string[]>("/backups")
}

export function backup() {
    return request("/backup", {
        method: "POST"
    })
}

export function deleteBackup(name: string) {
    return request(`/backup/${name}`, {
        method: "DELETE"
    })
}

export function restoreBackup(name: string) {
    return request("/restore", {
        method: "POST",
        body: {
            name
        }
    })
}
