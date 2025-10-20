import { useEffect, useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from "react-router"
import type { LinksFunction } from "react-router"
import { useChangeLanguage } from "remix-i18next/react"
import type { Route } from "./+types/root"
import { ClientHintCheck, getHints } from "./services/client-hints"
import tailwindcss from "./tailwind.css?url"
import { fonts } from "./utils/fonts"
import { getDomain } from "./utils/get-domain"
import { THEME, getStorageItem, setStorageItem } from "./utils/local-storage"
import { getSystemTheme } from "./utils/theme"
import { normalizeVersion } from "./utils/version-resolvers"

export async function loader({ context, request, params }: Route.LoaderArgs) {
	const { lang, clientEnv } = context
	const hints = getHints(request)
	const { version } = params
	const { version: normalizedVersion } = normalizeVersion(version)
	const { domain } = getDomain(request)
	return { lang, clientEnv, hints, version: normalizedVersion, domain }
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindcss }]

export const handle = {
	i18n: "common",
}

export default function App({ loaderData }: Route.ComponentProps) {
	const { lang, clientEnv } = loaderData
	useChangeLanguage(lang)
	const fontFaceRules = fonts
		.map(
			(font) => `
                @font-face {
                    font-family: "${font.fontFamily}";
                    font-style: ${font.fontStyle};
                    font-weight: ${font.fontWeight};
                    src: url(${font.src}) format("truetype");
                    font-display: swap;
                }
            `
		)
		.join("\n")
	return (
		<>
			<Outlet />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: We set the window.env variable to the client env */}
			<script dangerouslySetInnerHTML={{ __html: `window.env = ${JSON.stringify(clientEnv)}` }} />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: fonts loading*/}
			<style dangerouslySetInnerHTML={{ __html: fontFaceRules }} />
		</>
	)
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const { i18n } = useTranslation()
	const [theme, setTheme] = useState(() => {
		if (typeof window === "undefined" || !window.localStorage) {
			return "dark"
		}
		return getStorageItem(THEME) || getSystemTheme()
	})

	useLayoutEffect(() => {
		const storedTheme = getStorageItem(THEME)
		if (storedTheme) {
			setTheme(storedTheme)
		}
	}, [])

	useEffect(() => {
		setStorageItem(THEME, theme)
	}, [theme])

	return (
		<html className="overflow-y-auto overflow-x-hidden " lang={i18n.language} dir={i18n.dir()} data-theme={theme}>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Sets correct theme on initial load
					dangerouslySetInnerHTML={{
						__html: `
							(function () {
								try {
									var theme = localStorage.getItem("theme");
									if (!theme) {
										theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
									}
									document.documentElement.setAttribute("data-theme", theme);
								} catch (_) {}
							})();
						`,
					}}
				/>
				<ClientHintCheck />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full w-full bg-[var(--color-background)]">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export const ErrorBoundary = () => {
	const navigate = useNavigate()
	const error = useRouteError()
	const { t } = useTranslation()
	// Constrain the generic type so we don't provide a non-existent key
	const statusCode = () => {
		if (!isRouteErrorResponse(error)) {
			return "500"
		}
		// Supported error code messages
		switch (error.status) {
			case 200:
				return "200"
			case 403:
				return "403"
			case 404:
				return "404"
			default:
				return "500"
		}
	}
	const errorStatusCode = statusCode()
	if (errorStatusCode === "404") {
		return (
			<div className="relative flex h-full min-h-screen w-screen items-center justify-center bg-[var(--color-background)] sm:pt-8 sm:pb-16">
				<div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
					<div className="relative flex min-h-72 flex-col items-center justify-center p-8 sm:overflow-hidden sm:rounded-2xl md:p-12 lg:p-16">
						<h1 className="mb-4 text-center font-bold text-4xl text-[var(--color-text-active)] sm:text-5xl">
							{t(`error.${errorStatusCode}.title`)}
						</h1>
						<p className="mb-8 max-w-2xl text-center text-[var(--color-text-muted)] text-lg">
							{t(`error.${errorStatusCode}.description`)}
						</p>

						<div className="flex gap-4">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-2 font-medium text-[var(--color-text-normal)] text-sm transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-hover)]"
							>
								{t("buttons.back")}
							</button>
							<Link
								to="/"
								className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background-active)] px-5 py-2 font-medium text-[var(--color-text-normal)] text-sm transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text-hover)]"
							>
								{t("buttons.home")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className="relative flex h-full min-h-screen w-screen items-center justify-center bg-[var(--color-background)] sm:pt-8 sm:pb-16">
			<div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
				<div className="relative flex min-h-72 flex-col items-center justify-center p-8 sm:overflow-hidden sm:rounded-2xl md:p-12 lg:p-16">
					<h1 className="mb-4 text-center font-bold text-4xl text-[var(--color-text-active)] sm:text-5xl">
						{t(`error.${errorStatusCode}.title`)}
					</h1>
					<p className="mb-8 max-w-2xl text-center text-[var(--color-text-muted)] text-lg ">
						{t(`error.${errorStatusCode}.description`)}
					</p>
				</div>
			</div>
		</div>
	)
}
