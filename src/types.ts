export type User = string;

/**
 * Secret for simple-encryptor
 * @see https://www.npmjs.com/package/simple-encryptor
 */
export type Secret = string;

export interface KVPairs {
    [key: string]: string;
}
