import * as goober from "goober"

import { useEffect, useState } from "react"
import { tokens } from "./tokens"

// Utility to combine class names (like clsx/cx)
export const cx = (...classes: (string | boolean | undefined | null)[]) => {
	return classes.filter(Boolean).join(" ")
}

// Global reset styles for the dev tools container
// Using glob() to inject global styles scoped to .react-router-dev-tools without creating a class
// This avoids specificity issues since the selector starts from the container, not a generated class
goober.glob`
	.react-router-dev-tools ::before,
	.react-router-dev-tools ::after {
		--tw-content: "";
	}

	.react-router-dev-tools :where(*),
	.react-router-dev-tools :where(::before),
	.react-router-dev-tools :where(::after) {
		box-sizing: border-box;
		border-width: 0;
		border-style: solid;
		border-color: #e5e7eb;
	}

	.react-router-dev-tools .w-json-view-container {
		background-color: transparent !important;
	}

	.react-router-dev-tools .w-rjv-arrow {
		margin-left: -12px;
	}

	.react-router-dev-tools :where(hr) {
		height: 0;
		color: initial;
		border-top-width: 1px;
	}

	.react-router-dev-tools *::-webkit-scrollbar-track {
		border-radius: 0.4rem;
		margin-right: 0.2rem;
		background-color: #191c24;
		display: none;
	}

	.react-router-dev-tools *::-webkit-scrollbar {
		width: 0.4rem;
		height: 0.4rem;
		margin-right: 0.2rem;
		background-color: transparent;
	}

	.react-router-dev-tools *::-webkit-scrollbar-thumb {
		border-radius: 0.4rem;
		background-color: #f1c40f;
	}

	.react-router-dev-tools :where(abbr[title]) {
		-webkit-text-decoration: underline dotted;
		text-decoration: underline dotted;
	}

	.react-router-dev-tools :where(h1),
	.react-router-dev-tools :where(h2),
	.react-router-dev-tools :where(h3),
	.react-router-dev-tools :where(h4),
	.react-router-dev-tools :where(h5),
	.react-router-dev-tools :where(h6) {
		font-size: initial;
		font-weight: initial;
	}

	.react-router-dev-tools :where(a) {
		color: initial;
		text-decoration: inherit;
	}

	.react-router-dev-tools :where(b),
	.react-router-dev-tools :where(strong) {
		font-weight: bolder;
	}

	.react-router-dev-tools :where(code),
	.react-router-dev-tools :where(kbd),
	.react-router-dev-tools :where(samp),
	.react-router-dev-tools :where(pre) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
		font-size: 1em;
	}

	.react-router-dev-tools :where(small) {
		font-size: 80%;
	}

	.react-router-dev-tools :where(sub),
	.react-router-dev-tools :where(sup) {
		font-size: 75%;
		line-height: 0;
		position: relative;
		vertical-align: baseline;
	}

	.react-router-dev-tools :where(sub) {
		bottom: -0.25em;
	}

	.react-router-dev-tools :where(sup) {
		top: -0.5em;
	}

	.react-router-dev-tools :where(table) {
		text-indent: 0;
		border-color: initial;
		border-collapse: collapse;
	}

	.react-router-dev-tools :where(button),
	.react-router-dev-tools :where(input),
	.react-router-dev-tools :where(optgroup),
	.react-router-dev-tools :where(select),
	.react-router-dev-tools :where(textarea) {
		font-family: inherit;
		font-size: 100%;
		font-weight: inherit;
		line-height: inherit;
		color: initial;
		margin: 0;
		padding: 0;
	}

	.react-router-dev-tools :where(button),
	.react-router-dev-tools :where(select) {
		text-transform: none;
	}

	.react-router-dev-tools :where(button),
	.react-router-dev-tools :where([type="button"]),
	.react-router-dev-tools :where([type="reset"]),
	.react-router-dev-tools :where([type="submit"]) {
		-webkit-appearance: button;
		background-color: transparent;
		background-image: none;
	}

	.react-router-dev-tools :where(:-moz-focusring) {
		outline: auto;
	}

	.react-router-dev-tools :where(:-moz-ui-invalid) {
		box-shadow: none;
	}

	.react-router-dev-tools :where(progress) {
		vertical-align: baseline;
	}

	.react-router-dev-tools ::-webkit-inner-spin-button,
	.react-router-dev-tools ::-webkit-outer-spin-button {
		height: auto;
	}

	.react-router-dev-tools :where([type="search"]) {
		-webkit-appearance: textfield;
		outline-offset: -2px;
	}

	.react-router-dev-tools ::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	.react-router-dev-tools ::-webkit-file-upload-button {
		-webkit-appearance: button;
		font: inherit;
	}

	.react-router-dev-tools :where(summary) {
		display: list-item;
	}

	.react-router-dev-tools :where(blockquote),
	.react-router-dev-tools :where(dl),
	.react-router-dev-tools :where(dd),
	.react-router-dev-tools :where(h1),
	.react-router-dev-tools :where(h2),
	.react-router-dev-tools :where(h3),
	.react-router-dev-tools :where(h4),
	.react-router-dev-tools :where(h5),
	.react-router-dev-tools :where(h6),
	.react-router-dev-tools :where(hr),
	.react-router-dev-tools :where(figure),
	.react-router-dev-tools :where(p),
	.react-router-dev-tools :where(pre) {
		margin: 0;
	}

	.react-router-dev-tools :where(fieldset) {
		margin: 0;
		padding: 0;
	}

	.react-router-dev-tools :where(legend) {
		padding: 0;
	}

	.react-router-dev-tools :where(ol),
	.react-router-dev-tools :where(ul),
	.react-router-dev-tools :where(menu) {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.react-router-dev-tools :where(textarea) {
		resize: vertical;
	}

	.react-router-dev-tools input::-moz-placeholder,
	.react-router-dev-tools textarea::-moz-placeholder {
		opacity: 1;
		color: #9ca3af;
	}

	.react-router-dev-tools input::placeholder,
	.react-router-dev-tools textarea::placeholder {
		opacity: 1;
		color: #9ca3af;
	}

	.react-router-dev-tools :where(button),
	.react-router-dev-tools :where([role="button"]) {
		cursor: pointer;
	}

	.react-router-dev-tools :where(:disabled) {
		cursor: default;
	}

	.react-router-dev-tools :where(img),
	.react-router-dev-tools :where(svg:not(.w-rjv-copied)),
	.react-router-dev-tools :where(video),
	.react-router-dev-tools :where(canvas),
	.react-router-dev-tools :where(audio),
	.react-router-dev-tools :where(iframe),
	.react-router-dev-tools :where(embed),
	.react-router-dev-tools :where(object) {
		display: block;
		vertical-align: middle;
	}

	.react-router-dev-tools :where(img),
	.react-router-dev-tools :where(video) {
		max-width: 100%;
		height: auto;
	}

	.react-router-dev-tools :where([hidden]) {
		display: none;
	}

	.react-router-dev-tools :where(*) {
		line-height: 1.5;
		-webkit-text-size-adjust: 100%;
		-moz-tab-size: 4;
		-o-tab-size: 4;
		tab-size: 4;
		font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		font-feature-settings: normal;
		font-variation-settings: normal;
		direction: ltr;
	}
`

