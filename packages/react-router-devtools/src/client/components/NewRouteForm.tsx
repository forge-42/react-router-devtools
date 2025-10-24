import { useState } from "react"
import { cx, useStyles } from "../styles/use-styles.js"
import { Checkbox } from "./Checkbox.js"
import { Input } from "./Input.js"

interface NewRouteOptions {
	path: string
	loader: boolean
	clientLoader: boolean
	action: boolean
	clientAction: boolean
	headers: boolean
	errorBoundary: boolean
	revalidate: boolean
	handler: boolean
	meta: boolean
	links: boolean
}

const DEFAULT_VALUES = {
	path: "",
	loader: false,
	clientLoader: false,
	action: false,
	clientAction: false,
	headers: false,
	errorBoundary: false,
	revalidate: false,
	handler: false,
	meta: false,
	links: false,
}

const NewRouteForm = () => {
	const { styles } = useStyles()
	const [newRouteInfo, setNewRouteInfo] = useState<NewRouteOptions>(DEFAULT_VALUES)

	const handleSubmit = () => {
		const { path, ...options } = newRouteInfo
		import.meta.hot?.send("add-route", { type: "add-route", path, options })
	}

	const setNewInfo = (info: Partial<NewRouteOptions>) => {
		setNewRouteInfo({ ...newRouteInfo, ...info })
	}
	return (
		<div className={styles.newRouteForm.container}>
			<div className={styles.newRouteForm.label}>Route path:</div>
			<Input
				onBlur={() =>
					setNewInfo({
						path: newRouteInfo.path.trim(),
					})
				}
				onChange={(e) => setNewInfo({ path: e.target.value })}
				className={styles.newRouteForm.inputMargin}
			/>
			<span className={styles.newRouteForm.hint}>
				This will be added to your routes folder under your entered name, only supports .tsx and .ts extensions, you can
				also emit the extension
			</span>
			<div className={styles.newRouteForm.label}>Additional options:</div>
			<Checkbox
				value={newRouteInfo.loader}
				onChange={() =>
					setNewInfo({
						loader: !newRouteInfo.loader,
					})
				}
				id="loader"
			>
				Add a loader
			</Checkbox>{" "}
			<Checkbox
				value={newRouteInfo.clientLoader}
				onChange={() =>
					setNewInfo({
						clientLoader: !newRouteInfo.clientLoader,
					})
				}
				id="clientLoader"
			>
				Add a clientLoader
			</Checkbox>
			<Checkbox
				value={newRouteInfo.action}
				onChange={() =>
					setNewInfo({
						action: !newRouteInfo.action,
					})
				}
				id="action"
			>
				Add an action
			</Checkbox>{" "}
			<Checkbox
				value={newRouteInfo.clientAction}
				onChange={() =>
					setNewInfo({
						clientAction: !newRouteInfo.clientAction,
					})
				}
				id="clientAction"
			>
				Add a clientAction
			</Checkbox>
			<Checkbox
				value={newRouteInfo.errorBoundary}
				onChange={() =>
					setNewInfo({
						errorBoundary: !newRouteInfo.errorBoundary,
					})
				}
				id="error-boundary"
			>
				Add an error boundary
			</Checkbox>
			<Checkbox
				value={newRouteInfo.handler}
				onChange={() =>
					setNewInfo({
						handler: !newRouteInfo.handler,
					})
				}
				id="handle"
			>
				Add a handle
			</Checkbox>
			<Checkbox value={newRouteInfo.meta} onChange={() => setNewInfo({ meta: !newRouteInfo.meta })} id="meta">
				Add a meta export
			</Checkbox>
			<Checkbox value={newRouteInfo.links} onChange={() => setNewInfo({ links: !newRouteInfo.links })} id="links">
				Add a links export
			</Checkbox>
			<Checkbox
				value={newRouteInfo.headers}
				onChange={() =>
					setNewInfo({
						headers: !newRouteInfo.headers,
					})
				}
				id="headers"
			>
				Add a headers export
			</Checkbox>
			<Checkbox
				value={newRouteInfo.revalidate}
				onChange={() =>
					setNewInfo({
						revalidate: !newRouteInfo.revalidate,
					})
				}
				id="shouldRevalidate"
			>
				Add a shouldRevalidate export
			</Checkbox>
			<button
				onClick={handleSubmit}
				disabled={!newRouteInfo.path}
				type="button"
				className={cx(styles.newRouteForm.submitButton, !newRouteInfo.path && styles.newRouteForm.submitButtonDisabled)}
			>
				Add route
			</button>
		</div>
	)
}

export { NewRouteForm }
