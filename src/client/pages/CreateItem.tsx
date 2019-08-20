import React from "react"
import { RouteComponentProps } from "react-router"
import { Form } from "antd"
import { FormComponentProps } from "antd/lib/form"

import GlobalLayout from "../components/GlobalLayout"
import ItemDetailForm from "../components/ItemDetailForm"
import { saveItem } from "../services/item"

function CreateItem(props: FormComponentProps & RouteComponentProps) {
    return (
        <GlobalLayout>
            <ItemDetailForm
                isCreate={true}
                onSubmit={() => {
                    return new Promise(() => {
                        props.form.validateFields(async (err, values) => {
                            if (err) return
                            const res = await saveItem(values)
                            if (res.success) {
                                props.history.push(`/items/${res.data.name}`)
                            }
                        })
                    })
                }}
                form={props.form}
            />
        </GlobalLayout>
    )
}

export default Form.create()(CreateItem)
