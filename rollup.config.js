import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import pkg from "./package.json";

const header = `
/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage.replace(/#readme/, "")}
 * ${pkg.license} license by ${pkg.author}
 */
`;

let config = {
    input: "src/iblize.js",
    output: {
        file: "dist/iblize.js",
        format: "umd",
        name: "Iblize",
        banner: header,
        sourcemap: false
    },
    plugins: [
        resolve(),
        commonjs(),
        styles({
            mode: ["inject", { 
                prepend: true, 
                attributes: { id: "iblize_style" }
            }],
            minimize: true
        })
    ]
};

if (process.env.mode == "prod") {
    config.output.sourcemap = true;
    config.plugins.push(
        babel({
            babelHelpers: "bundled",
            presets: ["@babel/preset-env"],
            // plugins: [["prismjs", {}]]
        }),
        terser()
    );
}

export default config;
