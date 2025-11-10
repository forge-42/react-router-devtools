import { useStyles } from "../styles/use-styles.js"
import { Icon } from "./icon/Icon.js"

interface EditorButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void
}

const EditorButton = ({ onClick, ...props }: EditorButtonProps) => {
	const { styles } = useStyles()
	return (
		<button onClick={onClick} type="button" className={styles.editorButton} {...props}>
			<Icon name="Send" size="sm" />
			Open in Editor
		</button>
	)
}

export { EditorButton }
