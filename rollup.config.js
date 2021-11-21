import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import styles from "rollup-plugin-styles";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import pkg from "./package.json";

const header = `
/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * ${pkg.license} license by ${pkg.author}
 */
`;

const commonPlugins = [
    resolve(),
    commonjs(),
    styles({
        mode: [
            "inject", 
            { prepend: true, attributes: { id: "iblize-base" } }
        ],
        minimize: true
    }),
    replace({
        preventAssignment: true,
        __VERSION__: `"${pkg.version}"`
    })
];

const dev = {
    input: "src/index.js",
    output: {
        file: ".dev-build/iblize.js",
        format: "umd",
        name: "Iblize",
        sourcemap: true
    },
    plugins: [
        ...commonPlugins,
        serve({
            port: 4321,
            open: true
        }),
        livereload()
    ]
};

const prod = {
    input: "src/index.js",
    output: [
        {
            file: "dist/iblize.js",
            format: "umd",
            name: "Iblize",
            banner: header,
            sourcemap: true
        },
        {
            file: "dist/iblize.min.js",
            format: "umd",
            name: "Iblize",
            banner: header,
            sourcemap: true,
            plugins: [terser()]
        }
    ],
    plugins: [
        ...commonPlugins,
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            presets: ["@babel/preset-env"]
        })
    ]
};

let config = process.env.MODE == "prod" ? prod : dev;
export default config;
