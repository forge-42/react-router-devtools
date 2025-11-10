import { Icon } from "../components/icon/Icon.js"
import { useHtmlErrors } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { openSource } from "../utils/open-source.js"

const ErrorsTab = () => {
	const { styles } = useStyles()
	const { htmlErrors } = useHtmlErrors()

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
		</div>
	)
}

export { ErrorsTab }
