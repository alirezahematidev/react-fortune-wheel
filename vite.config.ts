import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import license from "rollup-plugin-license";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { ViteAliases } from "vite-aliases";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({ copyDtsFiles: true }),
    ViteAliases({ useTypescript: true }),
    splitVendorChunkPlugin(),
    react({
      include: /.tsx?$/i,
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".jsx", ".js"],
  },
  build: {
    lib: {
      name: "react-fortune-wheel",
      entry: resolve(__dirname, "index.html"),
    },
    outDir: "lib",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      external: ["react"],
      output: {
        dir: "lib",
        format: "cjs",
        plugins: [terser()],
        globals: {
          react: "React",
        },
      },
      plugins: [
        json(),
        commonjs(),
        image(),
        typescript({ tsconfig: resolve(__dirname, "tsconfig.json") }),
        license({
          sourcemap: true,
          banner: {
            commentStyle: "regular",
            content: { file: resolve(__dirname, "LICENSE"), encoding: "utf-8" },
          },
          thirdParty: {
            includePrivate: true,
            output: {
              file: resolve(__dirname, "lib", "dependencies.txt"),
              encoding: "utf-8",
            },
          },
        }),
      ],
    },
  },
});
