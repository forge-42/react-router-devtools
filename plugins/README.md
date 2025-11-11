# Plugins

This folder contains all the ready to go plugins that you can copy/paste into your project.

Plugins extend the React Router DevTools by adding custom tabs to the TanStack devtools interface.

If you build a plugin please feel free to create a PR towards the `plugins` folder so we can add it to the list of plugins.

## How to use

1. Create a `plugins` directory in your project root (or any other directory you prefer)
2. Copy the plugin file(s) you want to use into this directory
3. Configure the Vite plugin to load plugins from your directory:

```js
// vite.config.js
import { reactRouterDevTools } from 'react-router-devtools'

export default {
  plugins: [
    reactRouterDevTools({
      pluginDir: './plugins' // path to your plugins directory
    })
  ]
}
```

4. The plugins will be automatically imported and added as tabs in the devtools

**Note:** Plugins are only loaded in development mode for performance reasons.

## Plugin Structure

Each plugin should export a function that returns an object with the following structure:

```tsx
export const myPlugin = () => ({
  name: "My Plugin",        // Display name for the tab
  render: <MyComponent /> // React component to render
})
```

The plugin will be automatically detected and loaded by scanning for `export const` statements in the plugin directory.

## Available Plugins

- **Icon Library** - Browse and copy all your project icons with different sizes
- **Tailwind Palette** - View and copy Tailwind color classes

Each plugin has a `README.md` file with detailed setup instructions.

## Can I add my own features?

All the plugins featured under this folder are meant to be copy/pasted into your project with you having all the rights to modify them as you see fit. Feel free to add/remove whatever you like. If you add something cool, please share it with us so we can add it to the list of plugins or improve the existing ones.

## How to add a new plugin

1. Fork the repo
2. Create a new folder under `plugins` with the name of your plugin
3. Add a `README.md` file with the instructions on how to use the plugin
4. Add TODO's in the code where the user needs to modify the code to their project specifications
5. Add an image/video/gif of the plugin in action
6. Create a PR towards the repository!