export const diffInMs = (start: number, end: number = performance.now()) => Number((end - start).toFixed(2))

export const secondsToHuman = (s: number) => {
	if (s > 3600) {
		const hours = Math.floor(s / 3600)
		const minutes = Math.floor((s % 3600) / 60)
		const seconds = Math.floor((s % 3600) % 60)
		const minutesString = minutes < 10 ? `0${minutes}` : minutes
		const secondsString = seconds < 10 ? `0${seconds}` : seconds

		if (minutes === 0 && seconds === 0) return `${hours}h`
		if (seconds === 0) return `${hours}:${minutesString}:${secondsString}h`
		return `${hours}:${minutesString}:${secondsString}h`
	}
	if (s > 60) {
		const minutes = Math.floor(s / 60)
		const seconds = Math.floor(s % 60)
		const secondsString = seconds < 10 ? `0${seconds}` : seconds
		if (seconds === 0 && minutes === 60) return "1h"
		if (seconds === 0) return `${minutes}m`
		return `${minutes}:${secondsString}m`
	}
	if (s === 60) return "1m"
	return `${s}s`
}
