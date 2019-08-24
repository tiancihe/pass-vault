import request from "./request"

import {
    IStoreDataItem,
    IStoreDataItemInfo,
    IStoreDataItemName
} from "../../types"

export function getItems() {
    return request<IStoreDataItemInfo[]>("/items")
}

export function getItem(name: IStoreDataItemName) {
    return request<IStoreDataItem>(`/items/${name}`)
}

export function saveItem(payload: { name: IStoreDataItemName }) {
    return request<IStoreDataItem>("/items/save", {
        method: "POST",
        body: payload
    })
}
