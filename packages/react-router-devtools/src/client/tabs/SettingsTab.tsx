import { useState } from "react"
import { Input } from "../components/Input.js"
import { SelectWithOptions } from "../components/Select.js"
import { Stack } from "../components/Stack.js"
import { TabContent } from "../components/TabContent.js"
import { TabHeader } from "../components/TabHeader.js"
import { Icon } from "../components/icon/Icon.js"
import { RouteBoundaryOptions } from "../context/rdtReducer.js"
import { useSettingsContext } from "../context/useRDTContext.js"
import { useStyles } from "../styles/use-styles.js"
import { uppercaseFirstLetter } from "../utils/string.js"

export const SettingsTab = () => {
	const { styles } = useStyles()
	const { settings, setSettings } = useSettingsContext()
	const [expansionLevel, setExpansionLevel] = useState(settings.expansionLevel.toString())

	return (
		<div className={styles.settingsTab.container}>
			<TabHeader icon={<Icon name="Settings" />} title="Settings" />

			<div className={styles.settingsTab.content}>
				<TabContent>
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

						<div className={styles.settingsTab.selectRow}>
							<SelectWithOptions
								label="Route boundary gradient"
								onSelect={(value) => setSettings({ routeBoundaryGradient: value })}
								value={settings.routeBoundaryGradient}
								options={RouteBoundaryOptions.map((option) => ({
									label: uppercaseFirstLetter(option),
									value: option,
								}))}
								className={styles.utils.wFull}
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
								className={styles.utils.wFull}
								hint="This will determine if the route boundaries show on hover of a route segment or clicking a button."
							/>
						</div>
					</Stack>
				</TabContent>
			</div>
		</div>
	)
}
