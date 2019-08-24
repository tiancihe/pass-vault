import React from "react"
import { HashRouter, Route } from "react-router-dom"

import { UserProvider } from "./contexts/user"
import { SettingProvider } from "./contexts/setting"
import Home from "./pages/Home"
import Login from "./pages/Login"
import CreateItem from "./pages/CreateItem"
import Items from "./pages/Items"
import ItemDetail from "./pages/ItemDetail"
import Setting from "./pages/Setting"
import BackupAndRestore from "./pages/BackupAndRestore"

export default function App() {
    return (
        <HashRouter>
            <UserProvider>
                <SettingProvider>
                    <Route path="/" exact component={Home} />
                    <Route path="/items" exact component={Items} />
                    <Route path="/items/create" exact component={CreateItem} />
                    <Route path="/items/:name" component={ItemDetail} />
                    <Route path="/login" component={Login} />
                    <Route
                        path="/backup-and-restore"
                        component={BackupAndRestore}
                    />
                    <Route path="/setting" component={Setting} />
                </SettingProvider>
            </UserProvider>
        </HashRouter>
    )
}
