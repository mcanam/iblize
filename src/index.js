import Prism from "prismjs";
import dom from "./utils/dom";
import History from "./modules/history";
import Loader from "./modules/loader";

import "./index.scss";

class Iblize {
    constructor(container = "", options = {}) {
        this.version = __VERSION__;
        
        this.history = new History(this);
        this.loader = new Loader();

        if (container instanceof HTMLElement) {
            this.elementRoot = container;
        } else {
            this.elementRoot = dom.select(container);
        }

        if (!this.elementRoot) {
            throw Error("Iblize can't find the editor containers");
        }

        // default options
        this.options = {
            language: "javascript",
            languagesPath: "",
            lineNumber: true,
            readOnly: false,
            tabSize: 2,
            theme: "iblize-dark",
            themesPath: ""
        };

        // prepare the editor
        this.setupEditor();
        this.setValue(null);
        this.loadTheme();
        this.loadLanguage();
        this.setOptions(options);
    }

    // Setup Editor

    setupEditor() {
        this.createEditorElement();
        this.attachTextareaEvent();
    }

    createEditorElement() {
        this.elementWrapper = dom.create("div", {
            parent: this.elementRoot,
            className: `iblize ${this.options.theme}`
        });

        this.elementLinenumber = dom.create("div", {
            parent: this.elementWrapper,
            className: "iblize_linenumber"
        });

        this.elementContent = dom.create("div", {
            parent: this.elementWrapper,
            className: "iblize_content"
        });

        this.elementPre = dom.create("pre", {
            parent: this.elementContent,
            className: "iblize_pre"
        });

        this.elementCode = dom.create("code", {
            parent: this.elementPre,
            className: "iblize_code"
        });

        this.elementTextarea = dom.create("textarea", {
            parent: this.elementContent,
            className: "iblize_textarea",
            attr: {
                spellcheck: "false",
                autocorrect: "off",
                autocomplete: "off",
                autocapitalize: "off"
            }
        });
    }

    attachTextareaEvent() {
        dom.addEvent(this.elementTextarea, [
            {
                name: "input",
                callback: this.handleInput.bind(this)
            },
            {
                name: "keydown",
                callback: this.handleKeydown.bind(this)
            },
            {
                name: "scroll",
                callback: this.handleScroll.bind(this)
            }
        ]);
    }

    // Textarea Event Handler

    handleScroll() {
        const {
            scrollWidth: width,
            scrollHeight: height,
            scrollTop: top,
            scrollLeft: left
        } = this.elementTextarea;

        dom.addStyle(this.elementLinenumber, {
            height: height + "px",
            transform: `translateY(${top * -1}px)`
        });

        dom.addStyle(this.elementPre, {
            width: width + "px",
            height: height + "px",
            transform: `translate(${left * -1}px, ${top * -1}px)`
        });
    }

    handleInput() {
        if (this.typingTimeout != undefined) {
            clearTimeout(this.typingTimeout);
        }
      
        this.typingTimeout = setTimeout(() => {
            this.recordHistory();
        }, 150);

        if (this.onUpdateCallback != undefined) {
            // run on update callback if exist
            this.onUpdateCallback(this.getValue());
        }

        this.closeCharacter();
        this.updateEditor();
    }

    handleKeydown(event) {
        if (event.key == "Tab") {
            event.preventDefault();
            this.insertTab();
        }

        if (event.keyCode == 13 || event.key == "Enter") {
            event.preventDefault();
            this.addLineIndent();
        }

        if (event.ctrlKey && event.key == "z") {
            event.preventDefault();
            this.undo();
        }

        if (event.ctrlKey && event.shiftKey && event.key == "Z") {
            event.preventDefault();
            this.redo();
        }
    }

    // Editor Internal Method

    updateEditor() {
        this.countLinenumber();
        this.highlightSyntax();
    }

