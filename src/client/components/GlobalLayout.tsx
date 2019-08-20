import React from "react"
import { Link, withRouter, RouteComponentProps } from "react-router-dom"
import { Layout, Menu, Icon, Dropdown } from "antd"

import useAuth from "../hooks/useAuth"
import { logout } from "../services/auth"

function GlobalLayout(
    props: RouteComponentProps & { children?: React.ReactNode }
) {
    const { isLoggedIn, auth, setAuth } = useAuth()

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Sider>
                <div style={{ margin: "1rem 0", textAlign: "center" }}>
                    <Link to="/">
                        <h3 style={{ color: "#fff" }}>Pass Vault</h3>
                    </Link>
                </div>
                <Menu theme="dark" selectedKeys={[props.location.pathname]}>
                    <Menu.Item key="/items">
                        <Link to="/items">
                            <Icon type="unordered-list" />
                            Items
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/items/create">
                        <Link to="/items/create">
                            <Icon type="plus" />
                            New
                        </Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            <Layout>
                <Layout.Header style={{ backgroundColor: "#fff" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}
                    >
                        {isLoggedIn ? (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item
                                            onClick={async () => {
                                                const res = await logout()
                                                if (res.success) {
                                                    setAuth({
                                                        name: ""
                                                    })
                                                }
                                            }}
                                        >
                                            <Icon type="logout" />
                                            Logout
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <span>{auth.name}</span>
                            </Dropdown>
                        ) : (
                            <Link to="/login">
                                <Icon type="user" />
                            </Link>
                        )}
                    </div>
                </Layout.Header>
                <Layout.Content style={{ padding: "1rem" }}>
                    {props.children}
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

export default withRouter(GlobalLayout)
