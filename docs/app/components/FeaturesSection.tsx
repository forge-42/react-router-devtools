import { StickyScroll } from "./ui/sticky-scroll-reveral"

const content = [
	{
		title: "Data display",
		description: (
			<div className="inline-block">
				See every
				<span className="mx-1 text-green-500">loader data, route params and server information</span>
				in real time. See your deferred data load in and see your cached loader information . No more
				<span className="mx-1 font-bold text-red-500">console.log</span>Get the information you need when you need it.
			</div>
		),
		content: (
			<div className="flex h-full  w-full items-center justify-center text-white">
				<img src="/active-tab.png" className="h-full w-full object-fill" alt="linear board demo" />
			</div>
		),
	},
	{
		title: "Event Timeline",
		description:
			"See all your navigations, submissions and everything in between in real-time with the timeline tab. No more guessing, no more wondering, see exactly what happens behind the hood.",
		content: (
			<div className="flex h-full  w-full items-center justify-center text-white">
				<img src="/timeline.gif" className="h-full w-full object-fill" alt="linear board demo" />
			</div>
		),
	},
	{
		title: "Routes tab",
		description: (
			<div>
				See <span className="text-green-500">all</span> your project routes in a
				<span className="mx-1 text-green-500">tree/list</span>view, directly open them in the browser with a click of a
				button, and see which routes are currently active on the page.
				<span className="mx-1 font-bold text-green-500">No more guessing.</span>
			</div>
		),
		content: (
			<div className="flex h-full  w-full items-center justify-center text-white">
				<img src="/routes.gif" className="h-full w-full object-fill" alt="linear board demo" />
			</div>
		),
	},
	{
		title: "Hydration mismatch detector",
		description: (
			<div>
				See the difference in HTML rendered on the
				<span className="mx-1 text-green-500">server</span> and the
				<span className="mx-1 text-red-500">client</span> and figure out what is causing your hydration issues.
			</div>
		),
		content: (
			<div className="flex h-full  w-full items-center justify-center text-white">
				<img src="/error-tab.png" className="h-full w-full object-fill" alt="linear board demo" />
			</div>
		),
	},
	{
		title: "Server logging",
		description: (
			<div>
				See your server logs in real time:
				<ul className="text-green-500">
					<li className="ml-2">Loader/action hits</li>
					<li className="ml-2">Server errors</li>
					<li className="ml-2">Cache cleanup </li>
					<li className="ml-2"> Cache headers</li>
					<li className="ml-2"> Cookies set</li>
				</ul>
				Granular logs for everything that your server does so you don't have to wonder ever again!
			</div>
		),
		content: (
			<div className="flex h-full  w-full items-center justify-center text-white">
				<img src="/logs.png" className="h-full w-full object-fill" alt="linear board demo" />
			</div>
		),
	},
]
export function FeaturesSection() {
	return (
		<div className="-mt-40 w-full lg:mt-0">
			<StickyScroll content={content} />
		</div>
	)
}
