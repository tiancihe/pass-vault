import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, Row, Col } from "antd"

import GlobalLayout from "../components/GlobalLayout"
import { getItems } from "../services/item"
import { ItemInfo } from "../../types/item"

export default function Items() {
    const [items, setItems] = useState([] as ItemInfo[])

    useEffect(() => {
        const init = async () => {
            const res = await getItems()
            if (res.success) {
                setItems(res.data)
            }
        }
        init()
    }, [])

    return (
        <GlobalLayout>
            <Row type="flex">
                {items.map(item => (
                    <Col key={item.name}>
                        <Link to={`/items/${item.name}`}>
                            <Card
                                style={{ width: 350, margin: "1em" }}
                                title={item.name}
                            >
                                <Row>
                                    <Col xs={8}>Created At: </Col>
                                    <Col xs={16}>{item.created_at}</Col>
                                </Row>
                                <Row style={{ marginTop: "1em" }}>
                                    <Col xs={8}>Updated At: </Col>
                                    <Col xs={16}>{item.updated_at}</Col>
                                </Row>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </GlobalLayout>
    )
}
