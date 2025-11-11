import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterDevTools, defineRdtConfig } from "../../packages/react-router-devtools/dist/index"

import inspect from "vite-plugin-inspect"
const config = defineRdtConfig({
  client: {


  },
  pluginDir: "./plugins",
  includeInProd: {
    client: true,
    server: true
  },
    // Set this option to true to suppress deprecation warnings
    // suppressDeprecationWarning: true,
  server:  {
    serverTimingThreshold: 250,
  },
});

export default defineConfig({
  plugins: [
    inspect(),
    reactRouterDevTools( config)  ,
    reactRouter(),
    tsconfigPaths()
  ],

  server: {
    open: true,
    port: 3000,
  },
});
