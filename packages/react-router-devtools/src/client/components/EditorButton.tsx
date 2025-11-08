import { useStyles } from "../styles/use-styles.js"

interface EditorButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void
}

const EditorButton = ({ onClick, ...props }: EditorButtonProps) => {
	const { styles } = useStyles()
	return (
		<button onClick={onClick} type="button" className={styles.editorButton} {...props}>
			Open in Editor
		</button>
	)
}

export { EditorButton }
