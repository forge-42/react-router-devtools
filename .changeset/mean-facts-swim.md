---
"react-router-devtools": major
---

Migration to TanStack Devtools is here! 🎉

You can now leverage the powerful features of TanStack Devtools within React Router Devtools, enhancing your debugging and development experience.

You can easily create your own devtool plugins, inspect application state, and trace network requests with improved visibility.

### Key Changes:
- **TanStack Integration**: Seamless integration with TanStack Devtools for advanced debugging capabilities
- **Enhanced UI**: New panels and tabs for better state and network inspection
- **Improved Performance**: Optimized for faster load times and reduced overhead
- **Middleware Support**: Ability to log middleware events and actions for deeper insights and also see them on the network tab
- **Extended Configuration**: New configuration options to customize TanStack Devtools behavior alongside React Router

### Migration Steps:
1. Update your configuration to include TanStack-specific options.
2. Review and adjust any custom plugins to ensure compatibility with the new TanStack integration.
3. Test your application to verify that all devtools features are functioning as expected.

### Features that have been removed:
- The route creation via devtools UI has been removed.
- Server info on the active page tab has been removed.
