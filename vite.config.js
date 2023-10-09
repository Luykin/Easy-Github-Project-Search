import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import visualizer from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";
import Unocss from "unocss/vite";
import VitePluginFonts from "vite-plugin-fonts";

export default defineConfig(({ mode }) => ({
  define: {
    __SENTRY_DEBUG__: mode === "development",
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: {
        bigint: true,
      },
    },
  },
  build: {
    target: ["esnext"],
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          sentry: ["@sentry/react", "@sentry/tracing"],
          antd: ["antd"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      src: path.resolve(__dirname, "./src/"),
    },
  },
  plugins: [
    react(),
    Unocss(),
    VitePluginFonts({
      google: {
        families: [{ name: "Roboto", styles: "wght@400;500;600;700" }],
      },
    }),
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    visualizer(),
  ],
}));
