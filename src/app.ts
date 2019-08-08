import AppState from "./app-state"
import Store, { StoreDataItemName } from "./store"
import { User, Secret, KVPairs } from "./types"
import { generatePassword, parseArgs, throwNotLoggedIn, throwIncorrectSecret } from "./utils"

export type Command = "login" | "logout" | "gen" | "save" | "find"

class App {
    readonly VERSION = "0.1.3"

    readonly HELP_INFO =
`
pass-vault
    version: ${this.VERSION}

Usage:
    -v | --version
        Print version.
    -h | --help
        Print help.
    login [name] [secret]
        Your secret and data will be stored in separate files, distinguished by name.
        Secret is your encryption key, at least 16 characters, required.
    logout

Usage after logged in:
    gen
        --type
            default to 1
            0: includes only numbers
            1: includes numbers and characters
        --length
            default to 8
    save [name]
        e.g. pass save gmail --account lorem@gmail.com --password loremipsum
        --[key] [value]
    find [name]
        e.g. pass find gmail
`

    private state = new AppState()

    constructor(private args: string[]) {}

    login(user: User, secret: Secret) {
        this.state.setUser(user)

        new Store(user).init(secret)
    }

    logout() {
        this.checkIsLoggedIn()

        new Store(this.state.user).reset()

        this.state.setUser("")
    }

    private checkIsLoggedIn() {
        if(!this.state.user) {
            throwNotLoggedIn()
        }
    }

    save(name: StoreDataItemName, kvPairs: KVPairs) {
        const store = new Store(this.state.user)

        const storeData = store.read()
        const index = storeData.data.findIndex(item => item.name === name)
        const exists = index >= 0

        if (!exists) {
            storeData.data.push({
                name,
                created_at: new Date().toLocaleString(),
                updated_at: "",
                ...kvPairs
            })
        } else {
            storeData.data[index] = {
                ...storeData.data[index],
                ...kvPairs,
                updated_at: new Date().toLocaleString()
            }
        }

        store.write(storeData)
    }

    find(name: StoreDataItemName) {
        return new Store(this.state.user).read().data.find(item => item.name === name)
    }

    run() {
        switch(this.args[0]) {
            case "-h":
            case "--help": {
                console.log(this.HELP_INFO)
                break
            }
            case "-v":
            case "--version": {
                console.log(`pass-vault: ${this.VERSION}`)
                break
            }
            case "login": {
                const user = this.args[1]
                const secret = this.args[2]

                if (!user || !secret) {
                    throw new Error("Please provide your name and secret.")
                }

                this.login(user, secret)
                console.log(`Logged in as ${user}.`)
                break
            }
            case "logout": {
                this.logout()
                console.log(`Logged out.`)
                break
            }
            
            case "gen": {
                const kvPairs = parseArgs(this.args.slice(1))

                console.log(
                    generatePassword({
                        type: Number(kvPairs.type) || undefined,
                        length: Number(kvPairs.length) || undefined
                    })
                )

                break
            }
            case "save": {
                const name = this.args[1]

                if (!name || name.startsWith("--")) {
                    throw new Error("Please provide a name.")
                }

                this.save(name, parseArgs(this.args.slice(2)))
                console.log(`Save succeeded.`)

                break
            }
            case "find": {
                const name = this.args[1]

                if (!name || name.startsWith("--")) {
                    throw new Error("Please provide a name.")
                }

                const item = this.find(name)

                if(item) {
                    console.log(`${name}: `)
                    const skipThese = ["name", "created_at", "updated_at"]
                    for (const [key, value] of Object.entries(item)) {
                        if(skipThese.includes(key)) continue
                        console.log(`${key}: ${value}`)
                    }
                    console.log(`Created At: ${item.created_at}`)
                    console.log(`Updated At: ${item.created_at}`)
                } else {
                    console.log(`Record not found: ${name}.`)
                }

                break
            }
            default: {
                console.log(this.HELP_INFO)
            }
        }
    }
}

try {
    new App(process.argv.slice(2)).run()
    process.exit(0)
} catch (error) {
    console.log(error.message)
    process.exit(1)
}
