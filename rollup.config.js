import terser from '@rollup/plugin-terser';
import fs from 'node:fs';

let pkg = fs.readFileSync('./package.json', 'utf-8');
    pkg = JSON.parse(pkg);

const header = `
/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}
 * ${pkg.license} license by ${pkg.author}
 */
`;

const config = properties => {
      return {
            format: 'umd',
            banner: header,
            name: 'Iblize',
            ...properties
      };
};

export default {
      input: 'src/iblize.js',
      output: [
            config({
                  file: 'dist/iblize.js'
            }),
            config({
                  file: 'dist/iblize.min.js',
                  sourcemap: true,
                  plugins: [terser()]
            })
      ]
};
