import path from "path"
import os from "os"
import cp from "child_process"

import open from "open"

import AppState from "./app-state"
import Store from "./store"
import { generatePassword, argsToKVPairs, copyToClipboard } from "./utils"
import { SERVER_PORT } from "./constants"

export default class App {
    static readonly VERSION = "0.4.0"

    static readonly HELP_INFO = `
pass-vault
    version: ${App.VERSION}

Usage:
    -v | --version
        Print version.
    -h | --help
        Print help.
    ui
        Open GUI using default browser
    gen
        -t | --type
            default to 1
            0: includes only numbers
            1: includes numbers and characters
        -l | --length
            default to 8
    login [name] [secret]
        PassVault will create different store files named USER.store.json for each USER.
        Secret is your encryption key, at least 4 characters, required.
        Note that:
            PassVault will try to repeate your secret until 16 characters long.
            This is because the encryptor used internally requires a key at least 16 characters long.

Usage after logged in:
    logout
    save [name]
        --[key] [value]
        e.g. pass save gmail --account lorem@gmail.com --password loremipsum
    find [name]
        e.g. pass find gmail
    clip [name] [key]
        e.g. pass clip gmail password
        This will copy gmail's ([name]) password ([key]) to clipboard.
    list
        Print all your saved items' name.
    backup
        Backup your store file (encrypted) to cwd (current working directory).
        Note that:
            Your backup file will have a format like this:
            USER.store.json-TIMESTAMP
            Please keep this format untouched.
    restore [file]
        Restore your store from a backup file.
        Note that: you should provide a relative path. e.g. USER.store.json-TIMESTAMP
    export
        Export your secrets (unencrypted) to cwd, use with caution.
`

    private appState = new AppState()

    constructor(private args: string[], private cwd: string) {}

    private get store() {
        return new Store(this.appState.state.user, this.appState.state.secret)
    }

    run() {
        const firstArg = this.args[0]

        switch (firstArg) {
            case "-h":
            case "--help": {
                console.log(App.HELP_INFO)
                break
            }
            case "-v":
            case "--version": {
                console.log(`pass-vault: ${App.VERSION}`)
                break
            }
            case "gen": {
                const kvPairs = argsToKVPairs(this.args.slice(1))
                console.log(
                    copyToClipboard(
                        generatePassword({
                            type:
                                Number(kvPairs.t || kvPairs.type) || undefined,
                            length:
                                Number(kvPairs.l || kvPairs.length) || undefined
                        })
                    )
                )
                break
            }
            case "login": {
                const user = this.args[1]
                const secret = this.args[2]

                if (!user || !secret) {
                    throw new Error("Please provide your name and secret.")
                }

                if (secret.length < 4) {
                    throw new Error("Secret must be at least 4 characters.")
                }

                this.appState.setState({
                    user,
                    secret:
                        secret.length < 16
                            ? secret.repeat(Math.ceil(16 / secret.length))
                            : secret
                })
                const store = this.store.read()
                console.log(`Logged in as ${user}.`)
                console.log(
                    `Store is created at: ${new Date(
                        store.created_at
                    ).toLocaleString()}`
                )
                if (store.updated_at)
                    console.log(
                        `Store is updated at: ${new Date(
                            store.updated_at
                        ).toLocaleString()}`
                    )
                break
            }
            case "ui": {
                open(`http://localhost:${SERVER_PORT}`)
                cp.execSync(`node ${path.resolve(__dirname, "server.js")}`, {
                    stdio: "inherit"
                })
                break
            }
        }

        if (
            [
                "logout",
                "save",
                "find",
                "clip",
                "list",
                "backup",
                "restore",
                "export"
            ].includes(firstArg)
        ) {
            if (!this.appState.isLoggedIn) {
                throw new Error("Please login first.")
            }

            switch (firstArg) {
                case "logout": {
                    this.appState.reset()
                    console.log(`Logged out.`)
                    break
                }
                case "save": {
                    const name = this.args[1]

                    if (!name || name.startsWith("--")) {
                        throw new Error("Please provide a name.")
                    }

                    this.store.save(name, argsToKVPairs(this.args.slice(2)))
                    console.log(`Save succeeded.`)
                    break
                }
                case "find": {
                    const name = this.args[1]

                    if (!name) {
                        throw new Error("Please provide a name to find.")
                    }

                    const item = this.store.find(name)

                    if (item) {
                        console.log(`${item.name}: `)
                        const skipThese = ["name", "created_at", "updated_at"]
                        for (const [key, value] of Object.entries(item)) {
                            if (skipThese.includes(key)) continue
                            console.log(`${key}: ${value}`)
                        }
                        console.log(
                            `Created At: ${new Date(
                                item.created_at
                            ).toLocaleString()}`
                        )
                        console.log(
                            `Updated At: ${new Date(
                                item.created_at
                            ).toLocaleString()}`
                        )
                    } else {
                        console.log(`Record not found.`)
                    }

                    break
                }
                case "clip": {
                    const name = this.args[1]
                    const key = this.args[2]

                    if (!name || !key) {
                        throw new Error("Please provide both name and key.")
                    }

                    const item = this.store.find(name)

                    if (item) {
                        copyToClipboard(item[key])
                        console.log("Copied to clipboard.")
                    }

                    break
                }
                case "list": {
                    const list = this.store.list().map(item => item.name)
                    console.log(list.join(os.EOL))
                    break
                }
                case "backup": {
                    this.store.backup(this.cwd)
                    console.log("Store file backuped.")
                    break
                }
                case "restore": {
                    const pathArg = this.args[1]
                    this.store.restore(path.resolve(this.cwd, pathArg))
                    console.log("Backup restored.")
                    break
                }
                case "export": {
                    this.store.export(this.cwd)
                    break
                }
            }
        }
    }
}

try {
    new App(process.argv.slice(2), process.cwd()).run()
    process.exit(0)
} catch (error) {
    console.log(error.message)
    process.exit(1)
}
