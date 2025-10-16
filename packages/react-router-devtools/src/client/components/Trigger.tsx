import clsx from "clsx"
import { usePersistOpen, useSettingsContext } from "../context/useRDTContext.js"
import { Logo } from "./Logo.js"

export const Trigger = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const { settings } = useSettingsContext()
	const { setPersistOpen } = usePersistOpen()
	const { hideUntilHover, position } = settings
	const handleHover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, event: "enter" | "leave") => {
		if (!hideUntilHover) return
		const classesToRemove = "opacity-0"
		const classesToAdd = "opacity-100"
		if (event === "enter") {
			e.currentTarget.classList.remove(classesToRemove)
			e.currentTarget.classList.add(classesToAdd)
		}
		if (event === "leave") {
			e.currentTarget.classList.remove(classesToAdd)
			e.currentTarget.classList.add(classesToRemove)
		}
	}

	return (
		<button
			type="button"
			data-testid="react-router-devtools-trigger"
			style={{ zIndex: 9999 }}
			onClick={() => {
				setIsOpen(!isOpen)
				setPersistOpen(!isOpen)
			}}
			onMouseEnter={(e) => handleHover(e, "enter")}
			onMouseLeave={(e) => handleHover(e, "leave")}
			className={clsx(
				"fixed m-1.5 h-14 w-14 cursor-pointer p-2 bg-main flex items-center justify-center rounded-full transition-all ",
				"hover:cursor-pointer hover:ring-2 hover:ring-offset-2 ring-[#212121]",
				hideUntilHover && "opacity-0",
				position === "bottom-right" && "bottom-0 right-0",
				position === "bottom-left" && "bottom-0 left-0",
				position === "top-right" && "right-0 top-0",
				position === "top-left" && "left-0 top-0",
				position === "middle-right" && "right-0 top-1/2 -translate-y-1/2",
				position === "middle-left" && "left-0 top-1/2 -translate-y-1/2",
				isOpen && "hidden" // Hide the button when the dev tools is open
			)}
		>
			<Logo
				className={clsx(
					"focus:outline-none w-full h-full -mt-1 rounded-full transition-all duration-200 overflow-visible"
				)}
			/>
		</button>
	)
}
