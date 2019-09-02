import os from "os"
import path from "path"

export const SERVER_PORT = 6789

export const IS_DEV = process.env.NODE_ENV === "development"

const DIR = IS_DEV ? path.resolve(__dirname, "..") : os.homedir()

export const ROOT_DIR = path.resolve(DIR, ".pass-vault")

export const BACKUP_DIR = path.resolve(DIR, ".pass-vault-backups")