const stylesFactory = (theme: "light" | "dark") => {
	const { font } = tokens
	const { fontFamily } = font
	const css = goober.css
	const t = (light: string, dark: string) => (theme === "light" ? light : dark)

	// Base colors
	const bgPrimary = t("#ffffff", "#121212")
	const bgSecondary = t("#f9fafb", "#1a1a1a")
	const textPrimary = t("#111827", "#ffffff")
	const textSecondary = t("#6b7280", "#9ca3af")
	const borderColor = t("#e5e7eb", "#374151")
	const borderHover = t("rgba(156, 163, 175, 0.5)", "rgba(55, 65, 81, 0.5)")
	const fontFamilySans = fontFamily.sans

	return {
		// Base styles
		base: css`
			font-family: ${fontFamilySans};
			color: ${textPrimary};
			background-color: ${bgPrimary};
		`,

		// Tag component
		tag: {
			base: css`
				display: flex;
				align-items: center;
				border-radius: 0.25rem;
				padding: 0.125rem 0.625rem;
				font-size: 0.875rem;
				font-weight: 500;
				height: max-content;
			`,
			green: css`
				border: 1px solid #10b981;
				color: ${textPrimary};
			`,
			blue: css`
				border: 1px solid #3b82f6;
				color: ${textPrimary};
			`,
			teal: css`
				border: 1px solid #5eead4;
				color: ${textPrimary};
			`,
			red: css`
				border: 1px solid #ef4444;
				color: ${textPrimary};
			`,
			purple: css`
				border: 1px solid #a855f7;
				color: ${textPrimary};
			`,
		},

		// Stack component
		stack: {
			base: css`
				display: flex;
				flex-direction: column;
			`,
			sm: css`
				gap: 0.25rem;
			`,
			md: css`
				gap: 0.5rem;
			`,
			lg: css`
				gap: 1rem;
			`,
		},

		// Input component
		input: {
			container: css`
				display: flex;
				width: 100%;
				flex-direction: column;
				gap: 0.25rem;
			`,
			label: css`
				display: block;
				color: ${textPrimary};
				font-size: 0.875rem;
			`,
			input: css`
				width: 100%;
				border-radius: 0.25rem;
				transition: all 0.2s;
				color: ${textPrimary};
				border: 1px solid ${borderColor};
				background-color: ${bgPrimary};
				padding: 0.25rem 0.5rem;
				font-size: 0.875rem;

				&:hover {
					border-color: ${borderHover};
				}

				&:focus {
					outline: none;
					border-color: #3b82f6;
					box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
				}
			`,
			hint: css`
				font-size: 0.875rem;
				color: ${textSecondary};
			`,
		},

		// Checkbox component
		checkbox: {
			container: css`
				display: flex;
				flex-direction: column;
			`,
			label: css`
				font-size: 1rem;
				cursor: pointer;
			`,
			wrapper: css`
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: 0.25rem 0;
			`,
			input: css`
				cursor: pointer;
			`,
			hint: css`
				font-size: 0.875rem;
				color: ${textSecondary};
			`,
		},

		// Button component
		button: {
			base: css`
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border-radius: 0.25rem;
				font-size: 0.875rem;
				font-weight: 500;
				transition: all 0.2s;
				cursor: pointer;
				border: none;
				outline: none;
				color: #ffffff;
				padding-left: 0.75rem !important;
				padding-right: 0.75rem !important;
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;

				&:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			`,
			primary: css`
				background-color: #3b82f6;
				color: #ffffff;
				padding: 0.5rem 1rem;

				&:hover:not(:disabled) {
					background-color: #2563eb;
				}
			`,
			secondary: css`
				background-color: transparent;
				color: ${textPrimary};
				border: 1px solid ${borderColor};
				padding: 0.5rem 1rem;

				&:hover:not(:disabled) {
					background-color: ${bgSecondary};
				}
			`,
			danger: css`
				background-color: #ef4444;
				color: #ffffff;
				padding: 0.5rem 1rem;

				&:hover:not(:disabled) {
					background-color: #dc2626;
				}
			`,
			editor: css`
				display: flex;
				cursor: pointer;
				align-items: center;
				gap: 0.25rem;
				border-radius: 0.25rem;
				border: 1px solid #1f9cf0;
				padding: 0.125rem 0.625rem;
				font-size: 0.875rem;
				font-weight: 500;
				color: #1f9cf0;
				background: transparent;

				&:hover {
					background-color: rgba(31, 156, 240, 0.1);
				}
			`,
		},

		// Select component
		select: {
			trigger: css`
				display: flex;
				height: 2rem;
				width: 100%;
				align-items: center;
				justify-content: space-between;
				border-radius: 0.375rem;
				border: 1px solid ${borderColor};
				background-color: ${bgPrimary};
				padding: 0.5rem 0.75rem;
				font-size: 0.875rem;
				transition: all 0.2s;

				&:hover {
					border-color: ${borderHover};
				}

				&:focus {
					outline: none;
					ring: 2px;
					ring-offset: 2px;
				}

				&:disabled {
					cursor: not-allowed;
					opacity: 0.5;
				}
			`,
			triggerWithText: css`
				width: 100%;
				color: ${textPrimary};
			`,
			icon: css`
				height: 1rem;
				width: 1rem;
				opacity: 0.5;
			`,
			content: css`
				position: relative;
				z-index: 50;
				min-width: 8rem;
				overflow: hidden;
				border-radius: 0.375rem;
				border: 1px solid ${borderColor};
				background-color: ${bgPrimary};
				color: ${textPrimary};
				box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
			`,
			contentPopper: css`
				&[data-side="bottom"] {
					transform: translateY(0.25rem);
				}
				&[data-side="left"] {
					transform: translateX(-0.25rem);
				}
				&[data-side="right"] {
					transform: translateX(0.25rem);
				}
				&[data-side="top"] {
					transform: translateY(-0.25rem);
				}
			`,
			viewport: css`
				padding: 0.25rem;
			`,
			viewportPopper: css`
				height: var(--radix-select-trigger-height);
				width: 100%;
				min-width: var(--radix-select-trigger-width);
			`,
			label: css`
				padding: 0.375rem 2rem 0.375rem 0.5rem;
				font-family: ${fontFamilySans};
				font-size: 0.875rem;
			`,
			item: css`
				position: relative;
				display: flex;
				width: 100%;
				cursor: default;
				user-select: none;
				align-items: center;
				border-radius: 0.125rem;
				padding: 0.375rem 2rem 0.375rem 0.5rem;
				font-family: ${fontFamilySans};
				font-size: 0.875rem;
				outline: none;

				&:hover {
					cursor: pointer;
					background-color: ${bgPrimary};
				}

				&:focus {
					background-color: ${bgPrimary};
				}

				&[data-disabled] {
					pointer-events: none;
					opacity: 0.5;
				}
			`,
			itemIndicatorWrapper: css`
				position: absolute;
				left: 0.5rem;
				display: flex;
				height: 0.875rem;
				width: 0.875rem;
				align-items: center;
				justify-content: center;
			`,
			itemIndicatorIcon: css`
				height: 1rem;
				width: 1rem;
			`,
		},

		// Accordion component
		accordion: {
			item: css`
				border-bottom: 1px solid ${t("#6b7280", "#6b7280")};
			`,
			trigger: css`
				display: flex;
				flex: 1;
				align-items: center;
				width: 100%;
				justify-content: space-between;
				padding: 0.5rem 0;
				font-size: 0.875rem;
				font-weight: 500;
				transition: all 0.2s;

				&[data-state="open"] > svg {
					transform: rotate(180deg);
				}
			`,
			header: css`
				display: flex;
			`,
			content: css`
				overflow: hidden;
				font-size: 0.875rem;
				transition: all 0.2s;
				padding-top: 0;

				&[data-state="closed"] {
					animation: accordion-up 0.2s ease-out;
				}

				&[data-state="open"] {
					animation: accordion-down 0.2s ease-in;
				}

				@keyframes accordion-down {
					from {
						height: 0;
					}
					to {
						height: var(--radix-accordion-content-height);
					}
				}

				@keyframes accordion-up {
					from {
						height: var(--radix-accordion-content-height);
					}
					to {
						height: 0;
					}
				}
			`,
			contentInner: css`
				padding-top: 0;
			`,
			icon: css`
				color: #ffffff;
				height: 1rem;
				width: 1rem;
				flex-shrink: 0;
				transition: transform 0.2s;
			`,
		},

		// InfoCard component
		infoCard: {
			container: css`
				margin-bottom: 1rem;
				height: min-content;
				font-size: 1rem;
				font-weight: 400;
				color: ${textPrimary};
				transition: all 0.2s;
			`,
			header: css`
				display: flex;
				min-height: 30px;
				align-items: center;
				text-align: left;
				font-size: 0.875rem;
			`,
			headerWithClear: css`
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.75rem;
			`,
			clearButton: css`
				cursor: pointer;
				border-radius: 0.25rem;
				background-color: #ef4444;
				padding: 0.125rem 0.375rem;
				font-size: 0.75rem;
				font-weight: 600;
				color: #ffffff;

				&:hover {
					background-color: #dc2626;
				}
			`,
		},

		// RouteToggle component
		routeToggle: {
			container: css`
				display: flex;
				align-items: center;
				gap: 0.375rem;
				border-radius: 0.25rem;
				border: 1px solid rgba(148, 163, 184, 0.3);
				background: linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(100, 116, 139, 0.1) 100%);
				padding: 0.25rem 0.375rem;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(100, 116, 139, 0.2) 100%);
					border-color: rgba(148, 163, 184, 0.5);
				}
			`,
			icon: css`
				height: 1.125rem;
				width: 1.125rem;
				cursor: pointer;
				color: #64748b;
				transition: all 0.2s ease;
				padding: 0.125rem;
				border-radius: 0.125rem;

				&:hover {
					color: #cbd5e1;
					background: rgba(148, 163, 184, 0.2);
				}
			`,
			iconActive: css`
				color: #3b82f6;
				background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
				box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
			`,
		}, // RouteInfo component
		routeInfo: {
			container: css`
				position: relative;
			`,
			closeIcon: css`
				position: absolute;
				right: 0.5rem;
				top: 0.5rem;
				cursor: pointer;
				color: #dc2626;
			`,
			title: css`
				font-size: 1.25rem;
				color: ${textPrimary};
				font-weight: 600;
			`,
			divider: css`
				margin-bottom: 1rem;
				margin-top: 0.25rem;
			`,
			label: css`
				color: ${textSecondary};
			`,
			value: css`
				color: ${textPrimary};
			`,
			section: css`
				display: flex;
				gap: 0.5rem;
			`,
			sectionLabel: css`
				white-space: nowrap;
				color: ${textSecondary};
			`,
			componentsSection: css`
				margin-bottom: 1rem;
				margin-top: 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			`,
			componentsLabel: css`
				color: ${textSecondary};
			`,
			componentsGrid: css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			`,
			wildcardLabel: css`
				margin-bottom: 0.5rem;
				color: ${textSecondary};
			`,
			wildcardGrid: css`
				margin-bottom: 1rem;
				display: grid;
				width: 100%;
				grid-template-columns: repeat(2, 1fr);
				gap: 0.5rem;
			`,
			wildcardGridSingle: css`
				grid-template-columns: repeat(1, 1fr);
			`,
			openButton: css`
				margin-right: 0.5rem;
				white-space: nowrap;
				color: ${textPrimary} !important;
				border-radius: 0.25rem;
				border: 1px solid ${borderColor};
				padding: 0.25rem 0.5rem;
				font-size: 0.875rem;
			`,
		},

		// RouteNode component
		routeNode: {
			circle: css`
				stroke: ${textPrimary};
			`,
			circleCollapsed: css`
				fill: #374151;
			`,
			text: css`
				width: 100%;
				word-break: break-all;
				fill: ${textPrimary};
				stroke: transparent;
			`,
			textActive: css`
				color: #eab308;
			`,
		},

		// Icon component
		icon: {
			base: css`
				display: inline-block;
				flex-shrink: 0;
			`,
			fillTransparent: css`
				fill: transparent;
			`,
		},

		// Utility classes
		utils: {
			textWhite: css`
				color: ${textPrimary};
			`,
			textGray: css`
				color: ${textSecondary};
			`,
			textRed: css`
				color: #ef4444;
			`,
			textYellow: css`
				color: #eab308;
			`,
			textGreen: css`
				color: #10b981;
			`,
			textBlue: css`
				color: #3b82f6;
			`,
			borderGray: css`
				border-color: ${borderColor};
			`,
			bgPrimary: css`
				background-color: ${bgPrimary};
			`,
			bgSecondary: css`
				background-color: ${bgSecondary};
			`,
			rounded: css`
				border-radius: 0.25rem;
			`,
			roundedLg: css`
				border-radius: 0.5rem;
			`,
			border: css`
				border: 1px solid ${borderColor};
			`,
			flex: css`
				display: flex;
			`,
			flexCol: css`
				display: flex;
				flex-direction: column;
			`,
			gap1: css`
				gap: 0.25rem;
			`,
			gap2: css`
				gap: 0.5rem;
			`,
			gap4: css`
				gap: 1rem;
			`,
			p1: css`
				padding: 0.25rem;
			`,
			p2: css`
				padding: 0.5rem;
			`,
			p4: css`
				padding: 1rem;
			`,
			mb2: css`
				margin-bottom: 0.5rem;
			`,
			mb4: css`
				margin-bottom: 1rem;
			`,
			wFull: css`
				width: 100%;
			`,
			hFull: css`
				height: 100%;
			`,
		},

		// Route colors
		routeColors: {
			green: css`
				background-color: #10b981;
				ring: #10b981;
				color: #ffffff;
			`,
			blue: css`
				background-color: #3b82f6;
				ring: #3b82f6;
				color: #ffffff;
			`,
			teal: css`
				background-color: #5eead4;
				ring: #5eead4;
				color: #ffffff;
			`,
			red: css`
				background-color: #ef4444;
				ring: #ef4444;
				color: #ffffff;
			`,
			purple: css`
				background-color: #a855f7;
				ring: #a855f7;
				color: #ffffff;
			`,
		},

		// Page Tab
		pageTab: {
			header: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.75rem 1rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 3.5rem;
				height: 3.5rem;
			`,
			headerContent: css`
				display: flex;
				align-items: center;
				gap: 0.75rem;
			`,
			title: css`
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: #ffffff;
			`,
			revalidateButton: css`
				display: flex;
				align-items: center;
				gap: 0.25rem;
				cursor: pointer;
				border-radius: 0.25rem;
				border: 1px solid rgba(16, 185, 129, 0.3);
				background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
				padding: 0.25rem 0.5rem;
				font-size: 0.75rem;
				font-weight: 600;
				color: #6ee7b7;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
					border-color: rgba(16, 185, 129, 0.5);
					color: #34d399;
				}
			`,
			revalidateButtonDisabled: css`
				pointer-events: none;
				opacity: 0.5;
				cursor: default;
			`,
			divider: css`
				border-color: #374151;
			`,
			content: css`
				position: relative;
				display: flex;
				height: 100%;
				flex-direction: column;
			`,
			routesList: css`
				position: relative;
				list-style: none;
				padding: 0;
				margin: 0;
			`,
			routesListLoading: css`
				pointer-events: none;
				opacity: 0.5;
			`,
		},

		// Timeline Tab
		timelineTab: {
			container: css`
				position: relative;
				display: flex;
				height: 100%;
				flex-direction: column;
				overflow: hidden;
			`,
			header: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.75rem 1rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 3.5rem;
				height: 3.5rem;
			`,
			headerContent: css`
				display: flex;
				align-items: center;
				gap: 0.75rem;
			`,
			headerTitle: css`
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: #ffffff;
			`,
			headerCount: css`
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-width: 1.5rem;
				height: 1.5rem;
				padding: 0 0.5rem;
				border-radius: 9999px;
				background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
				font-size: 0.75rem;
				font-weight: 700;
				color: #ffffff;
			`,
			clearButton: css`
				display: flex;
				align-items: center;
				gap: 0.25rem;
				cursor: pointer;
				border-radius: 0.25rem;
				border: 1px solid rgba(239, 68, 68, 0.3);
				background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
				padding: 0.25rem 0.5rem;
				font-size: 0.75rem;
				font-weight: 600;
				color: #fca5a5;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
					border-color: rgba(239, 68, 68, 0.5);
					color: #f87171;
				}
			`,
			list: css`
				position: relative;
				overflow-y: auto;
			`,
			item: css`
				position: relative;
				margin-bottom: 0.75rem;
				border-radius: 0.5rem;
				background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
				border: 1px solid rgba(71, 85, 105, 0.3);
				animation: fade-in-left 0.3s ease-in;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
					border-color: rgba(71, 85, 105, 0.5);
				}

				&:last-child {
					margin-bottom: 0;
				}
			`,
			icon: css`
				display: flex;
				flex-shrink: 0;
				height: 2rem;
				width: 2rem;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
				box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-timeline 2s ease-in-out infinite;

				@keyframes pulse-subtle-timeline {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.35);
					}
				}
			`,
			itemHeader: css`
				position: relative;
				display: flex;
				align-items: center;
				gap: 0.75rem;
				padding: 0.75rem;
				border-bottom: 1px solid rgba(71, 85, 105, 0.2);
			`,
			title: css`
				flex: 1;
				margin: 0;
				font-size: 0.938rem;
				font-weight: 600;
				color: #e5e7eb;
			`,
			methodTag: css`
				flex-shrink: 0;
			`,
			itemBody: css`
				padding: 0.75rem;
			`,
			eventContainer: css`
				margin-top: 0.5rem;
			`,
			eventInfoGrid: css`
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
				gap: 0.5rem;
				margin-bottom: 0.75rem;
				padding: 0.625rem 0.75rem;
				border-radius: 0.25rem;
				background: rgba(15, 23, 42, 0.3);
				border: 1px solid rgba(71, 85, 105, 0.2);
			`,
			eventInfoItem: css`
				display: flex;
				flex-direction: column;
				gap: 0.125rem;
			`,
			eventInfoLabel: css`
				font-size: 0.688rem;
				font-weight: 500;
				color: #64748b;
				text-transform: uppercase;
				letter-spacing: 0.025em;
			`,
			eventInfoValue: css`
				font-size: 0.75rem;
				font-weight: 400;
				color: #cbd5e1;
				word-break: break-word;
			`,
			eventTime: css`
				margin-bottom: 0.375rem;
				display: block;
				font-size: 0.813rem;
				font-weight: 400;
				line-height: 1.4;
				color: #94a3b8;
			`,
			eventText: css`
				margin-bottom: 0.625rem;
				font-size: 0.875rem;
				font-weight: 400;
				color: #cbd5e1;
				line-height: 1.5;
			`,
			eventDataContainer: css`
				display: flex;
				gap: 1.5rem;
				flex-wrap: wrap;
			`,
			eventData: css`
				margin-bottom: 0.5rem;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 0.875rem;
				font-weight: 400;
				color: #cbd5e1;
			`,
		},

		// Settings Tab
		settingsTab: {
			container: css`
				display: flex;
				flex-direction: column;
				height: 100%;
			`,
			header: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.75rem 1rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 3.5rem;
				height: 3.5rem;
			`,
			headerTitle: css`
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: #ffffff;
			`,
			content: css`
				flex: 1;
				overflow-y: auto;
			`,
			divider: css`
				margin-top: 0.5rem;
				border-color: #9ca3af;
			`,
			dividerDark: css`
				margin-top: 0.5rem;
				border-color: #374151;
			`,
			selectRow: css`
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				@media (min-width: 1024px) {
					flex-direction: row;
				}
			`,
		},

		// Routes Tab
		routesTab: {
			wrapper: css`
				display: flex;
				flex-direction: column;
				height: 100%;
			`,
			header: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.75rem 1rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 3.5rem;
				height: 3.5rem;
			`,
			headerContent: css`
				display: flex;
				align-items: center;
				width: 100%;
				justify-content: space-between;
				gap: 0.75rem;
			`,
			headerTitle: css`
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: #ffffff;
			`,
			container: css`
				position: relative;
				flex: 1;
				overflow: hidden;
				width: 100%;
			`,
			containerWithPadding: css`
				position: relative;
				flex: 1;
				overflow: hidden;
				width: 100%;
			`,
			treeContainer: css`
				display: flex;
				height: 100%;
				width: 100%;
			`,
			listContainer: css`
				height: 100%;
				width: 100%;
				overflow-y: auto;
			`,
			addNewItem: css`
				color: #ffffff;
			`,
			addNewTitle: css`
				font-size: 1.125rem;
				font-weight: 600;
			`,
			projectRoutesContainer: css`
				padding-top: 0.5rem;
				padding-bottom: 0.5rem;
			`,
			projectRoutesTitle: css`
				font-size: 1.125rem;
				font-weight: 600;
			`,
			projectRoutesDivider: css`
				margin-top: 0.5rem;
				border-color: #9ca3af;
			`,
			routeAccordionTrigger: css`
				justify-content: center;
				flex-wrap: wrap;
				color: #ffffff;
				display: flex;
				padding-left: 0.75rem;
				padding-right: 0;
				flex-direction: column;
				width: 100%;
				align-items: flex-start;
				gap: 0.25rem;
				@media (min-width: 1024px) {
					flex-direction: row;
					align-items: center;
					padding-left: 0;
				}
			`,
			routeId: css`
				color: #6b7280;
			`,
			routeActions: css`
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 0.5rem;
				@media (min-width: 1024px) {
					margin-left: auto;
				}
			`,
			routeUrl: css`
				text-align: left;
				font-size: 0.875rem;
				color: #6b7280;
			`,
			openButton: css`
				margin-right: 0.5rem;
				white-space: nowrap;
				border-radius: 0.25rem;
				border: 1px solid #9ca3af;
				padding: 0.25rem 0.5rem;
				font-size: 0.875rem;
			`,
			strokeYellow: css`
				stroke: #eab308 !important;
			`,
			strokeGray: css`
				stroke: #9ca3af !important;
			`,
			strokeGrayMuted: css`
				stroke: rgba(156, 163, 175, 0.2) !important;
			`,
		},

		// RouteSegmentInfo
		routeSegmentInfo: {
			listItem: css`
				margin-bottom: 2rem;
				margin-left: 1.5rem;
				@media (min-width: 1024px) {
					margin-left: 2rem;
				}
			`,
			iconWrapper: css`
				position: absolute;
				left: -1rem;
				display: flex;
				height: 2rem;
				width: 2rem;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
			`,
			iconWrapperGreen: css`
				background-color: #10b981;
				ring: 1px solid #10b981;
				color: #ffffff;
			`,
			iconWrapperBlue: css`
				background-color: #3b82f6;
				ring: 1px solid #3b82f6;
				color: #ffffff;
			`,
			iconWrapperTeal: css`
				background-color: #2dd4bf;
				ring: 1px solid #2dd4bf;
				color: #ffffff;
			`,
			iconWrapperRed: css`
				background-color: #ef4444;
				ring: 1px solid #ef4444;
				color: #ffffff;
			`,
			iconWrapperPurple: css`
				background-color: #a855f7;
				ring: 1px solid #a855f7;
				color: #ffffff;
			`,
			header: css`
				font-size: 1rem;
				margin-top: -0.75rem;
				margin-bottom: 0.25rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.5rem;
				font-weight: 600;
				color: #ffffff;
			`,
			headerActions: css`
				display: flex;
				gap: 0.5rem;
			`,
			actionButtons: css`
				display: flex;
				align-items: center;
				gap: 0.5rem;
			`,
			content: css`
				margin-bottom: 1rem;
			`,
			routeFileLabel: css`
				margin-bottom: 0.5rem;
				display: block;
				font-size: 0.875rem;
				font-weight: 400;
				line-height: 1;
				color: #6b7280;
			`,
			cardsContainer: css`
				display: flex;
				flex-wrap: wrap;
				gap: 1.5rem;
			`,
			showBoundaryButton: css`
				display: flex;
				align-items: center;
				gap: 0.375rem;
				border: 1px solid #10b981;
				border-radius: 0.25rem;
				padding: 0.25rem 0.625rem;
				font-size: 0.875rem;
				font-weight: 500;
				line-height: 1;
				color: #10b981;
				cursor: pointer;
				transition: all 0.2s ease;

				svg {
					flex-shrink: 0;
				}

				&:hover {
					background: rgba(16, 185, 129, 0.1);
					border-color: #34d399;
				}
			`,
		},

		// RouteSegmentCard
		routeSegmentCard: {
			item: css`
				position: relative;
				margin-bottom: 0.75rem;
				border-radius: 0.5rem;
				background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
				border: 1px solid rgba(71, 85, 105, 0.3);
				animation: fade-in-left 0.3s ease-in;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
					border-color: rgba(71, 85, 105, 0.5);
				}

				&:last-child {
					margin-bottom: 0;
				}
			`,
			header: css`
				position: relative;
				display: flex;
				align-items: center;
				gap: 0.75rem;
				padding: 0.75rem;
				border-bottom: 1px solid rgba(71, 85, 105, 0.2);
			`,
			icon: css`
				display: flex;
				flex-shrink: 0;
				height: 2rem;
				width: 2rem;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				animation: fade-in 0.3s ease-in;
			`,
			iconGreen: css`
				background: linear-gradient(135deg, #10b981 0%, #059669 100%);
				color: #ffffff;
				box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-green 2s ease-in-out infinite;

				@keyframes pulse-subtle-green {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.35);
					}
				}
			`,
			iconBlue: css`
				background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
				color: #ffffff;
				box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-blue 2s ease-in-out infinite;

				@keyframes pulse-subtle-blue {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.35);
					}
				}
			`,
			iconTeal: css`
				background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
				color: #ffffff;
				box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-teal 2s ease-in-out infinite;

				@keyframes pulse-subtle-teal {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.35);
					}
				}
			`,
			iconRed: css`
				background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
				color: #ffffff;
				box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-red 2s ease-in-out infinite;

				@keyframes pulse-subtle-red {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.35);
					}
				}
			`,
			iconPurple: css`
				background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
				color: #ffffff;
				box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
				animation: fade-in 0.3s ease-in, pulse-subtle-purple 2s ease-in-out infinite;

				@keyframes pulse-subtle-purple {
					0%, 100% {
						box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
					}
					50% {
						box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.35);
					}
				}
			`,
			title: css`
				flex: 1;
				margin: 0;
				font-size: 0.938rem;
				font-weight: 600;
				color: #e5e7eb;
			`,
			subtitle: css`
				font-size: 0.813rem;
				font-weight: 400;
				color: #94a3b8;
			`,
			headerActions: css`
				display: flex;
				gap: 0.5rem;
				align-items: center;
			`,
			body: css`
				padding: 1rem;
			`,
			cacheSection: css`
				margin-bottom: 1rem;
			`,
			componentsSection: css`
				margin-bottom: 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			`,
			componentsSectionLabel: css`
				font-size: 0.875rem;
				font-weight: 500;
				color: #94a3b8;
			`,
			tagsContainer: css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			`,
			routeFileLabel: css`
				margin-bottom: 0.5rem;
				display: block;
				font-size: 0.75rem;
				font-weight: 400;
				color: #64748b;
			`,
			cardsContainer: css`
				display: flex;
				flex-wrap: wrap;
				gap: 1.5rem;
			`,
		},

		// RouteInfo
		routeInfoComponent: {
			container: css`
				position: relative;
			`,
			closeIcon: css`
				position: absolute;
				right: 0.5rem;
				top: 0.5rem;
				cursor: pointer;
				color: #dc2626;
			`,
			title: css`
				font-size: 1.25rem;
				color: #ffffff;
				font-weight: 600;
			`,
			divider: css`
				margin-bottom: 1rem;
				margin-top: 0.25rem;
			`,
			label: css`
				color: #6b7280;
			`,
			value: css`
				color: #ffffff;
			`,
			routeFile: css`
				display: flex;
				gap: 0.5rem;
			`,
			routeFileLabel: css`
				white-space: nowrap;
				color: #6b7280;
			`,
			componentsSection: css`
				margin-bottom: 1rem;
				margin-top: 1rem;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			`,
			tagsContainer: css`
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			`,
			tagHeight: css`
				height: max-content;
			`,
			tagNoRightRadius: css`
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			`,
			errorBoundaryMessage: css`
				margin-right: 0.5rem;
			`,
			wildcardLabel: css`
				margin-bottom: 0.5rem;
				color: #6b7280;
			`,
			wildcardGrid: css`
				margin-bottom: 1rem;
				display: grid;
				width: 100%;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 0.5rem;
			`,
			wildcardGridSingleColumn: css`
				grid-template-columns: repeat(1, minmax(0, 1fr));
			`,
			wildcardInputWrapper: css`
				display: flex;
				width: 100%;
				gap: 0.5rem;
			`,
			openBrowserButton: css`
				margin-right: 0.5rem;
				white-space: nowrap;
				color: #ffffff !important;
				border-radius: 0.25rem;
				border: 1px solid #9ca3af;
				padding-left: 0.5rem;
				padding-right: 0.5rem;
				padding-top: 0.25rem;
				padding-bottom: 0.25rem;
				font-size: 0.875rem;
			`,
			openBrowserLink: css`
				color: #ffffff;
			`,
		},

		// RouteNode
		routeNodeComponent: {
			circle: css`
				stroke: #ffffff;
			`,
			circleCollapsed: css`
				fill: #1f2937;
			`,
			text: css`
				width: 100%;
				word-break: break-all;
				fill: #ffffff;
				stroke: transparent;
			`,
			textActive: css`
				color: #eab308;
			`,
		},

		// RouteToggle (already exists, keeping for reference)

		// EditorButton
		editorButton: css`
			display: flex;
			cursor: pointer;
			align-items: center;
			gap: 0.25rem;
			border-radius: 0.25rem;
			border: 1px solid #1f9cf0;
			padding: 0.25rem 0.625rem;
			font-size: 0.875rem;
			font-weight: 500;
			line-height: 1;
			color: #1f9cf0;
			transition: all 0.2s ease;

			svg {
				flex-shrink: 0;
			}

			&:hover {
				background: rgba(31, 156, 240, 0.1);
				border-color: #60a5fa;
			}
		`,

		// NewRouteForm
		newRouteForm: {
			container: css`
				margin-bottom: 0.5rem;
				border-radius: 0.5rem;
				border: 1px solid rgba(107, 114, 128, 0.2);
				padding: 0.5rem;
			`,
			label: css`
				margin-bottom: 0.5rem;
				display: block;
			`,
			inputMargin: css`
				margin-bottom: 0.25rem;
			`,
			hint: css`
				margin-bottom: 1rem;
				display: block;
				color: #6b7280;
			`,
			submitButton: css`
				margin-right: 0.5rem;
				margin-top: 0.5rem;
				align-self: flex-end;
				color: #ffffff;
				border-radius: 0.25rem;
				border: 1px solid #9ca3af;
				padding-left: 0.5rem;
				padding-right: 0.5rem;
				padding-top: 0.25rem;
				padding-bottom: 0.25rem;
				font-size: 0.875rem;
			`,
			submitButtonDisabled: css`
				opacity: 0.5;
			`,
		},

		// CacheInfo (uses Tag component, no additional styles needed)

		// JsonRenderer
		jsonRenderer: {
			stringValue: css`
				max-width: 20rem;
				color: #10b981;
			`,
		},

		// Network Tab
		networkTab: {
			wrapper: css`
				display: flex;
				flex-direction: column;
				height: 100%;
			`,
			header: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.75rem 1rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 3.5rem;
				height: 3.5rem;
			`,
			headerContent: css`
				display: flex;
				align-items: center;
				gap: 0.75rem;
			`,
			headerTitle: css`
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: #ffffff;
			`,
			headerCount: css`
				display: inline-flex;
				align-items: center;
				justify-content: center;
				min-width: 1.25rem;
				height: 1.25rem;
				padding: 0 0.375rem;
				border-radius: 9999px;
				background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
				font-size: 0.688rem;
				font-weight: 700;
				color: #ffffff;
			`,
			limitWarning: css`
				display: flex;
				align-items: center;
				gap: 0.25rem;
				padding: 0.25rem 0.5rem;
				border-radius: 0.25rem;
				border: 1px solid rgba(251, 191, 36, 0.3);
				background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
				font-size: 0.75rem;
				font-weight: 600;
				color: #fbbf24;
			`,
			clearButton: css`
				display: flex;
				align-items: center;
				gap: 0.25rem;
				cursor: pointer;
				border-radius: 0.25rem;
				border: 1px solid rgba(239, 68, 68, 0.3);
				background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
				padding: 0.25rem 0.5rem;
				font-size: 0.75rem;
				font-weight: 600;
				color: #fca5a5;
				transition: all 0.2s ease;

				&:hover {
					background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
					border-color: rgba(239, 68, 68, 0.5);
					color: #f87171;
				}
			`,
			container: css`
				position: relative;
				flex: 1;
				overflow: hidden;
				width: 100%;
			`,
		},

		// Network Components
		network: {
			// NetworkPanel
			panel: {
				container: css`
					height: 100%;
					overflow-y: auto;
					color: #e5e7eb;
				`,
				innerContainer: css`
					height: 100%;
					margin-left: auto;
					margin-right: auto;
					padding: 1rem;
				`,
				cardContainer: css`
					height: 100%;
					background-color: #1f2937;
					border-radius: 0.5rem;
					box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
					overflow: hidden;
				`,
				networkContainer: css`
					height: 100%;
					border-top: 1px solid #374151;
					padding: 1rem;
					overflow-y: auto;
				`,
			},

			// NetworkWaterfall
			waterfall: {
				container: css`
					position: relative;
				`,
				filterBar: css`
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 0.75rem 1rem;
					background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
					border-bottom: 1px solid #374151;
					&:first-of-type {
						border-radius: 0.5rem 0.5rem 0 0;
						border-bottom: 1px solid #4b5563;
					}
				`,
				filterLabel: css`
					font-size: 0.75rem;
					font-weight: 700;
					color: #9ca3af;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					white-space: nowrap;
					min-width: fit-content;
				`,
				filterButtons: css`
					display: flex;
					flex-wrap: wrap;
					gap: 0.375rem;
					align-items: center;
					flex: 1;
				`,
				filterButton: css`
					display: flex;
					align-items: center;
					gap: 0.25rem;
					padding: 0.375rem 0.625rem;
					font-size: 0.75rem;
					font-weight: 600;
					border: 1.5px solid transparent;
					border-radius: 0.25rem;
					background-color: rgba(31, 41, 55, 0.5);
					transition: all 0.15s ease-out;
					cursor: pointer;
					white-space: nowrap;
					&:hover {
						background-color: rgba(31, 41, 55, 0.8);
						transform: translateY(-1px);
					}
				`,
				filterButtonActive: css`
					background-color: rgba(31, 41, 55, 1);
					font-weight: 700;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
				`,
				filterColorCircle: css`
					width: 0.5rem;
					height: 0.5rem;
					border-radius: 50%;
					flex-shrink: 0;
				`,
				filterCount: css`
					font-size: 0.6875rem;
					opacity: 0.65;
					font-weight: 500;
				`,
				filterSummary: css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 1rem;
					padding: 0.625rem 1rem;
					margin-bottom: 1rem;
					background-color: rgba(59, 130, 246, 0.1);
					border-bottom: 1px solid rgba(59, 130, 246, 0.3);
					font-size: 0.75rem;
					font-weight: 600;
					color: #60a5fa;
				`,
				clearFiltersButton: css`
					padding: 0.25rem 0.5rem;
					font-size: 0.6875rem;
					font-weight: 600;
					color: #dc2626;
					background-color: rgba(220, 38, 38, 0.1);
					border: 1px solid #dc2626;
					border-radius: 0.25rem;
					cursor: pointer;
					transition: all 0.15s;
					&:hover {
						background-color: rgba(220, 38, 38, 0.2);
						transform: translateY(-1px);
					}
				`,
				flexContainer: css`
					display: flex;
				`,
				requestsHeader: css`
					height: 1.25rem;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #374151;
					margin-bottom: 0.25rem;
					margin-left: -0.75rem;
					padding-left: 0.75rem;
					padding-bottom: 0;
					font-size: 0.75rem;
					font-weight: 600;
					color: #9ca3af;
				`,
				requestsList: css`
					padding-right: 0.75rem;
					display: flex;
					flex-direction: column;
					z-index: 50;
				`,
				requestRow: css`
					display: flex;
					gap: 0.375rem;
					align-items: center;
				`,
				requestButton: css`
					display: flex;
					width: 100%;
					align-items: center;
					gap: 0.375rem;
					padding-left: 0.375rem;
					padding-right: 0.375rem;
					padding-top: 0.125rem;
					padding-bottom: 0.125rem;
					font-size: 0.875rem;
					color: #ffffff;
					border: 1px solid transparent;
					border-radius: 0.25rem;
					transition: all 0.15s;
					&:focus-visible {
						outline: none;
					}
					&:hover {
						background-color: rgba(31, 41, 55, 0.5);
					}
				`,
				requestButtonActive: css`
					border-color: currentColor;
				`,
				requestButtonGreen: css`
					border-color: #10b981;
				`,
				requestButtonBlue: css`
					border-color: #3b82f6;
				`,
				requestButtonYellow: css`
					border-color: #FFD700;
				`,
				requestButtonPurple: css`
					border-color: #a855f7;
				`,
				requestButtonOrange: css`
					border-color: #FFA500;
				`,
				requestButtonPink: css`
					border-color: #FF1493;
				`,
				requestButtonPinkLight: css`
					border-color: #FF69B4;
				`,
				requestButtonWhite: css`
					border-color: #ffffff;
				`,
				requestIndicator: css`
					width: 0.375rem;
					height: 0.375rem;
					padding: 0.1875rem;
					border-radius: 2px;
				`,
				requestIndicatorGreen: css`
					background-color: #10b981;
				`,
				requestIndicatorBlue: css`
					background-color: #3b82f6;
				`,
				requestIndicatorYellow: css`
					background-color: #FFD700;
				`,
				requestIndicatorPurple: css`
					background-color: #a855f7;
				`,
				requestIndicatorOrange: css`
					background-color: #FFA500;
				`,
				requestIndicatorPink: css`
					background-color: #FF1493;
				`,
				requestIndicatorPinkLight: css`
					background-color: #FF69B4;
				`,
				requestIndicatorWhite: css`
					background-color: #ffffff;
				`,
				requestId: css`
					padding-right: 1rem;
				`,
				requestIdText: css`
					white-space: nowrap;
				`,
				methodTag: css`
					display: flex;
					align-items: center;
					margin-left: auto;
				`,
				scrollContainer: css`
					position: relative;
					overflow-x: auto;
					display: flex;
					&::-webkit-scrollbar {
						display: none;
					}
					scrollbar-width: none;
				`,
				scrollContainerGrabbing: css`
					cursor: grabbing;
				`,
				scrollContainerGrab: css`
					cursor: grab;
				`,
				chartContainer: css`
					position: relative;
				`,
				timelineHeader: css`
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					height: 1.25rem;
					border-bottom: 1px solid #374151;
				`,
				timeColumn: css`
					position: absolute;
					top: 0;
					height: 100%;
					border-right: none;
					border-top: none;
					border-bottom: none;
					border-left: 2px solid #ffffff;
					font-size: 0.875rem;
					color: #ffffff;
				`,
				timeLabel: css`
					margin-left: 0.25rem;
				`,
				timeDivider: css`
					position: absolute;
					left: -1px;
					border-left: 1px dashed #374151;
					width: 1px;
				`,
				detailsContainer: css`
					width: 100%;
				`,
			},

			// RequestDetails
			details: {
				container: css`
					width: 100%;
					margin-top: 1rem;
					background-color: #111827;
					border-radius: 0.5rem;
					border: 2px solid #4b5563;
					overflow: hidden;
					z-index: 50;
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
				`,
				content: css`
					font-size: 0.875rem;
				`,
				header: css`
					background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
					border-bottom: 2px solid #4b5563;
					padding: 1.25rem;
				`,
				headerTop: css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 1rem;
				`,
				headerTitle: css`
					font-size: 0.875rem;
					font-weight: 700;
					color: #d1d5db;
					text-transform: uppercase;
					letter-spacing: 0.1em;
				`,
				headerRow: css`
					display: flex;
					align-items: center;
					gap: 0.5rem;
				`,
				mainInfo: css`
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				`,
				requestPath: css`
					display: flex;
					flex-direction: column;
					gap: 0.25rem;
				`,
				requestUrl: css`
					font-size: 1.125rem;
					font-weight: 700;
					color: #ffffff;
					word-break: break-all;
					text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
				`,
				requestId: css`
					font-size: 0.75rem;
					color: #9ca3af;
					font-family: monospace;
					background-color: rgba(75, 85, 99, 0.3);
					padding: 0.25rem 0.5rem;
					border-radius: 0.25rem;
					display: inline-block;
					width: fit-content;
				`,
				metadataGrid: css`
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
					padding: 1.25rem;
					background-color: ${bgPrimary};
				`,
				metadataItem: css`
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					padding: 1rem;
					background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
					border-radius: 0.5rem;
					border: 2px solid #374151;
					transition: all 0.2s;
					&:hover {
						border-color: #4b5563;
						transform: translateY(-1px);
						box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
					}
				`,
				metadataLabel: css`
					font-size: 0.75rem;
					color: #9ca3af;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					font-weight: 600;
				`,
				metadataValue: css`
					font-size: 0.875rem;
					color: #ffffff;
					font-weight: 600;
					display: flex;
					align-items: center;
				`,
				tagsContainer: css`
					display: flex;
					align-items: center;
					gap: 0.5rem;
				`,
				typeBadge: css`
					width: max-content;
					display: flex;
					align-items: center;
					border-radius: 0.375rem;
					padding-left: 0.75rem;
					padding-right: 0.75rem;
					padding-top: 0.25rem;
					padding-bottom: 0.25rem;
					font-size: 0.75rem;
					font-weight: 700;
					border: 2px solid;
					text-transform: uppercase;
					letter-spacing: 0.05em;
				`,
				typeBadgeGreen: css`
					border-color: #10b981;
					color: #10b981;
					background-color: rgba(16, 185, 129, 0.15);
				`,
				typeBadgeBlue: css`
					border-color: #3b82f6;
					color: #3b82f6;
					background-color: rgba(59, 130, 246, 0.15);
				`,
				typeBadgeYellow: css`
					border-color: #FFD700;
					color: #FFD700;
					background-color: rgba(255, 215, 0, 0.15);
				`,
				typeBadgePurple: css`
					border-color: #a855f7;
					color: #a855f7;
					background-color: rgba(168, 85, 247, 0.15);
				`,
				typeBadgeOrange: css`
					border-color: #FFA500;
					color: #FFA500;
					background-color: rgba(255, 165, 0, 0.15);
				`,
				typeBadgePink: css`
					border-color: #FF1493;
					color: #FF1493;
					background-color: rgba(255, 20, 147, 0.15);
				`,
				typeBadgePinkLight: css`
					border-color: #FF69B4;
					color: #FF69B4;
					background-color: rgba(255, 105, 180, 0.15);
				`,
				typeBadgeWhite: css`
					border-color: #ffffff;
					color: #ffffff;
					background-color: rgba(255, 255, 255, 0.15);
				`,
				typeBadgeRed: css`
					border-color: #dc2626;
					color: #dc2626;
					background-color: rgba(220, 38, 38, 0.15);
				`,
				controls: css`
					display: flex;
					align-items: center;
					gap: 0.5rem;
				`,
				navButtons: css`
					display: flex;
					align-items: center;
					gap: 0.25rem;
				`,
				navButton: css`
					color: #9ca3af;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 2rem;
					height: 2rem;
					border-radius: 0.375rem;
					border: 2px solid #374151;
					background-color: transparent;
					transition: all 0.2s;
					&:hover {
						color: #ffffff;
						background-color: #374151;
						border-color: #6b7280;
					}
				`,
				navButtonLeft: css`
					transform: rotate(90deg);
				`,
				navButtonRight: css`
					transform: rotate(-90deg);
				`,
				closeButton: css`
					color: #dc2626;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 2rem;
					height: 2rem;
					border-radius: 0.375rem;
					border: 2px solid #991b1b;
					background-color: transparent;
					transition: all 0.2s;
					&:hover {
						color: #ffffff;
						background-color: #dc2626;
						border-color: #dc2626;
					}
				`,
				title: css`
					font-weight: 400;
					color: #10b981;
				`,
				duration: css`
					font-weight: 700;
					color: #10b981;
				`,
				durationPending: css`
					font-weight: 600;
					color: #94a3b8;
					font-style: italic;
				`,
				section: css`
					margin: 1rem 1.25rem;
					border: 2px solid #4b5563;
					border-radius: 0.5rem;
					overflow: hidden;
					background-color: #1f2937;
				`,
				sectionHeader: css`
					width: 100%;
					padding-left: 1rem;
					padding-right: 1rem;
					padding-top: 0.875rem;
					padding-bottom: 0.875rem;
					background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
					font-size: 0.875rem;
					font-weight: 700;
					color: #ffffff;
					display: flex;
					align-items: center;
					gap: 0.5rem;
					border-bottom: 2px solid #4b5563;
					text-transform: uppercase;
					letter-spacing: 0.05em;
				`,
				sectionContent: css`
					padding: 1.25rem;
					max-height: 400px;
					overflow-y: auto;
					background-color: #111827;
				`,
			},

			// NetworkBar
			bar: {
				container: css`
					position: relative;
					overflow: hidden;
					cursor: pointer;
					&:hover {
						filter: brightness(1.1);
					}
					&:hover .network-bar-tooltip {
						opacity: 1;
					}
				`,
				shimmer: css`
					position: absolute;
					inset: 0;
					background: linear-gradient(to right, transparent, white, transparent);
					opacity: 0.2;
				`,
				tooltip: css`
					position: absolute;
					left: 100%;
					top: 50%;
					transform: translateY(-50%);
					margin-left: 0.5rem;
					opacity: 0;
					transition: opacity 0.2s;
					background-color: #111827;
					padding-left: 0.5rem;
					padding-right: 0.5rem;
					padding-top: 0.25rem;
					padding-bottom: 0.25rem;
					border-radius: 0.25rem;
					font-size: 0.875rem;
					white-space: nowrap;
					pointer-events: none;
					z-index: 10;
				`,
			},
		},

		// TabContent component - Reusable container for tab content padding
		tabContent: {
			container: css`
				padding: 1rem;

				@media (min-width: 1024px) {
					padding: 1.5rem;
				}
			`,
		},

		// TabHeader component - Reusable header for all tabs
		tabHeader: {
			container: css`
				position: sticky;
				top: 0;
				z-index: 10;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%);
				border-bottom: 1px solid rgba(59, 130, 246, 0.2);
				padding: 0.375rem 0.75rem;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
				min-height: 2.5rem;
				height: 2.5rem;
			`,
			containerRtl: css`
				background: linear-gradient(270deg, #1e293b 0%, #0f172a 100%) !important;
			`,
			leftContent: css`
				display: flex;
				align-items: center;
				gap: 0.5rem;
			`,
			title: css`
				margin: 0;
				font-size: 0.875rem;
				font-weight: 600;
				color: #ffffff;
			`,
			rightContent: css`
				display: flex;
				align-items: center;
				gap: 0.5rem;
			`,
		},

		// Layout Components
		layout: {
			// ContentPanel
			contentPanel: {
				container: css`
					display: flex;
					height: 100%;
					width: 100%;
					overflow-y: hidden;
				`,
				mainContent: css`
					z-index: 20;
					height: 100%;
					width: 100%;
					overflow-y: auto;
					overflow-x: hidden;
					background-color: ${bgPrimary};
				`,
				mainContentUnset: css`
					all: unset;
				`,
				mainContentPageTab: css`
					padding-top: 0 !important;
				`,
				divider: css`
					width: 0.25rem;
					background-color: rgba(107, 114, 128, 0.2);
				`,
				timelineContainer: css`
					z-index: 10;
					display: none;
					height: 100%;
					min-width: 270px;
					width: 33.333333%;
					overflow-y: auto;

					@media (min-width: 1024px) {
						display: block;
					}
				`,
			},

			// MainPanel
			mainPanel: {
				container: css`
					width: 100%;
					height: 100%;
					flex-direction: row;
					box-sizing: border-box;
					display: flex;
					overflow: auto;
					background-color: ${bgPrimary};
					color: #ffffff;
					opacity: 0;
					transition: all 0.6s;
				`,
				open: css`
					opacity: 1;
					filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15));
				`,
				closed: css`
					height: 0 !important;
				`,
			},

			// Tabs
			tabs: {
				container: css`
					position: relative;
					display: flex;
					background-color: #1f2937;
				`,
				scrollContainer: css`
					display: flex;
					height: 100%;
					width: 100%;
					flex-direction: column;
				`,
				tab: css`
					position: relative;
					display: flex;
					flex-shrink: 0;
					cursor: pointer;
					align-items: center;
					justify-content: center;
					border: 0;
					border-right: 2px solid transparent;
					padding: 0.5rem;
					font-family: ${fontFamilySans};
					transition: all 0.2s ease;
					background: #1f2937;
					color: white;

					&:hover {
						background: linear-gradient(135deg, rgba(51, 65, 85, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%);
						border-right-color: rgba(59, 130, 246, 0.5);
						transform: translateY(-1px);
						box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
					}
				`,
				tabActive: css`
					background: linear-gradient(135deg, ${bgPrimary} 0%, rgba(15, 23, 42, 0.95) 100%);
					border-right: 2px solid rgba(59, 130, 246, 0.7);
				`,
				tabInactive: css`
					&:hover {
						background: linear-gradient(135deg, rgba(51, 65, 85, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%);
					}
				`,
				tabIcon: css`
					transition: all 0.3s;

					.group:hover & {
						opacity: 0.8;
					}
				`,
				tabTooltip: css`
					visibility: hidden;
					color: #ffffff;
					opacity: 0;
					transition: opacity 0.4s;
					position: absolute;
					left: 100%;
					z-index: 50;
					margin-left: 0.5rem;
					white-space: nowrap;
					border-radius: 0.25rem;
					border: 1px solid #374151;
					background-color: #1f2937;
					padding-left: 0.5rem;
					padding-right: 0.5rem;

					&::after {
						content: '';
						position: absolute;
						left: -0.5rem;
						top: 50%;
						height: 0;
						width: 0;
						transform: translateY(-50%) rotate(-90deg);
						border-left: 4px solid transparent;
						border-right: 4px solid transparent;
						border-bottom: 6px solid #374151;
					}

					.group:hover & {
						visibility: visible;
						opacity: 1;
					}
				`,
				tabErrorPulse: css`
					animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
					font-weight: 700;
					color: #dc2626;

					@keyframes pulse {
						0%, 100% {
							opacity: 1;
						}
						50% {
							opacity: 0.5;
						}
					}
				`,
			},
		},

		// Route Boundary Gradients
		gradients: {
			sea: css`
				background-color: #bbf7d0 !important;
				background-image: linear-gradient(to right, rgba(6, 182, 212, 0.5), rgba(59, 130, 246, 0.5)) !important;
			`,
			hyper: css`
				background-image: linear-gradient(to right, #ec4899, #ef4444, #f59e0b) !important;
			`,
			gotham: css`
				background-image: linear-gradient(to right, #374151, #111827, #000000) !important;
			`,
			gray: css`
				background-image: linear-gradient(to right, rgba(55, 65, 81, 0.5), rgba(17, 24, 39, 0.5), rgba(0, 0, 0, 0.5)) !important;
			`,
			watermelon: css`
				background-image: linear-gradient(to right, #ef4444, #10b981) !important;
			`,
			ice: css`
				background-image: linear-gradient(to right, #fda4af, #5eead4) !important;
			`,
			silver: css`
				background-image: linear-gradient(to right, #f3f4f6, #d1d5db) !important;
			`,
		},

		// TanStack Devtools Trigger
		tanstackTrigger: {
			container: css`

				height: 3rem;
				width: 3rem;
				cursor: pointer;
				padding: 0.5rem;
				background-color: #212121;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 9999px;
				transition: all 0.2s;

				&:hover {
					cursor: pointer;
					outline-offset: 2px;
					outline: 2px solid #212121;
				}
			`,
			logo: css`
				outline: none;
				width: 100%;
				height: 100%;
				margin-top: -0.25rem;
				border-radius: 9999px;
				transition: all 200ms;
				overflow: visible;

				&:focus {
					outline: none;
				}
			`,
		},
	}
}

export function useStyles() {
	const [theme, setTheme] = useState<"light" | "dark">("dark")
	const [styles, setStyles] = useState(stylesFactory(theme))

	useEffect(() => {
		setStyles(stylesFactory(theme))
	}, [theme])

	return { styles, theme, setTheme }
}
