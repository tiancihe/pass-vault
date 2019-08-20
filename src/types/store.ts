import { Item } from "./item"

export interface IStore {
    data: Item[]
    created_at: string
    updated_at: string
}
