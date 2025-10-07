/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{tsx,ts,js}"],
	theme: {
		extend: {
			colors: {
				popover: "#212121",
				main: "#212121",
				"popover-foreground": "#fff",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				"fade-in-left": {
					"0%": { opacity: 0, transform: "translateX(-100%)" },
					"100%": { opacity: 1, transform: "translateX(0)" },
				},
				"fade-in": {
					"0%": { opacity: 0 },
					"100%": { opacity: 1 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in-left": "fade-in-left 0.5s ease-in",
				"fade-in": "fade-in 0.5s ease-in",
			},
		},
	},
	plugins: [await import("tailwindcss-animate")],
}
