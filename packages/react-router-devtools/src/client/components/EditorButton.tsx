import { useStyles } from "../styles/use-styles.js"

interface EditorButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void
	name: string
}

const EditorButton = ({ name, onClick, ...props }: EditorButtonProps) => {
	const { styles } = useStyles()
	return (
		<button onClick={onClick} type="button" className={styles.editorButton} {...props}>
			Open in {name}
		</button>
	)
}

export { EditorButton }
