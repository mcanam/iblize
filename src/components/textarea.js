import style from "../utils/style.js";

export default class Textarea extends HTMLTextAreaElement {
      constructor(editor) {
            super();
            this.editor = editor;

            this.classList.add('iblize-textarea');
            this.setAttribute('spellcheck', '');

            style('.iblize-textarea', {
                  position: 'absolute',
                  top: 0, left: 0,
                  zIndex: 2,
                  width: '100%',
                  height: '100%',
                  padding: 0, 
                  margin: 0,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  color: 'transparent !important',
                  caretColor: 'blue',
                  fontFamily: 'inherit !important',
                  fontSize: 'inherit !important',
                  lineHeight: 'inherit !important',
                  whiteSpace: 'pre !important',
                  overflow: 'hidden !important',
                  backgroundColor: 'transparent !important'
            });

            this.addEventListener('input', this.handleInput.bind(this));

            // append component to editor container
            this.editor.$container.append(this);
      }

      handleInput() {
            const value = this.value;
            this.editor.$highlight.update(value);
      }
}

customElements.define('iblize-textarea', Textarea, { extends: 'textarea' });
