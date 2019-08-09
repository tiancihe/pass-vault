import path from "path"

import FS from "./fs"
import Store from "./store"

const USER = "test"
const SECRET = "abcdefghijklmnopqrst"
const ITEM_1_NAME = "foo"
const ITEM_1 = {
    name: ITEM_1_NAME,
    account: "foo@bar.baz",
    password: "foobarbaz"
}
const ITEM_1_URL = "https://foo.bar"
const ITEM_2_NAME = "bar"
const ITEM_2 = {
    name: ITEM_2_NAME,
    account: "bar@baz.foo",
    password: "barbazfoo"
}

const store = new Store(USER, SECRET)

const DIR = path.resolve(__dirname, "..")
const BACKUP = store.genBackupName()
const BACKUP_PATH = path.resolve(DIR, BACKUP)
const UNENCRYPTED = "uncrypted.json"
const UNENCRYPTED_PATH = path.resolve(DIR, UNENCRYPTED)

describe("Store", () => {
    afterAll(() => {
        FS.rm(store.storePath)
        FS.rm(BACKUP_PATH)
        FS.rm(UNENCRYPTED_PATH)
    })

    it("should be readable", () => {
        expect(store.read()).toBeTruthy()
    })

    it("should be able to save items and find them afterwards", () => {
        store.save(ITEM_1_NAME, ITEM_1)
        const item_1 = store.find(ITEM_1_NAME)
        
        expect(item_1.account === ITEM_1.account).toBeTruthy()
        expect(item_1.password === ITEM_1.password).toBeTruthy()
        
        expect(item_1.created_at).toBeTruthy()
        expect(item_1.updated_at).toBeFalsy()

        store.save(ITEM_2_NAME, ITEM_2)
        const item_2 = store.find(ITEM_2_NAME)

        expect(item_2.account === ITEM_2.account).toBeTruthy()
        expect(item_2.password === ITEM_2.password).toBeTruthy()
        
        expect(item_2.created_at).toBeTruthy()
        expect(item_2.updated_at).toBeFalsy()
    })

    it("should update an item if it already exists when save", () => {
        const itemBeforeUpdate = store.find(ITEM_1_NAME)
        store.save(ITEM_1_NAME, {
            url: ITEM_1_URL
        })
        const itemAfterUpdate = store.find(ITEM_1_NAME)

        expect(itemAfterUpdate.url === ITEM_1_URL)

        expect(itemBeforeUpdate.created_at === itemAfterUpdate.created_at).toBeTruthy()
        expect(itemBeforeUpdate.updated_at === itemAfterUpdate.updated_at).toBeFalsy()
    })

    it("should backup and restore correctly", () => {
        store.backup(DIR, { fileName: BACKUP })
        store.restore(BACKUP_PATH)

        expect(store.read()).toBeTruthy()
    })

    it("should export uncrypted successfully", () => {
        store.export(DIR, { fileName: UNENCRYPTED })

        expect(JSON.parse(FS.read(UNENCRYPTED_PATH))).toMatchObject(store.read())
    })
})
