import request from "./request"

import { Item, ItemInfo, SaveItemPayload } from "../../types/item"

export function getItems() {
    return request<ItemInfo[]>("/items")
}

export function getItem(name: string) {
    return request<Item>(`/items/${name}`)
}

export function saveItem(payload: SaveItemPayload) {
    return request<Item>("/items/save", {
        method: "POST",
        body: payload
    })
}
