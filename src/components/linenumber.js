import style from "../utils/style.js";

export default class Linenumber extends HTMLDivElement {
      constructor(editor) {
            super();
            this.editor = editor;

            this.classList.add('iblize-linenumber');
            this.innerText = '1';

            style('.iblize-linenumber', {
                  position: 'sticky',
                  left: 0, zIndex: 3,
                  width: 'auto',
                  minHeight: '100%',
                  padding: '0 1em',
                  fontFamily: 'inherit !important',
                  fontSize: 'inherit !important',
                  lineHeight: 'inherit !important',
                  backgroundColor: 'grey'
            });
            
            // append component to editor container
            this.editor.$container.append(this);
      }
}

customElements.define('iblize-linenumber', Linenumber, { extends: 'div' });
