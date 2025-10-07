import { add } from "date-fns/add"
import { formatDistance } from "date-fns/formatDistance"
import type { CacheControl } from "../../server/parser.js"
import { useCountdown } from "../hooks/useCountdown.js"
import { Tag } from "./Tag.js"

interface CacheInfoProps {
	cacheDate: Date
	cacheControl: CacheControl
}

const CacheInfo = ({ cacheDate, cacheControl }: CacheInfoProps) => {
	const { maxAge, sMaxage, private: isPrivate } = cacheControl

	const age = !isPrivate && !maxAge ? sMaxage : maxAge
	const targetDate = add(cacheDate, { seconds: age ? Number.parseInt(age) : 0 })
	const { minutes, seconds, stringRepresentation } = useCountdown(targetDate)
	const distance = formatDistance(targetDate, cacheDate, { addSuffix: true })
	if (seconds <= 0) {
		return
	}
	return (
		<Tag color={minutes < 1 ? "RED" : "PURPLE"}>
			[{cacheControl.private ? "Private" : "Shared"}] Loader Cache expires {distance} ({stringRepresentation})
		</Tag>
	)
}

export { CacheInfo }
