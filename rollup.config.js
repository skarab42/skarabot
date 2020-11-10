import livereload from "rollup-plugin-livereload";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleaner from "rollup-plugin-cleaner";
import spawnServer from "./spawnServer";

const watch = process.env.ROLLUP_WATCH;

const inputDir = "client";
const outputDir = "public";
const serverPath = "server/index.js";

export default {
  input: [`${inputDir}/streamer-highlight.js`, `${inputDir}/wall-of-fame.js`],
  output: {
    format: "es",
    sourcemap: true,
    dir: `${outputDir}/js/`
  },
  plugins: [
    commonjs(),
    resolve({ browser: true }),
    watch && livereload(outputDir),
    watch && spawnServer(serverPath),
    !watch && cleaner({ targets: [outputDir] }),
    !watch && terser()
  ]
};
