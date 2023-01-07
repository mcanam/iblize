import style from "../utils/style.js";

export default class Highlight extends HTMLPreElement {
      constructor(editor) {
            super();
            this.editor = editor;

            this.classList.add('iblize-highlight');

            style('.iblize-highlight', {
                  position: 'absolute',
                  top: 0, left: 0,
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  padding: 0, 
                  margin: '0 !important',
                  pointerEvents: 'none !important',
                  fontFamily: 'inherit !important',
                  fontSize: 'inherit !important',
                  lineHeight: 'inherit !important',
                  whiteSpace: 'pre !important',
                  overflow: 'hidden !important',
            });
            
            // append component to editor container
            this.editor.$container.append(this);
      }

      update(value) {
            const code = document.createElement('code');
            code.innerHTML = window.Prism.highlight(value, window.Prism.languages.javascript);

            this.innerHTML = '';
            // window.requestAnimationFrame(() => this.appendChild(code));
            this.appendChild(code);
      }
}

customElements.define('iblize-highlight', Highlight, { extends: 'pre' });
