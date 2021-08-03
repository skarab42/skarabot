// import livereload from "rollup-plugin-livereload";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleaner from "rollup-plugin-cleaner";
import svelte from "rollup-plugin-svelte";
import spawnServer from "./spawnServer";
import path from "path";
import fs from "fs";

const watch = process.env.ROLLUP_WATCH;

const inputDir = "client";
const outputDir = "public";
const serverPath = "server/index.js";

const input = [];

const inputPath = path.resolve(__dirname, inputDir);

fs.readdirSync(inputPath).forEach((file) => {
  if (!fs.lstatSync(path.join(inputPath, file)).isDirectory()) {
    input.push(`${inputDir}/${file}`);
  }
});

export default {
  input,
  output: {
    format: "es",
    sourcemap: true,
    dir: `${outputDir}/js/`,
  },
  plugins: [
    commonjs(),
    resolve({ browser: true, dedupe: ["svelte"] }),
    svelte({ dev: watch }),
    // watch && livereload(outputDir),
    watch && spawnServer(serverPath),
    !watch && cleaner({ targets: [`${outputDir}/js/`] }),
    !watch && terser(),
  ],
};
