import Dom from "./utils/dom.js";
import History from "./utils/history.js";

class Iblize {
    constructor(selector = "", options = {}) {
        this.history = new History(this);

        try {
            this.elementRoot = document.querySelector(selector);
            if (this.elementRoot == null) throw Error();
        } catch {
            throw Error("Iblize : can't find your editor container!");
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
        this._setupEditor();
        this.setOptions(options);
    }

    // Setup Editor

    _setupEditor() {
        this._createEditorElement();
        this._attachTextareaEvent();
    }

    _createEditorElement() {
        this.elementWrapper = Dom.create(this.elementRoot, {
            type: "div",
            attr: { class: "iblize" }
        });

        this.elementLinenumber = Dom.create(this.elementWrapper, {
            type: "div",
            attr: { class: "iblize_linenumber" }
        });

        this.elementContent = Dom.create(this.elementWrapper, {
            type: "div",
            attr: { class: "iblize_content" }
        });

        this.elementPre = Dom.create(this.elementContent, {
            type: "pre",
            attr: { class: "iblize_pre" }
        });

        this.elementCode = Dom.create(this.elementPre, {
            type: "code",
            attr: { class: "iblize_code" }
        });

        this.elementTextarea = Dom.create(this.elementContent, {
            type: "textarea",
            attr: {
                class: "iblize_textarea",
                spellcheck: "false",
                autocorrect: "off",
                autocomplete: "off",
                autocapitalize: "off"
            }
        });
    }

    _attachTextareaEvent() {
        Dom.addEvent(this.elementTextarea, [
            {
                name: "input",
                callback: this._handleInput.bind(this)
            },
            {
                name: "keydown",
                callback: this._handleKeydown.bind(this)
            },
            {
                name: "scroll",
                callback: this._handleScroll.bind(this)
            }
        ]);
    }

    // Textarea Event Handler

    _handleScroll() {
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

    _handleInput() {
        if (this.typingTimeout != undefined) {
            clearTimeout(this.typingTimeout);
        }
      
        this.typingTimeout = setTimeout(() => {
            this._recordHistory();
        }, 150);

        if (this.onUpdateCallback != undefined) {
            // run on update callback if exist
            this.onUpdateCallback(this.getValue());
        }

        this._closeCharacter();
        this._updateEditor();
    }

    _handleKeydown(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            this._addLineIndent();
        }

        if (event.keyCode == 9) {
            event.preventDefault();
            this._insertTab();
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

    _updateEditor() {
        this._linenumberCounter();
        this._syntaxHighlighter();
    }

    _linenumberCounter() {
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

    _syntaxHighlighter() { 
        // NOTE: need optimization. only update the highlight on the currently active line.
        // i dont know why chrome very slow on manjaro linux

        const editorValue = this.getValue();

        const language = this.options.language;
        const grammar = Prism.languages[language];

        const highlightedValue = Prism.highlight(editorValue, grammar, language);
        this.elementCode.innerHTML = highlightedValue;
    }

    _insertTab() {
        const currCursor = this._getCursor();
        const tabSize = this.options.tabSize;

        // record current changes before tab is inserted
        // to get the right cursor position when undo
        this._recordHistory();

        this._insertText(currCursor, " ".repeat(tabSize));
        this._setCursor(currCursor + tabSize);
        
        this._recordHistory();
    }

    _addLineIndent() {
        const currCursor = this._getCursor();
        const editorValue = this.getValue();

        // get indent length from current active line
        const currLineValue = this._getLineValue(this._getActiveLine());
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
            this._recordHistory();

            this._insertText(currCursor, string);
            this._setCursor(currCursor + indent + tabSize + 1);

            this._recordHistory();

        } else {

            // record current changes
            this._recordHistory();

            this._insertText(currCursor, "\n" + " ".repeat(indent));
            this._setCursor(currCursor + indent + 1);

            this._recordHistory();

        }
    }

    _closeCharacter() {
        const currCursor = this._getCursor();
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
                    this._removeText(currCursor, currCursor + 1);
                    this._setCursor(currCursor);
                    this._recordHistory();
                    return;
                }

                // closing char
                if (charBefore == char.open) {
                    this._insertText(currCursor, char.close, false);
                    this._setCursor(currCursor);
                    this._recordHistory();
                }
            });

        } else {

            // previous history before deleted
            const lastHistory = this.history.stack.slice(-1)[0].value;
            const previousChar = lastHistory.charAt(currCursor);

            charList.forEach((char) => {
                // delete char
                if (previousChar == char.open && charAfter == char.close) {
                    this._removeText(currCursor, currCursor + 1);
                    this._setCursor(currCursor);
                    this._recordHistory();
                }
            });

        }

        this.valueLengthReminder = editorValue.length;
    }

    _optionsValidator(options) {
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

    _getActiveLine() {
        const currCursor = this._getCursor();
        const editorValue = this.getValue().substring(0, currCursor);
        const activeLine = editorValue.split("\n").length;

        return activeLine;
    }

    _getLineValue(line) {
        const editorValue = this.getValue();
        return editorValue.split("\n")[line - 1];
    }

    _getCursor() {
        return this.elementTextarea.selectionStart;
    }

    _setCursor(pos) {
        this.elementTextarea.setSelectionRange(pos, pos);
    }

    _insertText(pos, value) {
        const editorValue = this.getValue();
        const valueBefore = editorValue.substring(0, pos);
        const valueAfter = editorValue.substring(pos);

        this.setValue(valueBefore + value + valueAfter);
    }

    _removeText(posStart, posEnd) {
        const editorValue = this.getValue();
        const valueBefore = editorValue.substring(0, posStart);
        const valueAfter = editorValue.substring(posEnd);

        this.setValue(valueBefore + valueAfter);
    }

    _recordHistory(meta = {}) {
        if (meta.cursor == undefined) {
            meta.cursor = this._getCursor();
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

    setValue(value) {
        this.elementTextarea.value = value;
        this._updateEditor();
    }

    getOptions() {
        return this.options;
    }

    setOptions(options) {
        // run options validator
        this._optionsValidator(options);

        // update elements
        const option = this.options;

        this.elementWrapper.setAttribute(
            "class",
            `iblize ${option.theme}`
        );

        this.elementLinenumber.style.display = option.lineNumber
            ? "inherit"
            : "none";

        if (option.readOnly) {
            this.elementTextarea.setAttribute("readonly", "");
        }

        this._updateEditor();
    }
}

export default Iblize;