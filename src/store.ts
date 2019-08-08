import path from "path";

import Encryptor from "simple-encryptor";

import FS from "./fs";
import { User, Secret, KVPairs } from "./types";
import { throwNotLoggedIn, throwIncorrectSecret } from "./utils";

export type StoreDataItemName = string;

export interface IStoreDataItem extends KVPairs {
    name: StoreDataItemName;
    created_at: string;
    updated_at: string;
}

export type StoreData = IStoreDataItem[];

export interface IStore {
    data: StoreData;
    created_at: string;
    updated_at: string;
}

class Store {
    private secretPath: string
    private storePath: string

    constructor(private user: User) {
        this.secretPath = path.resolve(__dirname, `.${this.user}.secret`)
        this.storePath = path.resolve(__dirname, `${this.user}.store.json`)
    }

    static genEmptyStore() {
        return {
            data: [],
            created_at: new Date().toLocaleString(),
            updated_at: ""
        } as IStore
    }

    private get secret() {
        const secret = FS.read(this.secretPath)
        if(!secret) {
            throwNotLoggedIn()
        }
        return secret
    }

    private get encryptor() {
        return Encryptor(this.secret)
    }

    init(secret: Secret) {
        FS.write(
            this.secretPath,
            secret
        )

        if(!FS.exists(this.storePath)) {
            FS.write(
                this.storePath,
                this.encryptor.encrypt(Store.genEmptyStore())
            )
        }
    }

    /** reset() does not remove user's store file, only secret file. */
    reset() {
        FS.rm(this.secretPath)
    }

    read() {
        const store = this.encryptor.decrypt(FS.read(this.storePath)) as IStore

        if(!store) {
            throwIncorrectSecret()
        }
        
        return store
    }

    write(store: IStore) {
        FS.write(
            this.storePath,
            this.encryptor.encrypt({
                ...store,
                updated_at: new Date().toLocaleString()
            } as IStore)
        )
    }
}

export default Store
