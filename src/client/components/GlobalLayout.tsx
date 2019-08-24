import React from "react"
import { Link, withRouter, RouteComponentProps } from "react-router-dom"
import { Layout, Menu, Icon, Dropdown, message } from "antd"

import useUser from "../hooks/useUser"
import { logout } from "../services/user"

function GlobalLayout(
    props: RouteComponentProps & { children?: React.ReactNode }
) {
    const { isLoggedIn, user, setUser } = useUser()

    const handleNavigate = (route: string) => {
        if (isLoggedIn) props.history.push(route)
        else message.warning("Please login first")
    }

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout.Sider>
                <div style={{ margin: "1rem 0", textAlign: "center" }}>
                    <Link to="/">
                        <h3 style={{ color: "#fff" }}>Pass Vault</h3>
                    </Link>
                </div>
                <Menu theme="dark" selectedKeys={[props.location.pathname]}>
                    <Menu.Item
                        key="/items"
                        onClick={() => handleNavigate("/items")}
                    >
                        <Icon type="unordered-list" />
                        Items
                    </Menu.Item>
                    <Menu.Item
                        key="/items/create"
                        onClick={() => handleNavigate("/items/create")}
                    >
                        <Icon type="plus" />
                        New
                    </Menu.Item>
                    <Menu.Item
                        key="/backup-and-restore"
                        onClick={() => handleNavigate("/backup-and-restore")}
                    >
                        <Icon type="database" />
                        Backup and Restore
                    </Menu.Item>
                    <Menu.Item
                        key="/setting"
                        onClick={() => handleNavigate("/setting")}
                    >
                        <Icon type="setting" />
                        Setting
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
                                                    setUser("")
                                                }
                                            }}
                                        >
                                            <Icon type="logout" />
                                            Logout
                                        </Menu.Item>
                                    </Menu>
                                }
                            >
                                <span>{user}</span>
                            </Dropdown>
                        ) : (
                            <Link to="/login">
                                <Icon type="login" />
                                &nbsp;Login
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
