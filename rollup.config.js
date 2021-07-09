import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import styles from "rollup-plugin-styles";
import inject from "@rollup/plugin-inject";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import pkg from "./package.json";

const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * ${pkg.license} license by ${pkg.author}
 */
`;

let fileName = "iblize.dev.js";

let pluginList = [
    resolve(),
    commonjs(),
    styles({
        mode: ["inject", { prepend: true }],
        minimize: true
    })
];

if (process.env.mode == "prod") {
    fileName = "iblize.js";
    pluginList = [
        ...pluginList,
        inject({ Prism: "prismjs" }),
        babel({
            babelHelpers: "bundled",
            presets: ["@babel/preset-env"]
        }),
        terser()
    ];
}

export default {
    input: "src/iblize.js",
    output: {
        file: "dist/" + fileName,
        format: "umd",
        name: "Iblize",
        banner: banner
    },
    plugins: pluginList
};
