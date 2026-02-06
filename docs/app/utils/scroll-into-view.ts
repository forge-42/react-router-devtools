export function scrollIntoView(e: React.MouseEvent, id: string, offset = -80, behavior: ScrollBehavior = "smooth") {
	e.preventDefault()

	const element = document.getElementById(id)
	if (!element) return Promise.resolve()

	const targetY = element.getBoundingClientRect().top + window.scrollY + offset

	window.scrollTo({ top: targetY, behavior })

	if (behavior !== "smooth") {
		return Promise.resolve()
	}

	const distance = Math.abs(window.scrollY - targetY)
	const duration = Math.min(distance / 2, 1000)

	return new Promise((resolve) => {
		setTimeout(resolve, duration)
	})
}
