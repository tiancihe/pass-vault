export type IUser = string

/** @see https://www.npmjs.com/package/simple-encryptor */
export type ISecret = string

export interface ILoginPayload {
    name: IUser
    password: ISecret
}

export type ILoginResponseData = Pick<IStore, "created_at" | "updated_at">

export interface IUserSetting {
    /** @description Fields invisible by default, like */
    defaultInvisible: string[]
    autoBackup: boolean
}

export interface IAppState {
    user: IUser
    secret: ISecret
}

export type IStoreDataItemName = string

export interface IStoreDataItemInfo {
    name: IStoreDataItemName
    created_at: string
    updated_at: string
}

export type IStoreDataItem = IStoreDataItemInfo & IKVPairs

export interface IStore {
    data: IStoreDataItem[]
    created_at: string
    updated_at: string
}

export interface IKVPairs {
    [key: string]: string
}
