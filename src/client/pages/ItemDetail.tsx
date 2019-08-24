import React, { useState, useEffect } from "react"
import { RouteComponentProps } from "react-router-dom"
import { Form } from "antd"
import { FormComponentProps } from "antd/lib/form"

import GlobalLayout from "../components/GlobalLayout"
import ItemDetailForm from "../components/ItemDetailForm"
import { getItem, saveItem } from "../services/item"

import { IStoreDataItem } from "../../types"

function ItemDetail(
    props: RouteComponentProps<{ name: string }> & FormComponentProps
) {
    const [detail, setDetail] = useState({} as IStoreDataItem)

    const itemName = props.match.params.name

    const loadDetail = async () => {
        const res = await getItem(itemName)
        if (res.success) {
            setDetail(res.data)
        }
    }

    useEffect(() => {
        loadDetail()
    }, [])

    useEffect(() => {
        loadDetail()
    }, [itemName])

    return (
        <GlobalLayout>
            <ItemDetailForm
                isCreate={false}
                detail={detail}
                onSubmit={() => {
                    return new Promise(resolve => {
                        props.form.validateFields(async (err, values) => {
                            if (err) return
                            const payload = { name: itemName, ...values }
                            for (const key of Object.keys(values)) {
                                if (!props.form.isFieldTouched(key))
                                    delete payload[key]
                            }
                            const res = await saveItem(payload)
                            if (res.success) {
                                setDetail(res.data)
                                resolve(true)
                            } else {
                                resolve(false)
                            }
                        })
                    })
                }}
                form={props.form}
            />
        </GlobalLayout>
    )
}

export default Form.create()(ItemDetail)
