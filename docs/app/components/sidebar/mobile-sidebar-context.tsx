import { createContext, useContext, useState } from "react"

interface MobileSidebarContextValue {
	isOpen: boolean
	open: () => void
	close: () => void
	toggle: () => void
}

const MobileSidebarContext = createContext<MobileSidebarContextValue | null>(null)

export const MobileSidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setOpen] = useState(false)

	const value: MobileSidebarContextValue = {
		isOpen,
		open: () => setOpen(true),
		close: () => setOpen(false),
		toggle: () => setOpen((prev) => !prev),
	}

	return <MobileSidebarContext.Provider value={value}>{children}</MobileSidebarContext.Provider>
}

export const useMobileSidebar = () => {
	const ctx = useContext(MobileSidebarContext)
	if (!ctx) throw new Error("Missing MobileSidebarProvider")
	return ctx
}
