import { useState } from "react"
import { Input } from "../components/Input.js"
import { SelectWithOptions } from "../components/Select.js"
import { Stack } from "../components/Stack.js"
import { RouteBoundaryOptions } from "../context/rdtReducer.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import { uppercaseFirstLetter } from "../utils/string.js"

export const SettingsTab = () => {
	const { settings, setSettings } = useSettingsContext()
	const [expansionLevel, setExpansionLevel] = useState(settings.expansionLevel.toString())

	return (
		<Stack className="mb-4">
			<h1>
				<span className="text-lg font-semibold">Settings</span>
				<hr className="mt-2 border-gray-400" />
			</h1>

			<hr className="mt-2 border-gray-700" />
			<Stack gap="lg">
				<Input
					name="expansionLevel"
					id="expansionLevel"
					label="Depth of expansion for JSON objects"
					hint="This allows you to change the depth of expanded properties of json objects."
					value={expansionLevel}
					onChange={(e) => setExpansionLevel(e.target.value ?? "")}
					onBlur={(e) => {
						const value = Number.parseInt(e.target.value)
						if (value && !Number.isNaN(value) && value >= 0) {
							setSettings({ expansionLevel: value })
						}
					}}
				/>

				<div className="flex flex-col gap-2 lg:flex-row">
					<SelectWithOptions
						label="Route boundary gradient"
						onSelect={(value) => setSettings({ routeBoundaryGradient: value })}
						value={settings.routeBoundaryGradient}
						options={RouteBoundaryOptions.map((option) => ({
							label: uppercaseFirstLetter(option),
							value: option,
						}))}
						className="w-full"
						hint="This will determine the look of the gradient shown for route boundaries."
					/>
					<SelectWithOptions
						label="Show route boundaries on"
						onSelect={(value) => setSettings({ showRouteBoundariesOn: value })}
						value={settings.showRouteBoundariesOn}
						options={[
							{ value: "hover", label: "Hover" },
							{ value: "click", label: "Click" },
						]}
						className="w-full"
						hint="This will determine if the route boundaries show on hover of a route segment or clicking a button."
					/>
				</div>
			</Stack>
		</Stack>
	)
}
