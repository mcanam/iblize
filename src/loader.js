// inspired by prism autoloader plugin

import Dom from "./utils/dom";
import languages from "./utils/languages";

class Loader {
    constructor() {
        this.baseURL = "https://unpkg.com/iblize/dist/";
        this.themes = [];
    }

    loadLanguage(name, path, callback) {
        const { require, aliases } = languages;

        if (name in aliases) {
            // if language name is alias 
            // change with real name
            name = aliases[name];
        }

        if (name in Prism.languages) {
            // if language is exist stop 
            // execution and run callback
            return callback();
        }

        if (path == "") {
            path = this.baseURL + "languages/";
        }

        if (name in require) {
            // load language depedencies if required
            if (!Array.isArray(require[name])) {
                require[name] = [require[name]];
            }

            require[name].forEach(require => {
                if (require in Prism.languages) return;
                createScript(require);
            });
        }

        // load language
        createScript(name, callback);

        function createScript(name, callback = () => {}) {
            const script = Dom.create("script", {
                parent: document.body,
                src: path + name + ".js",
                onload: () => { script.remove(); callback() }
            });
        }
    }

    loadTheme(name, path) {
        if (path == "") {
            path = this.baseURL + "themes/";
        }

        if (this.themes.includes(name)) {
            // if theme is exist, just update path/url.
            const link = Dom.select(`link[theme="${name}"]`);
            return link.href = path + name + ".css";
        }

        const ref = Dom.select("#iblize_style");

        ref.after(Dom.create("link", {
            rel: "stylesheet",
            href: path + name + ".css",
            attr: { theme: name }
        }));

        this.themes.push(name);
    }
}

export default Loader;