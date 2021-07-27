#!/usr/bin/env node

const fs = require("fs");

fs.readFile("./node_modules/prismjs/components.json", (error, data) => {
    if (error) throw error;

    const text = data.toString();
    const { languages } = JSON.parse(text);

    delete languages["meta"];

    if (!fs.existsSync("./dist/languages")) {
        fs.mkdirSync("./dist/languages", { recursive: true });
    }

    copyLanguages(languages);
    generateLanguagesJS(languages);
});

function copyLanguages(languages) {
    Object.keys(languages).forEach(name => {
        const src = `./node_modules/prismjs/components/prism-${name}.min.js`;
        const dest = `./dist/languages/${name}.js`;

        fs.copyFile(src, dest, error => {
            if (error) throw error;
            console.log(`copying ${name}.js => dist/languages`);
        });
    });
}

function generateLanguagesJS(languages) {
    const requireMap = {};
    const aliasesMap = {};

    Object.entries(languages).forEach(([key, value]) => {
        if (value.require != undefined) {
            requireMap[key] = value.require;
        }

        if (value.alias != undefined) {
            if (!Array.isArray(value.alias)) {
                value.alias = [value.alias];
            }

            value.alias.forEach(alias => {
                aliasesMap[alias] = key;
            });
        }
    });

    let text = `
        const languages = {
            require: ${JSON.stringify(requireMap)},
            aliases: ${JSON.stringify(aliasesMap)}
        };
        export default languages;
    `;

    const dest = "src/utils/languages.js";

    fs.writeFile(dest, text, (error) => {
        if (error) throw error;
        console.log("generate languages.js => src/utils");
    });
}
