import { notification } from "antd"

import { BASE_URL } from "./constants"

notification.config({
    duration: 1
})

interface IRequestOptions extends RequestInit {
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: any
}

interface IResponse<T = any> {
    success: boolean
    data?: T
    msg?: string
}

export default async function request<T = any>(
    url: string,
    options = {} as IRequestOptions
): Promise<IResponse<T>> {
    try {
        const { method = "GET", body } = options
        const requestInit: RequestInit = {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            method
        }
        if (body) requestInit.body = JSON.stringify(body)

        const res = await fetch(`${BASE_URL}${url}`, requestInit)
        const json = (await res.json()) as Pick<IResponse<T>, "data" | "msg">

        switch (res.status) {
            case 200: {
                if (method !== "GET") {
                    notification.success({
                        message: json.msg
                    })
                }
                return {
                    data: json.data,
                    success: true
                }
            }
            default: {
                notification.error({
                    message: json.msg
                })
                return {
                    success: false
                }
            }
        }
    } catch (error) {
        console.error(error)
        return {
            success: false
        }
    }
}
