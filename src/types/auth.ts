export type User = string

/** @see https://www.npmjs.com/package/simple-encryptor */
export type Secret = string

export interface IAppState {
    user: User
    secret: Secret
}

export interface Auth {
    name: string
    password?: string
}
