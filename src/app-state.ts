import path from "path"

import FS from "./fs";

export type User = string;

export interface IAppState {
    user: User
}

export default class AppState {
    static readonly PATH = path.resolve(__dirname, "app-state.json")

    user = ""

    constructor() {
        if(!FS.exists(AppState.PATH)) {
            FS.write(
                AppState.PATH,
                JSON.stringify({ user: "" } as IAppState)
            )
        } else {
            this.user = (JSON.parse(FS.read(AppState.PATH)) as IAppState).user
        }
    }

    setUser(user: User) {
        this.user = user
        FS.write(AppState.PATH, JSON.stringify({ user } as IAppState))
    }
}
