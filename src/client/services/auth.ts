import request from "./request"

export function getCurrentUser() {
    return request<{ name: string }>("/current-user")
}

export function login({ name, password }: { name: string; password: string }) {
    return request<{ created_at: string; updated_at: string }>(`/login`, {
        method: "POST",
        body: {
            name,
            password
        }
    })
}

export function logout() {
    return request(`/logout`, {
        method: "POST"
    })
}
