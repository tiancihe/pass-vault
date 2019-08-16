import os from "os"
import cp from "child_process"

export function range(start: number, end: number) {
    if (end <= start) {
        throw new Error(`range: end: ${end} is not greater than start: ${start}`)
    }

    return Array(end - start)
        .fill(null)
        .map((_, index) => index + start)
}

export enum GenerateType {
    "NumbersOnly",
    "NumbersAndCharacters"
}

export interface GenerateOptions {
    type?: GenerateType
    length?: number
}

const NUMBERS_RANGE = range(48, 58)
const LOWER_CASES_RANGE = range(97, 123)
const UPPER_CASES_RANGE = range(65, 91)
const buildPickChar = (type: GenerateType) => type === GenerateType["NumbersAndCharacters"]
    ? () => String.fromCharCode(
        NUMBERS_RANGE.concat(LOWER_CASES_RANGE).concat(UPPER_CASES_RANGE)[
            Math.floor(
                Math.random() * (NUMBERS_RANGE.length + LOWER_CASES_RANGE.length + UPPER_CASES_RANGE.length)
            )
        ]
    )
    : () => String.fromCharCode(NUMBERS_RANGE[Math.floor(Math.random() * NUMBERS_RANGE.length)])

export const generatePassword = ({
    type = GenerateType["NumbersAndCharacters"],
    length = 8
} = {} as GenerateOptions) => range(0, length).map(buildPickChar(type)).join("")

export function argsToKVPairs(args: string[]) {
    const kvPairs = {} as {
        [key: string]: string;
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith("--")) {
            const key = arg.slice(2);
            const value = args[i + 1];

            if (value.startsWith("--")) {
                throw new Error(`Invalid options: Expect a value for ${key}`);
            }

            // e.g. --password foobarbaz will be stored as { password: "foobarbaz" }
            kvPairs[key] = value;
        }
    }

    return kvPairs;
};

export function copyToClipboard(text: string): string {
    const isWindows = os.platform() === "win32"
    if(isWindows) {
        cp.execSync(`echo ${text} | clip`)
        return text
    }

    const isWsl = os.platform() === "linux" || os.release().toLowerCase().includes("microsoft")
    if(isWsl) {
        cp.execSync(`echo ${text} | clip.exe`)
        return text
    }
}
