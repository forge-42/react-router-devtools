# Icon library plugin

This plugin allows you to see all your project icons in a new tab in react router devtools, copy the code and change their classes.

<video controls="controls" src="./icon-library.mp4" ></video>

## How to use

### Vite
1. Create a plugin directory in your project. (eg on the root you can create a `plugins` folder)
2. Copy the code from the plugin located in this folder and paste it into there (eg `plugins/icon-library.tsx`)
3. Specify the plugin directory in your vite config via the `pluginDir` option:

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

4. The plugin will be automatically imported and added to the TanStack devtools tabs.

**Note:** Plugins are only loaded in development mode for performance reasons.

## How it works

The plugin will use all the icons in your project that are provided to it and will display them in a grid with different sizes.

The plugin is automatically loaded by the Vite plugin and appears as a new tab in the TanStack devtools interface.

You can click on the icon to copy the code of the icon to your clipboard.

You can use the input on the top right to add custom classes to the component (eg. change colors on the fly).

## How to add icons

This will be easy/hard depending on your project setup. The basic idea is to have an icon component that is reusable across the project by
providing a different name and size to the component. If you do not have this you would probably need to do it in a different way. What is
important is to have an array of icon names in the project that you can use to generate the icons.

## Can I add my own features?

All the plugins featured under this folder are meant to be copy/pasted into your project with you having all the rights to modify them as you see fit. Feel free to add/remove whatever you like. If you add something cool, please share it with us so we can add it to the list of plugins or improve the existing ones.