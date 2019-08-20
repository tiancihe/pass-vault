import path from "path"

import FS from "./fs"

import { IAppState } from "./types/auth"

export default class AppState {
    static readonly PATH = path.resolve(__dirname, "app-state.json")

    static genEmptyAppState() {
        return {
            user: "",
            secret: ""
        } as IAppState
    }

    state: IAppState

    constructor() {
        if (!FS.exists(AppState.PATH)) {
            this.setState(AppState.genEmptyAppState())
        } else {
            this.state = this.read()
        }
    }

    read() {
        return JSON.parse(FS.read(AppState.PATH)) as IAppState
    }

    get isLoggedIn() {
        return this.state.user || this.state.secret
    }

    setState(state: Partial<IAppState>) {
        this.state = {
            ...this.state,
            ...state
        }
        FS.write(AppState.PATH, JSON.stringify(this.state))
    }

    reset() {
        this.setState({
            user: "",
            secret: ""
        })
    }
}
