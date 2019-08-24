import React from "react"
import { Link, withRouter, RouteComponentProps } from "react-router-dom"
import { Layout, Menu, Icon, Dropdown } from "antd"

import useUser from "../hooks/useUser"
import { logout } from "../services/user"

function GlobalLayout(
    props: RouteComponentProps & { children?: React.ReactNode }
) {
    const { isLoggedIn, user, setUser } = useUser()

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
                    <Menu.Item key="/backup-and-restore">
                        <Link to="/backup-and-restore">
                            <Icon type="database" />
                            Backup and Restore
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/setting">
                        <Link to="/setting">
                            <Icon type="setting" />
                            Setting
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
