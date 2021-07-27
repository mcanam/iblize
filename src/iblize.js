import "./iblize.scss";

import Prism from "prismjs";
import Dom from "./utils/dom";
import History from "./utils/history";

class Iblize {
    constructor(container = "", options = {}) {
        this.history = new History(this);

        if (container instanceof HTMLElement) {
            this.elementRoot = container;
        } else {
            this.elementRoot = Dom.select(container);
        }

        if (!this.elementRoot) {
            throw Error("Iblize can't find the editor containers");
        }

        // default options
        this.options = {
            language: "javascript",
            lineNumber: true,
            readOnly: false,
            tabSize: 2,
            theme: "iblize-dark"
        };

        // prepare the editor
        this.setupEditor();
        this.setOptions(options);
    }

    // Setup Editor

    setupEditor() {
        this.createEditorElement();
        this.attachTextareaEvent();
    }

    createEditorElement() {
        this.elementWrapper = Dom.create("div", {
            parent: this.elementRoot,
            className: "iblize"
        });

        this.elementLinenumber = Dom.create("div", {
            parent: this.elementWrapper,
            className: "iblize_linenumber"
        });

        this.elementContent = Dom.create("div", {
            parent: this.elementWrapper,
            className: "iblize_content"
        });

        this.elementPre = Dom.create("pre", {
            parent: this.elementContent,
            className: "iblize_pre"
        });

        this.elementCode = Dom.create("code", {
            parent: this.elementPre,
            className: "iblize_code"
        });

        this.elementTextarea = Dom.create("textarea", {
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
        Dom.addEvent(this.elementTextarea, [
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

        Dom.addStyle(this.elementLinenumber, {
            height: height + "px",
            transform: `translateY(${top * -1}px)`
        });

        Dom.addStyle(this.elementPre, {
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
        if (event.keyCode == 13) {
            event.preventDefault();
            this.addLineIndent();
        }

        if (event.keyCode == 9) {
            event.preventDefault();
            this.insertTab();
        }

        if (event.ctrlKey && event.key == "z") {
            event.preventDefault();
            this.history.undo();
        }

        if (event.ctrlKey && event.shiftKey && event.key == "Z") {
            event.preventDefault();
            this.history.redo();
        }
    }

    // Editor Internal Method

    updateEditor() {
        this.countLinenumber();
        this.highlightSyntax();
    }

    countLinenumber() {
        const totalLines = this.getValue().split("\n").length;
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
        const editorValue = this.getValue();

        const language = this.options.language;
        const grammar = Prism.languages[language];

        const highlightedValue = Prism.highlight(editorValue, grammar, language);
        this.elementCode.innerHTML = highlightedValue;
    }

    insertTab() {
        const currCursor = this.getCursor();
        const tabSize = this.options.tabSize;

        // record current changes before tab is inserted
        // to get the right cursor position when undo
        this.recordHistory();
        this.insertText(currCursor, " ".repeat(tabSize));
        this.setCursor(currCursor + tabSize);
        this.recordHistory();
    }

    addLineIndent() {
        const currCursor = this.getCursor();
        const editorValue = this.getValue();

        // get indent length from current active line
        const currLineValue = this.getLineValue(this.getActiveLine());
        const currLineIndent = currLineValue.match(/^\s{1,}/);

        // get the characters from before and after cursor
        const charBefore = editorValue.charAt(currCursor - 1);
        const charAfter = editorValue.charAt(currCursor);

        let indent = currLineIndent == null ? 0 : currLineIndent[0].length;

        if (
            (charBefore == "(" && charAfter == ")") ||
            (charBefore == "{" && charAfter == "}") ||
            (charBefore == "[" && charAfter == "]") ||
            (charBefore == ">" && charAfter == "<")
        ) {

            const tabSize = this.options.tabSize;

            const string = "\n" + " ".repeat(indent + tabSize) + 
                           "\n" + " ".repeat(indent);

            // record current changes
            this.recordHistory();
            this.insertText(currCursor, string);
            this.setCursor(currCursor + indent + tabSize + 1);
            this.recordHistory();

        } else {

            // record current changes
            this.recordHistory();
            this.insertText(currCursor, "\n" + " ".repeat(indent));
            this.setCursor(currCursor + indent + 1);
            this.recordHistory();

        }
    }

    closeCharacter() {
        const currCursor = this.getCursor();
        const editorValue = this.getValue();

        // get the characters from before and after cursor
        const charBefore = editorValue.charAt(currCursor - 1);
        const charAfter = editorValue.charAt(currCursor);

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

        if (editorValue.length > this.valueLengthReminder) {

            charList.forEach((char) => {
                // skip char
                if (charBefore == char.close && charAfter == char.close) {
                    this.removeText(currCursor, currCursor + 1);
                    this.setCursor(currCursor);
                    this.recordHistory();
                    return;
                }

                // closing char
                if (charBefore == char.open) {
                    this.insertText(currCursor, char.close);
                    this.setCursor(currCursor);
                    this.recordHistory();
                }
            });

        } else {

            // previous history before deleted
            const lastHistory = this.history.stack.slice(-1)[0].value;
            const previousChar = lastHistory.charAt(currCursor);

            charList.forEach((char) => {
                // delete char
                if (previousChar == char.open && charAfter == char.close) {
                    this.removeText(currCursor, currCursor + 1);
                    this.setCursor(currCursor);
                    this.recordHistory();
                }
            });

        }

        this.valueLengthReminder = editorValue.length;
    }

    optionsValidator(options) {
        Object.entries(options).forEach((option) => {
            const [key, value] = option;

            if (!this.options.hasOwnProperty(key)) {
                throw Error(`Iblize : invalid option! unknown option "${key}"`);
            }

            const valueType = typeof this.options[key];

            if (typeof value != valueType) {
                throw Error(`Iblize : invalid option! {${key}} value must be a ${valueType}`);
            }

            this.options[key] = value;
        });
    }

    // Editor Private API

    getActiveLine() {
        const currCursor = this.getCursor();
        const editorValue = this.getValue().substring(0, currCursor);
        const activeLine = editorValue.split("\n").length;

        return activeLine;
    }

    getLineValue(line) {
        const editorValue = this.getValue();
        return editorValue.split("\n")[line - 1];
    }

    getCursor() {
        return this.elementTextarea.selectionStart;
    }

    setCursor(pos) {
        this.elementTextarea.setSelectionRange(pos, pos);
    }

    insertText(pos, value) {
        const editorValue = this.getValue();
        const valueBefore = editorValue.substring(0, pos);
        const valueAfter = editorValue.substring(pos);

        this.setValue(valueBefore + value + valueAfter, false);
    }

    removeText(posStart, posEnd) {
        const editorValue = this.getValue();
        const valueBefore = editorValue.substring(0, posStart);
        const valueAfter = editorValue.substring(posEnd);

        this.setValue(valueBefore + valueAfter, false);
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

    // Editor Event

    onUpdate(callback) {
        if (typeof callback != "function") {
            throw Error("Iblize : invalid parameter! callback must be a function.");
        }

        this.onUpdateCallback = callback;
    }

    // Editor Public API

    getValue() {
        return this.elementTextarea.value;
    }

    setValue(value, record = true) {
        this.elementTextarea.value = value;
        this.updateEditor();

        if (record) this.recordHistory();
    }

    getOptions() {
        return this.options;
    }

    setOptions(options) {
        // run options validator
        this.optionsValidator(options);

        // update elements
        const option = this.options;

        this.elementWrapper.setAttribute(
            "class",
            `iblize ${option.theme}`
        );

        this.elementLinenumber.style.display = option.lineNumber
            ? "inherit"
            : "none";

        this.elementTextarea.readOnly = option.readOnly;

        this.updateEditor();
    }
}

export default Iblize;