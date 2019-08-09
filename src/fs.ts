import fs from "fs"

export default class FS {
    static ENCODING = "utf-8"

    static read(path: string) {
        return fs.readFileSync(path, { encoding: FS.ENCODING })
    }

    static write(path: string, data: string) {
        fs.writeFileSync(path, data, { encoding: FS.ENCODING })
    }

    static exists = fs.existsSync

    static rm = fs.unlinkSync

    static cp = fs.copyFileSync
}
