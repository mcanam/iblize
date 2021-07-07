import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import inject from "@rollup/plugin-inject";
import pkg from "./package.json";

const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * ${pkg.license} license by ${pkg.author}
 */
`;

export default {
    input: "src/iblize.js",
    output: {
        file: "dist/iblize.js",
        format: "umd",
        name: "Iblize",
        banner: banner
    },
    plugins: [
        resolve(),
        commonjs(),
        inject({ Prism: "prismjs" }),
        babel({
            babelHelpers: "bundled",
            presets: ["@babel/preset-env"]
        }),
        terser()
    ]
};
