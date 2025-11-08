import beautify from "beautify"
import { useEffect, useState } from "react"
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued"
import { Icon } from "../components/icon/Icon.js"
import { useHtmlErrors } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { openSource } from "../utils/open-source.js"
// @ts-expect-error
const DiffViewer: typeof ReactDiffViewer.default = ReactDiffViewer.default
	? // @ts-expect-error
		// biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		(ReactDiffViewer.default as any)
	: // biome-ignore lint/suspicious/noExplicitAny: we don't care about the type
		(ReactDiffViewer as any)

const ErrorsTab = () => {
	const { styles } = useStyles()
	const { htmlErrors } = useHtmlErrors()
	const [SSRHtml, setSSRHtml] = useState("")
	const [CSRHtml, setCSRHtml] = useState("")
	const [hasHydrationMismatch, setHasHydrationMismatch] = useState(false)

	useEffect(() => {
		if (typeof window === "undefined") return
		if (!window.HYDRATION_OVERLAY) {
			return
		}
		const ssrHtml = window.HYDRATION_OVERLAY?.SSR_HTML
		const newCSRHtml = window.HYDRATION_OVERLAY?.CSR_HTML

		if (!ssrHtml || !newCSRHtml) return

		const newSSR = beautify(ssrHtml, { format: "html" })
		const newCSR = beautify(newCSRHtml, { format: "html" })
		setSSRHtml(newSSR)
		setCSRHtml(newCSR)
		setHasHydrationMismatch(window.HYDRATION_OVERLAY?.ERROR ?? false)
	}, [])

	return (
		<div className={styles.errorsTab.container}>
			{htmlErrors.length > 0 ? (
				<>
					<div className={styles.errorsTab.headerContainer}>
						<span className={styles.errorsTab.headerTitle}>HTML Nesting Errors</span>
						<hr className={styles.errorsTab.divider} />
					</div>
				</>
			) : (
				<div className={styles.errorsTab.noErrors}>No errors detected!</div>
			)}
			{htmlErrors.map((error) => {
				return (
					<div key={JSON.stringify(error)} className={styles.errorsTab.errorCard}>
						<Icon size="md" className={styles.errorsTab.errorIcon} name="Shield" />
						<div className={styles.errorsTab.errorContent}>
							<div>
								<span className={styles.errorsTab.errorMessage}>{error.child.tag}</span> element can't be nested inside
								of <span className={styles.errorsTab.errorMessage}>{error.parent.tag}</span> element
							</div>
							<div className={styles.errorsTab.errorFileInfo}>
								The parent element is located inside of the
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									onClick={() => error.parent.file && openSource(error.parent.file)}
									className={styles.errorsTab.errorFile}
								>
									{error.parent.file}
								</div>
								file
							</div>
							<div className={styles.errorsTab.errorFileInfo}>
								The child element is located inside of the
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									onClick={() => error.child.file && openSource(error.child.file)}
									className={styles.errorsTab.errorFile}
								>
									{error.child.file}
								</div>
								file
							</div>
						</div>
					</div>
				)
			})}
			{hasHydrationMismatch && (
				<div className={styles.errorsTab.hydrationContainer}>
					<h1 className={styles.errorsTab.hydrationTitle}>Hydration mismatch comparison</h1>
					<hr className={styles.errorsTab.hydrationDivider} />
					<DiffViewer
						oldValue={SSRHtml}
						newValue={CSRHtml}
						leftTitle={"Server-Side Render"}
						rightTitle={"Client-Side Render"}
						compareMethod={DiffMethod.WORDS}
						styles={{
							titleBlock: {
								textAlign: "center",
							},
							variables: {
								light: {
									diffViewerBackground: "#212121",
									diffViewerColor: "#FFF",
									addedBackground: "#044B53",
									addedColor: "white",
									removedBackground: "#632F34",
									removedColor: "white",
									wordAddedBackground: "#055d67",
									wordRemovedBackground: "#7d383f",
									addedGutterBackground: "#034148",
									removedGutterBackground: "#632b30",
									gutterBackground: "#1F2937",
									highlightBackground: "#212121",
									highlightGutterBackground: "#212121",
									codeFoldGutterBackground: "#1F2937",
									codeFoldBackground: "#1F2937",
									emptyLineBackground: "#363946",
									gutterColor: "#white",
									addedGutterColor: "#8c8c8c",
									removedGutterColor: "#8c8c8c",
									codeFoldContentColor: "white",
									diffViewerTitleBackground: "#212121",
									diffViewerTitleColor: "white",
									diffViewerTitleBorderColor: "#353846",
								},
								dark: {
									diffViewerBackground: "#212121",
									diffViewerColor: "#FFF",
									addedBackground: "#044B53",
									addedColor: "white",
									removedBackground: "#632F34",
									removedColor: "white",
									wordAddedBackground: "#055d67",
									wordRemovedBackground: "#7d383f",
									addedGutterBackground: "#034148",
									removedGutterBackground: "#632b30",
									gutterBackground: "#1F2937",
									highlightBackground: "#212121",
									highlightGutterBackground: "#212121",
									codeFoldGutterBackground: "#1F2937",
									codeFoldBackground: "#1F2937",
									emptyLineBackground: "#363946",
									gutterColor: "#white",
									addedGutterColor: "#8c8c8c",
									removedGutterColor: "#8c8c8c",
									codeFoldContentColor: "white",
									diffViewerTitleBackground: "#212121",
									diffViewerTitleColor: "white",
									diffViewerTitleBorderColor: "#353846",
								},
							},
						}}
						extraLinesSurroundingDiff={2}
						useDarkTheme={true}
					/>
				</div>
			)}
		</div>
	)
}

export { ErrorsTab }
