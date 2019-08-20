import path from "path"

import express, { ErrorRequestHandler } from "express"
import cors from "cors"

import AppState from "./app-state"
import Store from "./store"
import { SERVER_PORT } from "./constants"
import { SaveItemPayload } from "./types/item"
import { formatDateString } from "./utils"

const server = express()

server.use(express.static(path.resolve(__dirname, "client")))
server.use(express.json())
server.use(cors())

const OK = "OK"
const UNAUTHORIZED = "Not Logged in."

server.get("/api/current-user", (req, res, next) => {
    try {
        const appState = new AppState()
        res.status(200).json({
            data: {
                name: appState.state.user
            },
            msg: OK
        })
    } catch (err) {
        next(err)
    }
})

server.post("/api/login", (req, res, next) => {
    try {
        const { name: user, password: secret } = req.body
        if (!user || !secret) {
            res.status(400).json({
                msg: "Name and password are both required."
            })
            return
        }

        const appState = new AppState()
        appState.setState({
            user,
            secret:
                secret.length < 16
                    ? secret.repeat(Math.ceil(16 / secret.length))
                    : secret
        })
        const storeData = new Store(
            appState.state.user,
            appState.state.secret
        ).read()
        res.status(200).json({
            data: {
                created_at: formatDateString(storeData.created_at),
                updated_at: formatDateString(storeData.updated_at)
            },
            msg: `Logged in as ${user}`
        })
    } catch (err) {
        next(err)
    }
})

function readAppState() {
    const appState = new AppState()
    if (appState.isLoggedIn) {
        return appState
    } else {
        throw new Error(UNAUTHORIZED)
    }
}

function readStore() {
    const appState = new AppState()
    return new Store(appState.state.user, appState.state.secret)
}

server.post("/api/logout", (req, res, next) => {
    try {
        const appState = readAppState()
        if (appState.isLoggedIn) {
            appState.reset()
            res.status(200).json({
                msg: "Logged out."
            })
        }
    } catch (err) {
        next(err)
    }
})

server.get("/api/items", (req, res, next) => {
    try {
        const store = readStore()
        res.status(200).json({
            data: store.list().map(item => ({
                ...item,
                created_at: formatDateString(item.created_at),
                updated_at: formatDateString(item.updated_at)
            })),
            msg: OK
        })
    } catch (err) {
        next(err)
    }
})

server.get("/api/items/:name", (req, res, next) => {
    try {
        const { name } = req.params as { name: string }
        const store = readStore()
        res.status(200).json({
            data: store.find(name),
            msg: OK
        })
    } catch (err) {
        next(err)
    }
})

server.post("/api/items/save", (req, res, next) => {
    try {
        const { name, ...rest } = req.body as SaveItemPayload
        const store = readStore()
        store.save(name, rest)
        res.status(200).json({
            data: store.find(name),
            msg: "Item saved."
        })
    } catch (err) {
        next(err)
    }
})

const authErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.message === UNAUTHORIZED) {
        res.status(401).json({
            msg: UNAUTHORIZED
        })
    } else {
        next(err)
    }
}
server.use(authErrorHandler)
const errorHandler: ErrorRequestHandler = (err, req, res) => {
    res.status(500).json({
        msg: "Something unexpected happened, refer to console for detail."
    })
    console.error(err)
}
server.use(errorHandler)

server.listen(SERVER_PORT, () =>
    console.log(`Server started at port: ${SERVER_PORT}`)
)
