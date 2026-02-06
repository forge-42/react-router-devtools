import type React from "react"

type TriangleArrowProps = React.SVGProps<SVGSVGElement>
export function TriangleArrow(props: TriangleArrowProps) {
	const { style, ...reset } = props
	const defaultStyle: React.CSSProperties = {
		cursor: "pointer",
		height: "1em",
		width: "1em",
		userSelect: "none",
		display: "flex",
		...style,
	}
	return (
		<svg viewBox="0 0 24 24" fill="var(--w-rjv-arrow-color, currentColor)" style={defaultStyle} {...reset}>
			<path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
		</svg>
	)
}

TriangleArrow.displayName = "JVR.TriangleArrow"
