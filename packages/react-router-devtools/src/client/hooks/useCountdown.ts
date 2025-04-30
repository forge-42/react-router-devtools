import { useEffect, useState } from "react"

const getTimeLeft = (countDown: number) => {
	// calculate time left
	const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
	const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

	return { days, hours, minutes, seconds }
}

const useCountdown = (targetDate: string | Date) => {
	const countDownDate = new Date(targetDate).getTime()

	const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

	// biome-ignore lint/correctness/useExhaustiveDependencies: investigate
	useEffect(() => {
		const timeLeft = getTimeLeft(countDown)
		if (timeLeft.seconds <= 0) {
			return
		}
		const interval = setInterval(() => {
			setCountDown(countDownDate - new Date().getTime())
		}, 1000)

		return () => clearInterval(interval)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countDownDate])

	const timeLeft = getTimeLeft(countDown)
	const stringRepresentation = `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}${
		timeLeft.hours ? `${timeLeft.hours}h ` : ""
	}${timeLeft.minutes ? `${timeLeft.minutes}m ` : ""}${timeLeft.seconds ? `${timeLeft.seconds}s` : ""}`
	return { ...timeLeft, stringRepresentation }
}

export { useCountdown }
