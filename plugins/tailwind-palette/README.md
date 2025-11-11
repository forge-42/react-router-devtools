# Tailwind palette plugin

This plugin allows you to see all tailwind colors in a new tab in react router devtools, copy them and paste into code.

<video controls="controls" src="./color-palette.mp4" ></video>

## How to use

### Vite
1. Create a plugin directory in your project. (eg on the root you can create a `plugins` folder)
2. Add the plugin directory path to the tailwind config file:
   ```ts
   // tailwind.config.ts
   export default {
     content: ["./plugins/**/*.{ts,tsx}"]
   }
   ```
3. Copy the code from the plugin located in this folder and paste it into there (eg `plugins/tailwind-palette.tsx`)
4. Specify the plugin directory in your vite config via the `pluginDir` option:

```js
// vite.config.js
import { reactRouterDevTools } from 'react-router-devtools'

export default {
  plugins: [
    reactRouterDevTools({
      pluginDir: './plugins'
    })
  ]
}
```

5. The plugin will be automatically imported and added to the TanStack devtools tabs.

**Note:** Plugins are only loaded in development mode for performance reasons.


## How it works

The plugin will use all the tailwind colors and list them for you so you can easily copy paste them and apply them to your elements.

The plugin is automatically loaded by the Vite plugin and appears as a new tab in the TanStack devtools interface.

You can click on the color to copy the name of the color to your clipboard.


## Can I add my own features?

All the plugins featured under this folder are meant to be copy/pasted into your project with you having all the rights to modify them as you see fit. Feel free to add/remove whatever you like. If you add something cool, please share it with us so we can add it to the list of plugins or improve the existing ones.
