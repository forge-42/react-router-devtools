import { cn } from "../css"

describe("cn", () => {
	it("should merge classes", () => {
		// Arrange
		const classes = ["class1", "class2"]
		// Act
		const result = cn(...classes)
		// Assert
		expect(result).toBe("class1 class2")
	})

	it("should merge classes with undefined", () => {
		// Arrange
		const classes = ["class1", undefined, "class2"]
		// Act
		const result = cn(...classes)
		// Assert
		expect(result).toBe("class1 class2")
	})

	it("should merge classes with empty string", () => {
		// Arrange
		const classes = ["class1", "", "class2"]
		// Act
		const result = cn(...classes)
		// Assert
		expect(result).toBe("class1 class2")
	})

	it("should remove duplicates", () => {
		// Arrange
		const classes = ["mb-1", "mb-2"]
		// Act
		const result = cn(...classes)
		// Assert
		expect(result).toBe("mb-2")
	})
})
