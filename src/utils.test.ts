import { range, generatePassword, argsToKVPairs } from "./utils"

describe("range", () => {
    it("should create an array range from start to end - 1", () => {
        expect(range(0, 5)).toMatchObject([0, 1, 2, 3, 4])
        expect(range(4, 7)).toMatchObject([4, 5, 6])
    })

    it("should throw if end if not greater than start", () => {
        expect(jest.fn(() => range(0, 0))).toThrowError()
    })
})

describe("generatePassword()", () => {
    it("should generate a string consists of 8 random characters or numbers", () => {
        const result = generatePassword()
        expect(typeof result === "string").toBeTruthy()
        expect(result.length === 8).toBeTruthy()
        expect(result).toMatch(/[0-9a-zA-Z]+/g)
    })

    it("should generate only numbers when corresponding type option is provided", () => {
        const result = generatePassword({ type: 0 })
        expect(result).toMatch(/[0-9]+/g)
    })

    it("should generate string of corresponding length when length option is provided", () => {
        const result = generatePassword({ length: 12 })
        expect(result.length === 12).toBeTruthy()
    })
})

describe("argsToKVPairs", () => {
    it("should parse args to key-value pairs", () => {
        expect(argsToKVPairs([
            "--foo", "foo",
            "--bar", "bar"
        ])).toMatchObject({
            foo: "foo",
            bar: "bar"
        })
    })
    
    it("should throw an error if a key is not provided with a value", () => {
        expect(jest.fn(() => argsToKVPairs([
            "--foo",
            "--bar", "bar"
        ]))).toThrowError()
    })
})
