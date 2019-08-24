import React, { useState } from "react"
import { Form, Card, Input, Button, Tag, Switch } from "antd"
import { FormItemProps } from "antd/lib/form"

import GlobalLayout from "../components/GlobalLayout"
import { setUserSetting } from "../services/user"

import useSetting from "../hooks/useSetting"

const formItemLayout: Pick<FormItemProps, "labelCol" | "wrapperCol"> = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 10
    }
}

export default function Setting() {
    const { setting, setSetting } = useSetting()

    const [defaultInvisibleToAdd, setDefaultInvisibleToAdd] = useState("")

    const handleAddDefaultInvisible = () => {
        if (defaultInvisibleToAdd) {
            setSetting({
                ...setting,
                defaultInvisible: setting.defaultInvisible.concat(
                    defaultInvisibleToAdd
                )
            })
        }
        setDefaultInvisibleToAdd("")
    }

    return (
        <GlobalLayout>
            <Card title="Setting">
                <Form>
                    <Form.Item
                        label="Default Invisible Fields"
                        {...formItemLayout}
                    >
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <Input
                                        placeholder="e.g. Password"
                                        value={defaultInvisibleToAdd}
                                        onChange={e =>
                                            setDefaultInvisibleToAdd(
                                                e.target.value
                                            )
                                        }
                                        onPressEnter={handleAddDefaultInvisible}
                                    />
                                </div>
                                <Button
                                    shape="circle"
                                    icon="plus"
                                    onClick={handleAddDefaultInvisible}
                                />
                            </div>
                            <div style={{ display: "flex" }}>
                                {setting.defaultInvisible.map(item => (
                                    <div key={item} style={{ margin: 6 }}>
                                        <Tag
                                            closable
                                            onClose={() =>
                                                setSetting({
                                                    ...setting,
                                                    defaultInvisible: setting.defaultInvisible.filter(
                                                        i => i !== item
                                                    )
                                                })
                                            }
                                        >
                                            {item}
                                        </Tag>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item label="Auto backup" {...formItemLayout}>
                        <Switch
                            checked={setting.autoBackup}
                            onChange={checked =>
                                setSetting({ ...setting, autoBackup: checked })
                            }
                        />
                    </Form.Item>

                    <div className="text-center">
                        <Button
                            type="primary"
                            onClick={async () => {
                                const res = await setUserSetting(setting)
                                if (res.success) {
                                    setSetting(res.data)
                                }
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </Card>
        </GlobalLayout>
    )
}
