<p align="center">
<img src="./assets/remix-dev-tools.png" style="display: block; margin: 0 auto;" align="middle" height="240" alt="react-router-devtools"  />
</p>

# react-router-devtools

![GitHub Repo stars](https://img.shields.io/github/stars/forge-42/react-router-devtools?style=social)
![npm](https://img.shields.io/npm/v/react-router-devtools?style=plastic)
![GitHub](https://img.shields.io/github/license/forge-42/react-router-devtools?style=plastic)
![npm](https://img.shields.io/npm/dy/react-router-devtools?style=plastic)
![npm](https://img.shields.io/npm/dw/react-router-devtools?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/forge-42/react-router-devtools?style=plastic)

react-router-devtools is an open-source package designed to enhance your development workflow when working with React Router v7+, a full-stack JavaScript framework for building web applications. This package provides a user-friendly interface consisting of three tabs, **Active Page**, **Terminal**, **Settings**, **Errors**, **Network** and **Routes**, along with a side tab called **Timeline**. With react-router-devtools, you can efficiently monitor and manage various aspects of your React Router v7+ projects, including page information, URL parameters, server responses, loader data, routes, and more.


You can also track down hydration issues with the **Errors** tab and view your routes in a tree/list view with the **Routes** tab.


**Network** tab is a powerful tool for tracing all your network requests and see what's happening under the hood. You can see all the requests in real-time, with the ability to see if they are aborted, if they are cached, and if they are successful or not.

### Remix Development Tools

This repository used to be called remix-development-tools, but we decided to rename it to react-router-devtools to better reflect the fact that it's a package for React Router v7+ and not just for Remix.

If you're looking for the old version of this package, you can find it [here](https://github.com/forge-42/react-router-devtools/tree/remix-development-tools).

And the detailed documentation can be found [here](https://remix-development-tools.fly.dev/).

# Documentation

Detailed documentation can be found here:

https://remix-development-tools.fly.dev/


## Getting Started

1. Install the package via npm:

```bash
npm install react-router-devtools -D
```

```js
import { reactRouterDevTools } from "react-router-devtools";

// Add it to your plugins array in vite.config.js
export default defineConfig({
  plugins: [reactRouterDevTools(), reactRouter(), tsconfigPaths()],
});
```

That's it, you're done!

### CloudFlare

If you're trying to spin it up on CF, try adding this to your `optimizeDeps` in your `vite.config.js` file:
```ts
optimizeDeps: {
  include: [
    // other optimized deps
    "beautify",
    "react-diff-viewer-continued",
    "classnames",
    "@bkrem/react-transition-group",
  ],
},
```

## Support

If you like react-router-devtools consider starring the repository or donating via Github sponsors. If you have any questions, comments, or suggestions, please feel free to reach out!

## License

react-router-devtools is open-source software released under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgments

React Router Devtools was inspired by the React Router v7 and aims to enhance the development experience for React Router v7+ users.

Feel free to explore React Router Devtools, and we hope it significantly improves your React Router development process. If you encounter any issues or have suggestions for enhancements, please don't hesitate to open an issue on our GitHub repository. Happy Remixing!

## Thanks

Thanks to all the contributors on this project and the support to the community. You guys are awesome!

---

Devoted to my loving wife and my little late bird Kiira who helped me initially build out these tools by keeping me company and being my rubber duck, she will forever be my best friend.

In loving memory of my late Grandfather, who taught me to always be curious, never stop learning, and to always be kind to others, and my late Grandmother who always encouraged me to learn new things, and stand up for the things I believe in.
