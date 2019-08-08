import typescript from "rollup-plugin-typescript"

export default {
    input: "src/app.ts",
    output: {
        file: "dist/pass-vault.js",
        format: "cjs",
        banner: "#!/usr/bin/env node",
    },
    plugins: [
        typescript()
    ]
}
