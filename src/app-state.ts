import path from "path"

import FS from "./fs"

import { IAppState, IUserSetting } from "./types"
import { ROOT_DIR, BACKUP_DIR } from "./constants"

export default class AppState {
    static readonly PATH = path.resolve(ROOT_DIR, "app-state.json")

    static genEmptyAppState(): IAppState {
        return {
            user: "",
            secret: ""
        }
    }

    state: IAppState

    constructor() {
        if (!FS.exists(ROOT_DIR)) FS.mkdir(ROOT_DIR)
        if (!FS.exists(BACKUP_DIR)) FS.mkdir(BACKUP_DIR)

        if (!FS.exists(AppState.PATH)) {
            this.setState(AppState.genEmptyAppState())
        } else {
            this.state = this.read()
        }
    }

    get isLoggedIn() {
        return this.state.user || this.state.secret
    }

    logout() {
        this.setState({
            user: "",
            secret: ""
        })
    }

    read() {
        return JSON.parse(FS.read(AppState.PATH)) as IAppState
    }

    setState(state: Partial<IAppState>) {
        this.state = {
            ...this.state,
            ...state
        }
        FS.write(AppState.PATH, JSON.stringify(this.state))
    }

    get settingPath() {
        return path.resolve(ROOT_DIR, `${this.state.user}.settings.json`)
    }

    static genEmptyUserSetting(): IUserSetting {
        return {
            defaultInvisible: ["Password"],
            autoBackup: true
        }
    }

    getUserSetting() {
        if (!FS.exists(this.settingPath)) {
            const setting = AppState.genEmptyUserSetting()
            FS.write(this.settingPath, JSON.stringify(setting))
            return setting
        }
        return JSON.parse(FS.read(this.settingPath)) as IUserSetting
    }

    setUserSetting(setting: Partial<IUserSetting>) {
        FS.write(
            this.settingPath,
            JSON.stringify({ ...this.getUserSetting(), ...setting })
        )
    }

    getBackups() {
        return FS.readDir(BACKUP_DIR).filter(name =>
            name.startsWith(this.state.user)
        )
    }
}
