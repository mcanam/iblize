class Dom {
    static create(parent, { type, attr, style }) {
        const element = document.createElement(type);

        if (attr != undefined) {
            this.setAttr(element, attr);
        }

        if (style != undefined) {
            this.addStyle(element, style);
        }
        
        parent.appendChild(element);
        return element;
    }

    static setAttr(target, attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            target.setAttribute(key, value);
        }
    }

    static addStyle(target, styles) {
        for (const [key, value] of Object.entries(styles)) {
            target.style[key] = value;
        }
    }

    static addEvent(target, events) {
        events.forEach(({ name, callback }) => {
            target.addEventListener(name, callback, false);
        });
    }
}

export default Dom;