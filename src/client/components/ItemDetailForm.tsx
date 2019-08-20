import React, { useState, useEffect } from "react"
import {
    Card,
    Form,
    Input,
    Button,
    Divider,
    Switch,
    Icon,
    message,
    Select,
    InputNumber,
    Row,
    Col
} from "antd"
import { FormComponentProps, FormItemProps } from "antd/lib/form"
import copy from "copy-to-clipboard"

import { generatePassword } from "../../utils"
import { ItemInfo } from "../../types/item"

const formItemLayout: Pick<FormItemProps, "labelCol" | "wrapperCol"> = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
}

export default function ItemDetailForm<T extends ItemInfo>(
    props: FormComponentProps & {
        isCreate: boolean
        detail?: T
        onSubmit: () => Promise<boolean>
    }
) {
    const {
        isCreate,
        detail = {} as T,
        onSubmit,
        form: { getFieldDecorator, getFieldValue, setFieldsValue }
    } = props

    const [editing, setEditing] = useState(isCreate)
    const [keyToAdd, setKeyToAdd] = useState("")
    const [keys, setKeys] = useState(["Account", "Password"])
    const [generatedPassword, setGeneratedPassword] = useState("")
    const [generateType, setGenerateType] = useState(1)
    const [generateLength, setGenerateLength] = useState(8)

    useEffect(() => {
        const keys = Object.keys(detail)
        if (keys.length) {
            setKeys(
                keys.filter(
                    key => !["name", "created_at", "updated_at"].includes(key)
                )
            )
        }
    }, [detail])

    return (
        <Card
            title={isCreate ? "Create Item" : detail.name}
            extra={
                !isCreate && (
                    <Switch
                        checked={editing}
                        checkedChildren="Editing"
                        unCheckedChildren="Edit"
                        onChange={checked => setEditing(checked)}
                    />
                )
            }
        >
            <Form
                onSubmit={async e => {
                    e.preventDefault()
                    const success = await onSubmit()
                    if (success) {
                        setEditing(false)
                    }
                }}
            >
                {editing && (
                    <>
                        <Form.Item
                            label="Generate Password"
                            {...formItemLayout}
                        >
                            <Row type="flex" gutter={8}>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            const pwd = generatePassword({
                                                type: generateType,
                                                length: generateLength
                                            })
                                            copy(pwd)
                                            message.success(
                                                "Copied generated password to clipboard."
                                            )
                                        }}
                                    >
                                        Generate
                                    </Button>
                                </Col>
                                <Col>
                                    <Select
                                        style={{ width: 200 }}
                                        value={generateType}
                                        onChange={(value: number) =>
                                            setGenerateType(value)
                                        }
                                    >
                                        <Select.Option key={0} value={0}>
                                            Numbers Only
                                        </Select.Option>
                                        <Select.Option key={1} value={1}>
                                            Numbers and Characters
                                        </Select.Option>
                                    </Select>
                                </Col>
                                <Col>
                                    <InputNumber
                                        min={1}
                                        value={generateLength}
                                        onChange={value =>
                                            setGenerateLength(value)
                                        }
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Divider />
                        <Form.Item label="Add field" {...formItemLayout}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Input
                                    style={{ marginRight: "1em" }}
                                    placeholder="Input field name"
                                    value={keyToAdd}
                                    onChange={e => setKeyToAdd(e.target.value)}
                                />
                                <Button
                                    disabled={!keyToAdd}
                                    type="primary"
                                    shape="circle"
                                    icon="plus"
                                    onClick={() => {
                                        setKeys(keys.concat(keyToAdd))
                                        setKeyToAdd("")
                                    }}
                                />
                            </div>
                        </Form.Item>
                        <Divider />
                    </>
                )}

                {isCreate && (
                    <Form.Item label="Name" {...formItemLayout}>
                        {editing
                            ? getFieldDecorator("name", {
                                  rules: [
                                      {
                                          required: true,
                                          message: "Name is required."
                                      }
                                  ]
                              })(<Input placeholder="Input Name" />)
                            : detail.name}
                    </Form.Item>
                )}

                {keys.map(key => (
                    <Form.Item key={key} label={key} {...formItemLayout}>
                        {editing ? (
                            getFieldDecorator(key, {
                                initialValue: detail[key],
                                rules: [
                                    {
                                        required: true,
                                        message: `${key} is required.`
                                    }
                                ]
                            })(
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    <Input.Password
                                        style={{
                                            flex: 1,
                                            marginRight: "1em"
                                        }}
                                        placeholder={`Input ${key}`}
                                        value={getFieldValue(key)}
                                        onChange={e =>
                                            setFieldsValue({
                                                [key]: e.target.value
                                            })
                                        }
                                    />
                                    <Button
                                        onClick={() =>
                                            setKeys(keys.filter(k => k !== key))
                                        }
                                        type="danger"
                                        shape="circle"
                                        icon="close"
                                    />
                                </div>
                            )
                        ) : (
                            <DetailFieldValue value={detail[key] || ""} />
                        )}
                    </Form.Item>
                ))}

                {editing && (
                    <div className="text-center">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                )}
            </Form>
        </Card>
    )
}

function DetailFieldValue({ value }: { value: string }) {
    const [display, setDisplay] = useState(false)

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {display ? value : Array(value.length).fill("*")}
            <Icon
                style={{ marginLeft: "0.75em" }}
                type={display ? "eye-invisible" : "eye"}
                onClick={() => setDisplay(!display)}
            />
            <Icon
                style={{ marginLeft: "0.75em" }}
                type="copy"
                onClick={() => {
                    copy(value)
                    message.success("Copied to clipboard.")
                }}
            />
        </div>
    )
}
