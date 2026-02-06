
import { NoteEditor } from './__note-editor'

export { action } from './__note-editor.server'

export async function loader({ request }: any) {
	return {}
}

export default NoteEditor
