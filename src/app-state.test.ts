import AppState from "./app-state"
import FS from "./fs"

const appState = new AppState()

describe("AppState", () => {
    afterAll(() => {
        FS.rm(AppState.PATH)
    })

    it("should initialize correctly", () => {
        expect(FS.exists(AppState.PATH)).toBeTruthy()
        expect(appState.isLoggedIn).toBeFalsy()
    })

    it("should setState correctly", () => {
        appState.setState({
            user: "test",
            secret: "test"
        })
        
        expect(appState.isLoggedIn).toBeTruthy()
        expect(appState.read()).toMatchObject(appState.state)
    })

    it("should reset correctly", () => {
        appState.reset()

        expect(appState.isLoggedIn).toBeFalsy()
        expect(appState.state).toMatchObject(AppState.genEmptyAppState())
    })
})
