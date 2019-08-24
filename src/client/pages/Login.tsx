import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { Card, Form, Input, Icon, Button } from "antd"
import { FormComponentProps, FormItemProps } from "antd/lib/form"

import useUser from "../hooks/useUser"
import { login } from "../services/user"

const formItemLayout: Pick<FormItemProps, "labelCol" | "wrapperCol"> = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
}

function Login(props: RouteComponentProps & FormComponentProps) {
    const { setUser } = useUser()

    const { getFieldDecorator, validateFields } = props.form

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
                height: "100vh",
                background:
                    "linear-gradient(45deg, rgb(64, 140, 190) 0%, rgb(64, 140, 190) 7%,rgb(62, 107, 145) 7%, rgb(62, 107, 145) 9%,rgb(49, 99, 131) 9%, rgb(49, 99, 131) 11%,rgb(116, 172, 211) 11%, rgb(116, 172, 211) 26%,rgb(125, 182, 214) 26%, rgb(125, 182, 214) 34%,rgb(40, 90, 136) 34%, rgb(40, 90, 136) 41%,rgb(39, 123, 190) 41%, rgb(39, 123, 190) 100%)"
            }}
        >
            <Card style={{ width: 500 }} title="Login">
                <Form
                    onSubmit={async e => {
                        e.preventDefault()
                        validateFields(async (err, values) => {
                            if (err) return
                            const res = await login(values)
                            if (res.success) {
                                setUser(values.name)
                                props.history.push("/")
                            }
                        })
                    }}
                >
                    <Form.Item label="Name" {...formItemLayout}>
                        {getFieldDecorator("name", {
                            rules: [
                                { required: true, message: "Name is required." }
                            ]
                        })(<Input type="text" prefix={<Icon type="user" />} />)}
                    </Form.Item>
                    <Form.Item label="Password" {...formItemLayout}>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "Password is required."
                                }
                            ]
                        })(
                            <Input
                                type="password"
                                min={4}
                                prefix={<Icon type="lock" />}
                            />
                        )}
                    </Form.Item>
                    <div className="text-center">
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default Form.create()(Login)
