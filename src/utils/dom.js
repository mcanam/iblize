class Dom {
    static select(selector) {
        const element = document.querySelector(selector);
        return element;
    }

    static selectAll(selector) {
        const elements = document.querySelectorAll(selector);
        return elements;
    }

    static create(tagName, props) {
        const element = document.createElement(tagName);

        Object.entries(props).forEach(([prop, value]) => {
            if (prop == "attr") {
                return this.setAttr(element, value);
            }

            if (prop == "style") {
                return this.addStyle(element, value);
            }

            if (prop == "event") {
                return this.addEvent(element, value);
            }

            if (prop == "parent") {
                return value.appendChild(element);
            }

            element[prop] = value;
        });

        return element;
    }

    static setAttr(target, attrMap) {
        Object.entries(attrMap).forEach(([key, value]) => {
            target.setAttribute(key, value);
        });

        return this;
    }

    static addStyle(target, styleMap) {
        Object.entries(styleMap).forEach(([key, value]) => {
            target.style[key] = value;
        });

        return this;
    }

    static addEvent(target, eventMap) {
        if (!Array.isArray(eventMap)) eventMap = [eventMap];

        eventMap.forEach(({ name, callback }) => {
            target.addEventListener(name, callback);
        });

        return this;
    }
}

export default Dom;
