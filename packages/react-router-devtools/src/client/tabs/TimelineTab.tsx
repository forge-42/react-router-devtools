import { type TAG_COLORS, Tag } from "../components/Tag.js"
import { Icon } from "../components/icon/Icon.js"
import { JsonRenderer } from "../components/jsonRenderer.js"
import type { FormEvent, RedirectEvent, TimelineEvent } from "../context/timeline/types.js"
import { useTimelineContext } from "../context/useRDTContext.js"

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
	return (
		<div className="mb-4">
			<time className="mb-2 block text-sm font-normal leading-none text-gray-500">
				Navigated to url: "{event.to + event.search}"
			</time>
			<p className="mb-4 text-base font-normal text-gray-400">{event.hash}</p>
			{event.responseData && (
				<p className="mb-4 text-base font-normal text-gray-400">
					Data received:
					<JsonRenderer data={event.responseData} />
				</p>
			)}
		</div>
	)
}

const FormEventComponent = (event: FormEvent) => {
	const firstPart =
		event.type === "ACTION_REDIRECT"
			? `Redirect from "${event.to}" to "${event.from}"`
			: `Submission to url: "${event.to}"`
	const responseData = event.responseData
	return (
		<div className="mb-4">
			<time className="mb-2 block text-sm font-normal leading-none text-gray-500">
				{firstPart} | encType: {event.encType}{" "}
				{"fetcherKey" in event && typeof event.fetcherKey !== "undefined" ? `| Fetcher Key: ${event.fetcherKey}` : ""}
			</time>
			<div className="flex gap-8">
				{event.data && event.type !== "ACTION_RESPONSE" && (
					<div className="mb-4 truncate text-base font-normal text-gray-400">
						Data sent:
						<JsonRenderer data={event.data} />
					</div>
				)}
				{responseData && (
					<div className="mb-4 truncate text-base font-normal text-gray-400">
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
	const { timeline, clearTimeline } = useTimelineContext()
	return (
		<div className="relative flex h-full flex-col overflow-y-auto p-6 px-6">
			{timeline.length > 0 && (
				<button
					type="button"
					onClick={() => clearTimeline()}
					className="absolute right-3 top-0 z-20 cursor-pointer rounded-lg border border-red-500 px-3 py-1 text-sm font-semibold text-white"
				>
					Clear
				</button>
			)}
			<ol className="relative">
				{timeline.map((event) => {
					return (
						<li key={event.id} className="mb-2 ml-8 animate-fade-in-left">
							<span className="absolute -left-3 mt-2 flex h-6 w-6 animate-fade-in items-center justify-center rounded-full bg-blue-900 ring-4 ring-blue-900">
								<Icon name="Activity" />
							</span>
							<h3 className="-mt-3 mb-1 flex items-center gap-2 text-lg font-semibold text-white">
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
