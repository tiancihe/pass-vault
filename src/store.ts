import path from "path"

import Encryptor from "simple-encryptor"

import FS from "./fs"
import { User, Secret } from "./types/auth"
import { IStore } from "./types/store"
import { KVPairs } from "./types"

class Store {
    constructor(private user: User, private secret: Secret) {
        this.init()
    }

    get storeFile() {
        return `${this.user}.store.json`
    }

    get storePath() {
        return path.resolve(__dirname, this.storeFile)
    }

    static genEmptyStore() {
        return {
            data: [],
            created_at: new Date().toString(),
            updated_at: ""
        } as IStore
    }

    private get encryptor() {
        return Encryptor(this.secret)
    }

    init() {
        if (!FS.exists(this.storePath)) {
            FS.write(
                this.storePath,
                this.encryptor.encrypt(Store.genEmptyStore())
            )
        }
    }

    read() {
        const store = this.encryptor.decrypt(FS.read(this.storePath)) as IStore

        if (!store) {
            throw new Error("Your secret is not correct.")
        }

        return store
    }

    write(store: IStore) {
        FS.write(
            this.storePath,
            this.encryptor.encrypt({
                ...store,
                updated_at: new Date().toString()
            } as IStore)
        )
    }

    save(name: string, KVPairs: KVPairs) {
        const store = this.read()
        const index = store.data.findIndex(item => item.name === name)
        const exists = index >= 0

        if (!exists) {
            store.data.push({
                name,
                created_at: new Date().toString(),
                updated_at: "",
                ...KVPairs
            })
        } else {
            store.data[index] = {
                ...store.data[index],
                ...KVPairs,
                updated_at: new Date().toString()
            }
        }

        this.write(store)
    }

    find(name: string) {
        return this.read().data.find(item => item.name === name)
    }

    list() {
        return this.read().data.map(item => ({
            name: item.name,
            created_at: item.created_at,
            updated_at: item.updated_at
        }))
    }

    genBackupName() {
        return `${this.storeFile}-${Date.now()}`
    }

    /** backup the encrypted store file to dir */
    backup(dir: string, { fileName } = {} as { fileName?: string }) {
        FS.cp(
            this.storePath,
            path.resolve(dir, fileName || this.genBackupName())
        )
    }

    /** restore store from path (must be a backup file) */
    restore(path: string) {
        FS.cp(path, this.storePath)
    }

    export(dir: string, { fileName } = {} as { fileName?: string }) {
        FS.write(
            path.resolve(dir, fileName || this.storeFile),
            JSON.stringify(this.read(), null, 2)
        )
    }
}

export default Store
