class History {
    constructor(editor) {
        this.editor = editor;
        this.stack = [];
        this.level = 0;

        // fill the stack for the first time
        this.record(0, "");
    }

    record(cursor, value) {
        if (this.stack.length > 1000) {
            // limit stack size
            this.stack.shift();
        }

        const { stringify } = JSON;
        const lastHistory = this.stack.slice(-1)[0];
        const currHistory = { cursor, value };

        if (stringify(lastHistory) != stringify(currHistory)) {
            // avoid duplicated value
            this.stack.push(currHistory);
        }

        this.level = this.stack.length - 1;
    }

    undo() {
        if (this.level > 0) {
            this.level -= 1;
            this.restore();
        }
    }

    redo() {
        if (this.level < this.stack.length - 1) {
            this.level += 1;
            this.restore();
        }
    }

    restore() {
        const { cursor, value } = this.stack[this.level];
        this.editor.setValue(value, false);
        this.editor.setCursor(cursor);
    }
}

export default History;
