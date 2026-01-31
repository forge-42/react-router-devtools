import { bigIntReplacer, convertBigIntToString } from "./bigint-util"

const BIG_INT_VALUE = BigInt(10 ** 20)
const BIG_INT_STRING_VALUE = "100000000000000000000"

describe("bigIntReplacer", () => {
	it("should convert bigint to string", () => {
		const sut = {
			key: BIG_INT_VALUE,
			nestedKey: {
				key: BIG_INT_VALUE,
			},
		}
		const result = JSON.stringify(sut, bigIntReplacer)
		expect(result).toBe(`{"key":"${BIG_INT_STRING_VALUE}","nestedKey":{"key":"${BIG_INT_STRING_VALUE}"}}`)
	})

	it("should return value as is if not a bigint", () => {
		const sut = {
			key: 100,
		}
		const result = JSON.stringify(sut, bigIntReplacer)
		expect(result).toBe('{"key":100}')
	})
})

describe("convertBigIntToString", () => {
	it("should convert bigint to string", () => {
		const result = convertBigIntToString(BIG_INT_VALUE)
		expect(result).toBe(BIG_INT_STRING_VALUE)
	})

	it("should convert bigint in array to string", () => {
		const result = convertBigIntToString([BIG_INT_VALUE, 123])
		expect(result).toEqual([BIG_INT_STRING_VALUE, 123])
	})

	it("should convert bigint in object to string", () => {
		const result = convertBigIntToString({ key: BIG_INT_VALUE, anotherKey: 123 })
		expect(result).toEqual({ key: BIG_INT_STRING_VALUE, anotherKey: 123 })
	})

	it("should handle nested structures", () => {
		const data = {
			key: BIG_INT_VALUE,
			nested: {
				anotherKey: BIG_INT_VALUE,
				array: [BIG_INT_VALUE, 123],
			},
		}
		const expected = {
			key: BIG_INT_STRING_VALUE,
			nested: {
				anotherKey: BIG_INT_STRING_VALUE,
				array: [BIG_INT_STRING_VALUE, 123],
			},
		}
		const result = convertBigIntToString(data)
		expect(result).toEqual(expected)
	})

	it("should return non-bigint values as is", () => {
		const result = convertBigIntToString(123)
		expect(result).toBe(123)
	})

	it("should replace circular references with [Circular]", () => {
		const o: Record<string, unknown> = {}
		o.self = o
		const result = convertBigIntToString(o)
		expect(result).toEqual({ self: "[Circular]" })
	})

	it("should replace circular reference at depth 1 with [Circular]", () => {
		const root: Record<string, unknown> = { a: 1 }
		root.nested = { b: 2, back: root }
		const result = convertBigIntToString(root)
		expect(result).toEqual({
			a: 1,
			nested: { b: 2, back: "[Circular]" },
		})
	})

	it("should not replace shared (non-circular) references with [Circular]", () => {
		const shared = { x: 1, y: 2 }
		const root = { a: shared, b: shared }
		const result = convertBigIntToString(root)
		expect(result).toEqual({
			a: { x: 1, y: 2 },
			b: { x: 1, y: 2 },
		})
	})

	it("should replace deep acyclic structure beyond maxDepth with [Max depth reached]", () => {
		let deep: Record<string, unknown> = {}
		const root = deep
		for (let i = 0; i < 60; i++) {
			deep.next = {}
			deep = deep.next as Record<string, unknown>
		}
		const result = convertBigIntToString(root)
		let current: unknown = result
		let depth = 0
		while (current !== null && typeof current === "object" && "next" in current) {
			current = (current as Record<string, unknown>).next
			depth++
		}
		expect(depth).toBe(50)
		expect(current).toBe("[Max depth reached]")
	})

	it("should traverse deeper when maxDepth option is increased", () => {
		let deep: Record<string, unknown> = {}
		const root = deep
		for (let i = 0; i < 60; i++) {
			deep.next = {}
			deep = deep.next as Record<string, unknown>
		}
		const result = convertBigIntToString(root, { maxDepth: 100 })
		let current: unknown = result
		let depth = 0
		while (current !== null && typeof current === "object" && "next" in current) {
			current = (current as Record<string, unknown>).next
			depth++
		}
		expect(depth).toBe(60)
		expect(current).toEqual({})
	})
})
