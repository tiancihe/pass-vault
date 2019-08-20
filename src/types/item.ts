import { KVPairs } from "."

export interface ItemInfo {
    name: string
    created_at: string
    updated_at: string
}

export type Item = ItemInfo & KVPairs

export interface SaveItemPayload extends KVPairs {
    name: string
}
