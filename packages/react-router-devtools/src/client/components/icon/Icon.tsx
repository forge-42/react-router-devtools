import { type SVGProps, memo } from "react"
import { cx } from "../../styles/use-styles.js"
import { useStyles } from "../../styles/use-styles.js"
import type { IconName } from "./icons/types.js"

enum IconSize {
	xs = "12",
	sm = "16",
	md = "20",
	lg = "32",
	xl = "40",
	"2xl" = "80",
	jumbo = "160",
}

type IconSizes = keyof typeof IconSize

interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconName
	title?: string
	testId?: string
	className?: string
	size?: IconSizes
}

/** Below array tells the Icon component which components should have fill set to none due do them not looking proper with fill */
const emptyFill: Partial<IconName>[] = []
const strokeIcon: Partial<IconName>[] = []
/**
 * Icon component wrapper for SVG icons.
 * @returns SVG icon as a react component
 */
export const Icon = memo(({ name, title, testId, className, size = "sm", ...props }: IconProps) => {
	const { styles } = useStyles()
	const iconSize = IconSize[size]
	const isEmptyFill = emptyFill.includes(name)
	const isStrokeIcon = strokeIcon.includes(name)
	const iconClasses = cx(styles.icon.base, className, isEmptyFill && styles.icon.fillTransparent)
	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: i don't want titles on hover
		<svg
			className={iconClasses}
			fill={isEmptyFill ? "none" : "currentColor"}
			stroke={isStrokeIcon ? "currentColor" : "none"}
			width={iconSize}
			height={iconSize}
			data-testid={testId}
			data-name={name}
			{...props}
		>
			<defs>
				<symbol
					id="Layout"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
					<line x1="3" x2="21" y1="9" y2="9" />
					<line x1="9" x2="9" y1="21" y2="9" />
				</symbol>
				<symbol
					id="Root"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="16" y="16" width="6" height="6" rx="1" />
					<rect x="2" y="16" width="6" height="6" rx="1" />
					<rect x="9" y="2" width="6" height="6" rx="1" />
					<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
					<path d="M12 12V8" />
				</symbol>
				<symbol
					id="Network"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m13.11 7.664 1.78 2.672" />
					<path d="m14.162 12.788-3.324 1.424" />
					<path d="m20 4-6.06 1.515" />
					<path d="M3 3v16a2 2 0 0 0 2 2h16" />
					<circle cx="12" cy="6" r="2" />
					<circle cx="16" cy="12" r="2" />
					<circle cx="9" cy="15" r="2" />
				</symbol>
				<symbol
					id="X"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</symbol>
				<symbol
					id="Terminal"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="4 17 10 11 4 5" />
					<line x1="12" x2="20" y1="19" y2="19" />
				</symbol>
				<symbol
					id="Settings"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
					<circle cx="12" cy="12" r="3" />
				</symbol>
				<symbol
					id="Send"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m22 2-7 20-4-9-9-4Z" />
					<path d="M22 2 11 13" />
				</symbol>
				<symbol
					id="Radio"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
					<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
					<circle cx="12" cy="12" r="2" />
					<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
					<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
				</symbol>
				<symbol
					id="Network"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect x="16" y="16" width="6" height="6" rx="1" />
					<rect x="2" y="16" width="6" height="6" rx="1" />
					<rect x="9" y="2" width="6" height="6" rx="1" />
					<path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
					<path d="M12 12V8" />
				</symbol>
				<symbol
					id="List"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="8" x2="21" y1="6" y2="6" />
					<line x1="8" x2="21" y1="12" y2="12" />
					<line x1="8" x2="21" y1="18" y2="18" />
					<line x1="3" x2="3.01" y1="6" y2="6" />
					<line x1="3" x2="3.01" y1="12" y2="12" />
					<line x1="3" x2="3.01" y1="18" y2="18" />
				</symbol>
				<symbol
					id="Layers"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
					<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
					<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
				</symbol>
				<symbol
					id="GitMerge"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="18" cy="18" r="3" />
					<circle cx="6" cy="6" r="3" />
					<path d="M6 21V9a9 9 0 0 0 9 9" />
				</symbol>
				<symbol
					id="CornerDownRight"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="15 10 20 15 15 20" />
					<path d="M4 4v7a4 4 0 0 0 4 4h12" />
				</symbol>
				<symbol
					id="CopySlash"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<line x1="12" x2="18" y1="18" y2="12" />
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
					<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
				</symbol>
				<symbol
					id="Columns"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
					<line x1="12" x2="12" y1="3" y2="21" />
				</symbol>
				<symbol
					id="ChevronDown"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m6 9 6 6 6-6" />
				</symbol>
				<symbol
					id="Check"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="20 6 9 17 4 12" />
				</symbol>
				<symbol
					id="Activity"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
				</symbol>
				<symbol
					id="Shield"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
					<path d="m14.5 9-5 5" />
					<path d="m9.5 9 5 5" />
				</symbol>
				<symbol
					id="Accessibility"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="16" cy="4" r="1" />
					<path d="m18 19 1-7-6 1" />
					<path d="m5 8 3-3 5.5 3-2.36 3.5" />
					<path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
					<path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
				</symbol>
			</defs>
			<use href={`#${name}`} />
		</svg>
	)
})
