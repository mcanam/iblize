# IBLIZE

simple javascript code editor library 

## Features

-   auto closing bracket and quote
-   auto add new line indent
-   support undo and redo function
-   support mobile browser

[Live Demo Here](https://mcanam.github.io/iblize/)

## Instalation

install via NPM :

```bash
npm install iblize --save
```

or directly with CDN :

```html
<link rel="stylesheet" href="https://unpkg.com/iblize/dist/iblize.css" />
<script src="https://unpkg.com/iblize/dist/iblize.js"></script>
```

## Usage

create editor container

```html
<div id="editor"></div>
```

create initialitation

```js
// import Iblize
import Iblize from "iblize";
// import Iblize themes
import "iblize/dist/iblize.css";

const iblize = new Iblize("#editor", {
    // options
});
```

## Options

- #### `language: String`

  name of language to highlight. default is **"js"** 
  <br>
  [list of supported languages](https://prismjs.com/#supported-languages)

- #### `lineNumber: Boolean`
  
  controls the display of line numbers. default is **true**

- #### `readOnly: Boolean` 

  enable readonly mode. default is **false**

- #### `tabSize: Number` 

  the number of spaces. default is **2** 

- #### `theme: String` 

  theme name. default is **"iblize-dark"** 
  [list of themes](./src/themes/README.md)

## API Reference

- #### `getValue() => String`

  return editor value.

  ```js
  /* example */

  const editorValue = iblize.getValue();
  ```

- #### `setValue( value: String, record: Boolean)`

  set editor value.

  *value* parameter is a string to be displayed in the editor
  <br>
  *record* parameter is `optional` default is **true** it will record the value to history.

  ```js
  /* example */

  const code = "console.log('hello world')";

  iblize.setValue(code);
  ```

- #### `getOptions() => Object`

  return current editor options.

  ```js
  /* example */

  const options = iblize.getOptions();
  ```

- #### `setOptions( options: Object )`

  update editor options.

  ```js
  /* example */

  iblize.setOptions({
      language: "html",
      lineNumber: false
      // etc
  });
  ```

- #### `onUpdate( callback: Function )`

  no description.

  ```js
  /* example */

  iblize.onUpdate((value) => {
      // do something
      console.log(value);
  });
  ```

## Dependency

[PrismJs](prismjs.com) - iblize core syntax highlighter

## Browser Compatibility

tested on latest version of major browser

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