    countLinenumber() {
        const totalLines = this.getTotalLine();
        const childLength = this.elementLinenumber.childElementCount;

        if (totalLines != childLength && this.options.lineNumber) {
            let child = "";

            for (let i = 0; i < totalLines; i++) {
                child += `<span class="iblize_linenumber_child">${i + 1}</span>`;
            }

            this.elementLinenumber.innerHTML = child;
        }
    }

    highlightSyntax() { 
        const input = this.getValue();

        let language = this.options.language;
        let grammar = Prism.languages[language];

        if (grammar == undefined) {
            grammar = Prism.languages["plaintext"];
        }

        const output = Prism.highlight(input, grammar, language);
        this.elementCode.innerHTML = output;
    }

    // Editor Internal Method

    addLineIndent() {
        const cursor = this.getCursor();
        const value = this.getValue();

        // get indent length from current active line
        const activeLine = this.getActiveLine();
        const lineValue = this.getLineValue(activeLine);
        const lineIndent = lineValue.match(/^\s{1,}/);

        // get the characters from before and after cursor
        const charBefore = value.charAt(cursor - 1);
        const charAfter = value.charAt(cursor);

        let indent = lineIndent == null ? 0 : lineIndent[0].length;

        if (
            (charBefore == "(" && charAfter == ")") ||
            (charBefore == "{" && charAfter == "}") ||
            (charBefore == "[" && charAfter == "]") ||
            (charBefore == ">" && charAfter == "<")
        ) {
            
            const tabSize = this.options.tabSize;
            const string = "\n" + " ".repeat(indent + tabSize) + 
                           "\n" + " ".repeat(indent);

            this.insertText(cursor, string, { 
                moveCursor: cursor + indent + tabSize + 1,
                recordHistory: "both"
             });

        } else {

            this.insertText(cursor, "\n" + " ".repeat(indent), { 
                moveCursor: cursor + indent + 1,
                recordHistory: "both"
             });

        }
    }

    closeCharacter() {
        const cursor = this.getCursor();
        const value = this.getValue();

        // get the characters from before and after cursor
        const charBefore = value.charAt(cursor - 1);
        const charAfter = value.charAt(cursor);

        const charList = [
            { open: "(", close: ")" },
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "<", close: ">" },
            { open: "'", close: "'" },
            { open: '"', close: '"' },
            { open: "`", close: "`" }
        ];

        if (!this.valueLengthReminder) {
            // make reminder for value length
            // to compare with current value.
            // to detect backspace on mobile browser.
            this.valueLengthReminder = 0;
        }

        if (value.length > this.valueLengthReminder) {

            charList.forEach((char) => {
                // skip char
                if (charBefore == char.close && charAfter == char.close) {
                    this.removeText(cursor, cursor + 1);
                    return;
                }

                // closing char
                if (charBefore == char.open) {
                    this.insertText(cursor, char.close, {
                        moveCursor: cursor
                    });
                }
            });

        } else {

            // previous history before deleted
            const lastHistory = this.history.stack.slice(-1)[0].value;
            const previousChar = lastHistory.charAt(cursor);

            charList.forEach((char) => {
                // delete char
                if (previousChar == char.open && charAfter == char.close) {
                    this.removeText(cursor, cursor + 1);
                }
            });

        }

