# Tailwind palette plugin

This plugin allows you to see all tailwind colors in a new tab in react router devtools, copy them and paste into code.

<video controls="controls" src="./color-palette.mp4" ></video>

## How to use


### Vite
1. Create a plugin directory in your project. (eg on the root you can create a `your-path-here` folder)
2. Add the plugin directory path to the tailwind config file.
     ```ts
     //tailwind.config.ts
     export default {
        content: ["./your-path-here/**/*.{ts,tsx}"]
     }
     ```
4. Copy the code from the plugin located in this folder. and paste it into there (eg `your-path-here/tailwind-palette.tsx`)
5. Specify the plugin directory in your vite config via the `pluginsDir` option:

```js
  // vite.config.js
  export default {
    plugins: [reactRouterDevTools({ pluginsDir: './your-path-here' })]
  }
```


### Remix bundler

1. Copy the code from the plugin located in this folder.
2. Go over the TODO's in the code and modify the code to your project specifications.
3. Import the plugin exported from the `tailwind-palette.tsx` into your `root.tsx` file.
4. Add the plugin to the `plugins` array in the `withDevTools` wrapper.

```tsx
  import { tailwindPalettePlugin } from "~/tailwind-palette.tsx";

  AppExport = withDevTools(App, {
    plugins: [tailwindPalettePlugin()]
  });
```

5. Run your project and open the new tab in the development tools.

## How it works

The plugin will use all the tailwind colors and list them for you so you can easily copy paste them and apply them to your elements

You can click on the color to copy the name of the color to your clipboard.


## Can I add my own features?

All the plugins featured under this folder are meant to be copy/pasted into your project with you having all the rights to modify them as you see fit. Feel free to add/remove whatever you like. If you add something cool, please share it with us so we can add it to the list of plugins or improve the existing ones.
