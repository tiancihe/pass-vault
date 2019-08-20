import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import { AuthProvider } from "./contexts/auth"

import "antd/dist/antd.css"

import "./index.css"

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById("root")
)
