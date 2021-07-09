![](.assets/preview.png)

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

OR

directly with CDN :

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
// import library
import Iblize from "iblize";

// import style
import "iblize/dist/iblize.css";

// create initialitation
const iblize = new Iblize("#editor", {
    // options
    language: "javascript",
    lineNumber: true,
    readOnly: false,
    tabSize: 2,
    theme: "iblize-dark"
});
```

## Options

-   **`language: String`** name of language to highlight. default is **"javascript"** [
    list of supported languages](https://prismjs.com/#supported-languages)
-   **`lineNumber: Boolean`** controls the display of line numbers. default is **true**
-   **`readOnly: Boolean`** enable readonly mode. default is **false**
-   **`tabSize: Number`** the number of spaces. default is **2**
-   **`theme: String`** theme name. default is **"iblize-dark"** [theme list](./src/themes/README.md)

## Styling

basic styling

```css
/* EXAMPLE */

#editor {
    font-family: "Fira Code", monospace;
    width: 100%;
    height: 300px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
```

advance styling

```css
/* EXAMPLE */

#editor > .iblize.iblize_dark .iblize_linenumber {
    border-right: 1px solid red; 
}

✨ be creative ✨
```

or you can make your own theme

tutorial ( in progress )

## API Reference

#### `getValue() => String`

return editor value

```js
/* EXAMPLE */

const editorValue = iblize.getValue();
```

#### `setValue( value: String, record: Boolean)`

set editor value

-   value parameter is a string to be displayed in the editor
-   record parameter is `optional` default is **true** it will record the value to history.

```js
/* EXAMPLE */

const code = "console.log('hello world')";

iblize.setValue(code);
```

#### `getOptions() => Object`

return current editor options

```js
/* EXAMPLE */

const options = iblize.getOptions();
```

#### `setOptions( options: Object )`

update editor options

-   no description

```js
/* EXAMPLE */

iblize.setOptions({
    language: "html",
    lineNumber: false
    // etc
});
```

#### `onUpdate( callback: Function )`

-   no description

```js
/* EXAMPLE */

iblize.onUpdate((value) => {
    // do something
    console.log(value);
});
```

## Dependency

Iblize using [PrismJs](prismjs.com) as a core syntax highlighter

## Browser Compatibility

tested on latest version of major browser

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
