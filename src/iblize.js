import Textarea from "./components/textarea.js";
import Linenumber from './components/linenumber.js';
import Highlight from "./components/highlight.js";
import style from "./utils/style.js";

export default class Iblize {
      constructor(container, config = {}) {
            this.$container = null;

            if (typeof container == 'string') {
                  this.$container = document.querySelector(container);
            }

            if (!(this.$container instanceof HTMLElement)) {
                  throw Error(`[Iblize] Unable to find the editor container element "${container}".`);
            }

            this.$container.classList.add('iblize');

            style('.iblize', {
                  position: 'relative',
                  width: '100%',
                  minHeight: '300px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  display: 'flex',
                  overflow: 'auto'
            });

            // custom components
            this.$highlight = new Highlight(this);
            this.$linenumber = new Linenumber(this);
            this.$textarea = new Textarea(this);
      }
}
