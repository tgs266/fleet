import { BytesFrom, BytesTo } from "."

test("mb to b", () => {
    expect(BytesFrom.megabytes(1)).toBe(1000000)
})

test("gb to b", () => {
    expect(BytesFrom.gigabytes(.001)).toBe(1000000)
})

test("b to mb", () => {
    expect(BytesTo.megabytes(1000000)).toBe(1)
})

test("b to gb", () => {
    expect(BytesTo.gigabytes(1000000)).toBe(.001)
})

test("b to scale", () => {
    expect(BytesTo.scale(10, 10, 1)).toBe(1)
})

test("b to scale", () => {
    expect(BytesFrom.scale(10, 10, 1)).toBe(100)
})