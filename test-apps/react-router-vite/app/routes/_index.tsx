import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { useFetcher, useSubmit } from "react-router"

// Server middleware for index route
const indexServerMiddleware = async (args: any, next: () => Promise<Response>) => {
	return next()
}

export const middleware = [indexServerMiddleware]

// Client middleware for index route
const indexClientMiddleware = async (args: any, next: () => Promise<Response>) => {
	return next()
}

export const clientMiddleware = [indexClientMiddleware]

export const meta: MetaFunction = () => {
	return [{ title: "React Router DevTools" }, { name: "description", content: "Developer tools for React Router" }]
}

export const loader = async ({ request, context, devTools, params }: LoaderFunctionArgs) => {
	const trace = devTools?.tracing.trace
	const data = await trace?.("Loader call - GET users", async () => {
		const also = await new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("test")
			}, 200)
		})
		return {
			custom: "data",
			also,
		}
	})
	const test = await new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("test")
		}, 200)
	})
	const test1 = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("test1")
		}, 300)
	})
	return { message: "Hello World!", test, test1, data, bigInt: BigInt(10) }
}

export default function Index() {
	const lFetcher = useFetcher({ key: "lfetcher" })
	const pFetcher = useFetcher({ key: "test" })
	const submit = useSubmit()
	const data = new FormData()
	data.append("test", "test")
	data.append("array", "test")
	data.append("array", "test1")
	data.append("person.name", "test1")
	data.append("person.surname", "test1")
	data.append("obj", JSON.stringify({ test: "test" }))

	const buttonStyle = {
		padding: "0.625rem 1.25rem",
		fontSize: "0.875rem",
		fontWeight: "600",
		color: "#ffffff",
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		border: "1px solid rgba(59, 130, 246, 0.3)",
		borderRadius: "0.5rem",
		cursor: "pointer",
		transition: "all 0.2s ease",
		boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
	}

	return (
		<div
			style={{
				fontFamily: "system-ui, -apple-system, sans-serif",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
				margin: 0,
				padding: "2rem",
			}}
		>
      <div
				style={{
					textAlign: "center",
					color: "white",
				}}
			>
				<h1
					style={{
						fontSize: "clamp(3rem, 8vw, 6rem)",
						fontWeight: "800",
						margin: 0,
						lineHeight: 1.2,
						textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
						letterSpacing: "-0.02em",
					}}
				>
					React Router
					<br />
					<span
						style={{
							background: "linear-gradient(to right, #3b82f6, #60a5fa)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						DevTools
					</span>
				</h1>
				<p
					style={{
						fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
						marginTop: "1.5rem",
						opacity: 0.9,
						fontWeight: "300",
					}}
				>
					Developer tools for modern React Router applications
				</p>
			</div>
			{/* Buttons at the top */}
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "0.75rem",
					justifyContent: "center",
					marginBottom: "3rem",
					maxWidth: "900px",
				}}
			>
				<button
					style={buttonStyle}
					onClick={(e) => {
						console.log(e)
						lFetcher.submit(null, { method: "get", action: "/" })
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					FETCHER Loader
				</button>
				<button
					style={buttonStyle}
					onClick={() => pFetcher.submit(data, { method: "POST", action: "/" })}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					FETCHER Action
				</button>
				<button
					style={buttonStyle}
					onClick={() => submit(null, { method: "POST", action: "/" })}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					SUBMIT Action
				</button>
				<button
					style={buttonStyle}
					onClick={() => submit(data, { method: "PATCH", action: "/" })}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					SUBMIT PATCH
				</button>
				<button
					style={buttonStyle}
					onClick={() => submit(null, { method: "DELETE", action: "/" })}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					SUBMIT DELETE
				</button>
				<button
					style={buttonStyle}
					onClick={() => submit(null, { method: "PUT", action: "/" })}
					onMouseEnter={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)"
						e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "translateY(0)"
						e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
					}}
				>
					SUBMIT PUT
				</button>
			</div>

		</div>
	)
}
