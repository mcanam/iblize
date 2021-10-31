const dom = {
    select: function (selector) {
          return document.querySelector(selector);
    },

    selectAll: function (selector) {
          return document.querySelectorAll(selector);
    },

    create: function (name, props) {
          const element = document.createElement(name),
                propEntries = Object.entries(props),
                propsLength = propEntries.length;

          if (propsLength == 0) return element;

          propEntries.forEach(([key, value]) => {
                if (key == "parent") {
                      return value.appendChild(element);
                }

                if (key == "attr") {
                      return this.setAttr(element, value);
                }

                if (key == "event") {
                      return this.addEvent(element, value);
                }

                if (key == "style") {
                      return this.addStyle(element, value);
                }

                element[key] = value;
          });

          return element;
    },

    setAttr: function(target, attrMap) {
          const attrEntries = Object.entries(attrMap);

          attrEntries.forEach(([key, value]) => {
                target.setAttribute(key, value);
          });

          return this;
    },

    addEvent: function (target, eventMap) {
          const isArray = Array.isArray(eventMap);

          // if not array wrap it into array
          let eventArr = isArray ? eventMap : [eventMap];

          eventArr.forEach(({ name, callback }) => {
                target.addEventListener(name, callback, false);
          });

          return this;
    },

    addStyle: function(target, styleMap) {
          const styleEntries = Object.entries(styleMap);

          styleEntries.forEach(([key, value]) => {
                target.style[key] = value;
          });

          return this;
    }
};

export default dom;
