import { type TAG_COLORS, Tag } from "../components/Tag.js"
import { Icon } from "../components/icon/Icon.js"
import { JsonRenderer } from "../components/jsonRenderer.js"
import type { FormEvent, RedirectEvent, TimelineEvent } from "../context/timeline/types.js"
import { useTimelineContext } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"

const Translations: Record<TimelineEvent["type"], string> = {
	REDIRECT: "Normal Page navigation",
	FETCHER_REDIRECT: "Page navigation due to fetcher",
	ACTION_REDIRECT: "Page navigation due to action",
	FORM_SUBMISSION: "Form submission",
	FETCHER_SUBMIT: "Form submission from a fetcher",
	ACTION_RESPONSE: "Action response",
	FETCHER_RESPONSE: "Fetcher action response",
}

const RedirectEventComponent = (event: RedirectEvent) => {
	const { styles } = useStyles()
	return (
		<div className={styles.timelineTab.eventContainer}>
			<time className={styles.timelineTab.eventTime}>Navigated to url: "{event.to + event.search}"</time>
			<p className={styles.timelineTab.eventText}>{event.hash}</p>
			{event.responseData && (
				<p className={styles.timelineTab.eventText}>
					Data received:
					<JsonRenderer data={event.responseData} />
				</p>
			)}
		</div>
	)
}

const FormEventComponent = (event: FormEvent) => {
	const { styles } = useStyles()
	const firstPart =
		event.type === "ACTION_REDIRECT"
			? `Redirect from "${event.to}" to "${event.from}"`
			: `Submission to url: "${event.to}"`
	const responseData = event.responseData
	return (
		<div className={styles.timelineTab.eventContainer}>
			<time className={styles.timelineTab.eventTime}>
				{firstPart} | encType: {event.encType}{" "}
				{"fetcherKey" in event && typeof event.fetcherKey !== "undefined" ? `| Fetcher Key: ${event.fetcherKey}` : ""}
			</time>
			<div className={styles.timelineTab.eventDataContainer}>
				{event.data && event.type !== "ACTION_RESPONSE" && (
					<div className={styles.timelineTab.eventData}>
						Data sent:
						<JsonRenderer data={event.data} />
					</div>
				)}
				{responseData && (
					<div className={styles.timelineTab.eventData}>
						Server Response Data:
						<JsonRenderer data={responseData} />
					</div>
				)}
			</div>
		</div>
	)
}

export const METHOD_COLORS: Record<string, keyof typeof TAG_COLORS> = {
	GET: "GREEN",
	POST: "BLUE",
	PUT: "TEAL",
	DELETE: "RED",
	PATCH: "PURPLE",
}

const TimelineTab = () => {
	const { styles } = useStyles()
	const { timeline, clearTimeline } = useTimelineContext()
	return (
		<div className={styles.timelineTab.container}>
			{timeline.length > 0 && (
				<button type="button" onClick={() => clearTimeline()} className={styles.timelineTab.clearButton}>
					Clear
				</button>
			)}
			<ol className={styles.timelineTab.list}>
				{timeline.map((event) => {
					return (
						<li key={event.id} className={styles.timelineTab.item}>
							<span className={styles.timelineTab.icon}>
								<Icon name="Activity" />
							</span>
							<h3 className={styles.timelineTab.title}>
								{Translations[event.type]}
								{event?.method && <Tag color={METHOD_COLORS[event.method]}>{event.method}</Tag>}
							</h3>
							{event.type === "REDIRECT" || event.type === "FETCHER_REDIRECT" ? (
								<RedirectEventComponent {...event} />
							) : (
								<FormEventComponent {...event} />
							)}
						</li>
					)
				})}
			</ol>
		</div>
	)
}

export { TimelineTab }
