import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "out.js",
    format: "iife",
    name: "ModImage",
  },
  plugins: [typescript()],
};
