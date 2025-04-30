import React from "react"

function debounce(func: (...args: any[]) => any, timeout = 300) {
	let timer: NodeJS.Timeout
	return (...args: any[]) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			/* @ts-ignore */
			func.apply(this, args)
		}, timeout)
	}
}

export function useDebounce(callback: (...args: any[]) => void, delay = 300) {
	const callbackRef = React.useRef(callback)
	React.useEffect(() => {
		callbackRef.current = callback
	})
	return React.useMemo(() => debounce((...args) => callbackRef.current(...args), delay), [delay])
}
