import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay = 250) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const id = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(id)
	}, [value, delay])

	return debouncedValue
}
