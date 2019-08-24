import React, { useEffect, useState } from "react"
import { Card, Button, Icon } from "antd"

import GlobalLayout from "../components/GlobalLayout"
import {
    getBackups,
    restoreBackup,
    backup,
    deleteBackup
} from "../services/user"

export default function BackupAndRestore() {
    const [backups, setBackups] = useState<string[]>([])

    const loadBackups = async () => setBackups((await getBackups()).data)

    useEffect(() => {
        loadBackups()
    }, [])

    return (
        <GlobalLayout>
            <Card
                title="Backup and Restore"
                bodyStyle={{ display: "flex", flexWrap: "wrap", padding: 0 }}
                extra={
                    <Button
                        icon="cloud-download"
                        onClick={async () => {
                            const res = await backup()
                            if (res.success) loadBackups()
                        }}
                    >
                        Backup
                    </Button>
                }
            >
                {backups.map(backup => (
                    <Card
                        key={backup}
                        style={{ width: 300, margin: 20 }}
                        actions={[
                            <>
                                <Icon
                                    type="cloud-upload"
                                    onClick={async () => {
                                        const res = await restoreBackup(backup)
                                        if (res.success) loadBackups()
                                    }}
                                />
                                Restore
                            </>,
                            <>
                                <Icon
                                    type="delete"
                                    onClick={async () => {
                                        const res = await deleteBackup(backup)
                                        if (res.success) loadBackups()
                                    }}
                                />
                                Delete
                            </>
                        ]}
                    >
                        {new Date(
                            Number(backup.substring(backup.indexOf("-") + 1))
                        ).toLocaleString()}
                    </Card>
                ))}
            </Card>
        </GlobalLayout>
    )
}