        this.valueLengthReminder = value.length;
    }

    valueFromComment() {
        const root = this.elementRoot;
        const what = NodeFilter.SHOW_COMMENT;
        const iterator = document.createNodeIterator(root, what);
        const comment = iterator.nextNode();

        if (comment != null) {
            return comment.nodeValue.replace(/\r?\n/, "");
        }

        return "";
    }

    recordHistory(meta = {}) {
        if (meta.cursor == undefined) {
            meta.cursor = this.getCursor();
        }

        if (meta.value == undefined) {
            meta.value = this.getValue();
        }

        this.history.record(meta.cursor, meta.value);
    }

    optionsValidator(options) {
        Object.entries(options).forEach((option) => {
            const [key, value] = option;

            if (!this.options.hasOwnProperty(key)) {
                throw Error(`Invalid Iblize option! unknown option {${key}}`);
            }

            const valueType = typeof this.options[key];

            if (typeof value != valueType) {
                throw Error(`Invalid Iblize option! {${key}} value must be a ${valueType}`);
            }
        });
    }

    loadLanguage() {
        const name = this.options.language;
        const path = this.options.languagesPath;
        const callback = this.highlightSyntax;
        this.loader.loadLanguage(name, path, callback.bind(this));
    }

    loadTheme() {
        const name = this.options.theme;
        const path = this.options.themesPath;
        this.loader.loadTheme(name, path);
    }

    // Editor Event

    onUpdate(callback) {
        if (typeof callback != "function") {
            throw Error("Invalid `onUpdate()` callback parameter! callback must be a function.");
        }

        this.onUpdateCallback = callback;
    }

    // Editor Public API

    getValue(from = null, to = null) {
        const value = this.elementTextarea.value;

        if (from != null && to != null) {
            return value.substring(from, to);
        }

        if (from != null && to == null) {
            return value.substring(from);
        }
        
        return value;
    }

    setValue(value, recordHistory = true) {
        if (value != null) {
            this.elementTextarea.value = value;
        } else {
            this.elementTextarea.value = this.valueFromComment();
        }

        this.updateEditor();
        if (recordHistory) this.recordHistory();
    }

    getOptions() {
        return this.options;
    }

    setOptions(options) {
        // run options validator
        this.optionsValidator(options);

        // assign new options
        Object.assign(this.options, options);

        // update element
        if (options.theme != undefined || options.themesPath != undefined) {
            this.elementWrapper.className = `iblize ${this.options.theme}`;
            this.loadTheme();
        }

        if (options.language != undefined || options.languagesPath != undefined) {
            this.loadLanguage();
        }

        if (options.readOnly != undefined) {
            this.elementTextarea.readOnly = this.options.readOnly;
        }

        if (options.lineNumber != undefined) {
            this.elementLinenumber.style.display = this.options.lineNumber ? "" : "none";
            this.countLinenumber();
        }
    }

    getSelection() {
        const {
            selectionStart: start,
            selectionEnd: end,
            selectionDirection: dir
        } = this.elementTextarea;

        return { start, end, dir };
    }

    setSelection(start, end, dir = "none") {
        this.elementTextarea.setSelectionRange(start, end, dir);
    }

    getCursor() {
        return this.getSelection().start;
    }

    setCursor(pos) {
        this.setSelection(pos, pos);
    }

    getActiveLine() {
        const cursor = this.getCursor();
        const value = this.getValue(0, cursor);
        return value.split("\n").length;
    }

    getTotalLine() {
        const value = this.getValue();
        return value.split("\n").length;
    }

    getLineValue(line) {
        const value = this.getValue();
        return value.split("\n")[line - 1];
    }

    insertTab() {
        const cursor = this.getCursor();
        const tabSize = this.options.tabSize;

        this.insertText(cursor, " ".repeat(tabSize), {
            recordHistory: "both"
        });
    }

    insertText(from, text, options = {}) {
        const valueBefore =  this.getValue(0, from);
        const valueAfter =  this.getValue(from);

        let record = options.recordHistory || "after";
        let cursor = options.moveCursor || from + text.length;

        if (record == "before" || record == "both") {
            this.recordHistory();
        }

        this.setValue(valueBefore + text + valueAfter, false);
        this.setCursor(cursor); 

        if (record == "after" || record == "both") {
            this.recordHistory();
        }
    }

    removeText(from, to, options = {}) {
        const valueBefore = this.getValue(0, from);
        const valueAfter = this.getValue(to);

        let record = options.recordHistory || "after";
        let cursor = options.moveCursor || from;

        if (record == "before" || record == "both") {
            this.recordHistory();
        }

        this.setValue(valueBefore + valueAfter, false);
        this.setCursor(cursor)

        if (record == "after" || record == "both") {
            this.recordHistory();
        }
    }

    undo() {
        this.history.undo();
    }

    redo() {
        this.history.redo();
    }
}

export default Iblize;