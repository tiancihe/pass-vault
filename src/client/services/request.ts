import { notification } from "antd"

import { BASE_URL } from "./constants"

type Method = "GET" | "POST" | "PUT" | "DELETE"

interface RequestOptions extends RequestInit {
    method?: Method
    body?: any
}

interface Response<T = any> {
    success: boolean
    data?: T
    msg?: string
}

notification.config({
    duration: 1
})

export default async function request<T = any>(
    url: string,
    options = {} as RequestOptions
): Promise<Response<T>> {
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
        const json = (await res.json()) as Pick<Response<T>, "data" | "msg">

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
