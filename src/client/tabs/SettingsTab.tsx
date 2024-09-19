import { useState } from "react";
import { Checkbox } from "../components/Checkbox.js";
import { Input } from "../components/Input.js";
import { SelectWithOptions } from "../components/Select.js";
import { Stack } from "../components/Stack.js";
import { useSettingsContext } from "../context/useRDTContext.js";
import { RouteBoundaryOptions } from "../context/rdtReducer.js";
import { uppercaseFirstLetter } from "../utils/string.js";

export const SettingsTab = () => {
  const { settings, setSettings } = useSettingsContext();
  const [minHeight, setMinHeight] = useState(settings.minHeight.toString());
  const [maxHeight, setMaxHeight] = useState(settings.maxHeight.toString());
  const [expansionLevel, setExpansionLevel] = useState(settings.expansionLevel.toString());
  const [openHotkey, setOpenHotkey] = useState(settings.openHotkey.toString());
 
  return (
    <Stack className="rdt-mb-4">
      <h1>
        <span className="rdt-text-2xl rdt-font-semibold">Settings</span>
        <hr className="rdt-mt-2 rdt-border-gray-400" />
      </h1>
      <Checkbox
        id="defaultOpen"
        hint="The dev tools will be open by default when you run the application and when you refresh the browser."
        onChange={() => setSettings({ defaultOpen: !settings.defaultOpen })}
        value={settings.defaultOpen}
      >
        Open dev tools by default
      </Checkbox>
      <Checkbox
        id="requireUrlFlag"
        hint={`Allows you to only show rdt when there is a flag in the URL search params set. (${settings.urlFlag}=true)`}
        onChange={() => setSettings({ requireUrlFlag: !settings.requireUrlFlag })}
        value={settings.requireUrlFlag}
      >
        Show dev tools only when URL flag is set ?{settings.urlFlag}=true
      </Checkbox>
      <Checkbox
        id="hideUntilHover"
        hint="The dev tools trigger will be hidden on the page until you hover over it."
        onChange={() => setSettings({ hideUntilHover: !settings.hideUntilHover })}
        value={settings.hideUntilHover}
      >
        Hide the trigger until hovered
      </Checkbox>
      <Checkbox
        id="showBreakpointIndicator"
        hint="Whether to show the breakpoint indicator or not"
        onChange={() => setSettings({ showBreakpointIndicator: !settings.showBreakpointIndicator })}
        value={settings.showBreakpointIndicator}
      >
        Show breakpoint indicator
      </Checkbox>
      
      <hr className="rdt-mt-2 rdt-border-gray-700" />
      <Stack gap="lg">
        {settings.requireUrlFlag && (
          <Input
            name="urlFlag"
            id="urlFlag"
            label="URL flag to use"
            hint={`This allows you to change the URL search param flag that will be used to show the dev tools when "Show dev tools only when URL flag is set" is set to true`}
            value={settings.urlFlag}
            onChange={(e) => setSettings({ urlFlag: e.target.value ?? "" })}
            onBlur={(e) => {
              setSettings({ urlFlag: e.target.value.trim() });
            }}
          />
        )}
       
        <Input
          name="expansionLevel"
          id="expansionLevel"
          label="Depth of expansion for JSON objects"
          hint="This allows you to change the depth of expanded properties of json objects."
          value={expansionLevel}
          onChange={(e) => setExpansionLevel(e.target.value ?? "")}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (value && !isNaN(value) && value >= 0) {
              setSettings({ expansionLevel: value });
            }
          }}
        />
        <Input
          name="openHotkey"
          id="openHotkey"
          label="Hotkey to open/close development tools"
          hint="This allows you to change the default hotkey used to open development tools."
          value={openHotkey}
          onChange={(e) => setOpenHotkey(e.target.value ?? "")}
          onBlur={(e) => {
            const value =  (e.target.value);
            if (value  ) {
              setSettings({ openHotkey: value });
            }
          }}
        />
        <div className="rdt-flex rdt-flex-col rdt-gap-2 lg:rdt-flex-row">
          <Input
            name="minHeight"
            label="Min height of the dev tools (px)"
            hint="The dev tools will not shrink below this height when being dragged."
            id="minHeight"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value ?? "")}
            onBlur={(e) => {
              const value = parseInt(e.target.value);
              if (value && !isNaN(value) && value < settings.maxHeight && value > 100) {
                setSettings({ minHeight: value });
              }
            }}
          />
          <Input
            name="maxHeight"
            id="maxHeight"
            label="Max height of the dev tools (px)"
            hint="The dev tools will not expand beyond this height when being dragged."
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value ?? "")}
            onBlur={(e) => {
              const value = parseInt(e.target.value);
              if (value && !isNaN(value) && value > settings.minHeight) {
                setSettings({ maxHeight: value });
              }
            }}
          />
        </div>

        <div className="rdt-flex rdt-flex-col rdt-gap-2 lg:rdt-flex-row">
          <SelectWithOptions
            label="Trigger position"
            onSelect={(value) => setSettings({ position: value })}
            value={settings.position}
            className="rdt-w-full"
            options={[
              { label: "Bottom Right", value: "bottom-right" },
              { label: "Bottom Left", value: "bottom-left" },
              { label: "Top Right", value: "top-right" },
              { label: "Top Left", value: "top-left" },
              { label: "Middle Right", value: "middle-right" },
              { label: "Middle Left", value: "middle-left" },
            ]}
            hint="This will determine where your trigger position on the screen is when the tools are collapsed."
          />
          <SelectWithOptions
            label="Environments position"
            onSelect={(value) => setSettings({ liveUrlsPosition: value as any })}
            value={settings.position}
            className="rdt-w-full"
            options={[
              { label: "Bottom Right", value: "bottom-right" },
              { label: "Bottom Left", value: "bottom-left" },
              { label: "Top Right", value: "top-right" },
              { label: "Top Left", value: "top-left" }, 
            ]}
            hint="This will determine where your environments position on the screen is."
          />
          <SelectWithOptions
            label="Panel position"
            onSelect={(value) => setSettings({ panelLocation: value })}
            value={settings.panelLocation}
            className="rdt-w-full"
            options={[
              { label: "Top", value: "top" },
              { label: "Bottom", value: "bottom" },
            ]}
            hint="This will determine where your panel shows up once opened"
          />
        </div>

        <Input
          name="port"
          id="port"
          label="Remix Forge port (default: 3003)"
          hint="The port on which Remix Forge is running. If you change this field make sure you change the port in the Remix Forge config as well."
          value={settings.port}
          onChange={(e) => {
            const value = e.target.value;
            if (value && !isNaN(parseInt(value))) {
              setSettings({ port: parseInt(value) });
            }
          }}
        />
        <SelectWithOptions
          label="Route boundary gradient"
          onSelect={(value) => setSettings({ routeBoundaryGradient: value })}
          value={settings.routeBoundaryGradient}
          options={RouteBoundaryOptions.map((option) => ({
            label: uppercaseFirstLetter(option),
            value: option,
          }))}
          hint="This will determine the look of the gradient shown for route boundaries."
        />
      </Stack>
    </Stack>
  );
};
