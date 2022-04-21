import { BytesFrom, BytesTo } from "."

test("b to mb", () => {
    expect(BytesTo.megabytes(1)).toBe(0.000001)
    expect(BytesFrom.megabytes(0.1)).toBe(100000)
})

test("b to gb", () => {
    expect(BytesTo.gigabytes(1000)).toBe(0.000001)
    expect(BytesFrom.gigabytes(0.01)).toBe(10000000)
})