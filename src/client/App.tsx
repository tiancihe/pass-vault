import React from "react"
import { Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import CreateItem from "./pages/CreateItem"
import Items from "./pages/Items"
import ItemDetail from "./pages/ItemDetail"

export default function App() {
    return (
        <>
            <Route path="/" exact component={Home} />
            <Route path="/items" exact component={Items} />
            <Route path="/items/create" exact component={CreateItem} />
            <Route path="/items/:name" component={ItemDetail} />
            <Route path="/login" component={Login} />
        </>
    )
}
