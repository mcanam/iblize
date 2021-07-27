![preview](.assets/preview.png)

# IBLIZE

Simple Javascript Code Editor Library 

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

directly with CDN :

```html
<script src="https://unpkg.com/iblize/dist/iblize.js"></script>
```

or download manually from [here](https://github.com/mcanam/iblize/archive/refs/tags/v2.0.0.zip)

## Usage

create editor container

```html
<div id="editor"></div>
```

set editor width and height

``` css
#editor { width: 100%; height: 400px }
```

create initialitation

```js
const iblize = new Iblize("#editor", {
    // options
});
```

set editor value

``` js
iblize.setValue("console.log('Hello World')");
```

or directly from html (value must be wrapped with comment tag)

``` html
<div id="editor">
<!--
<h1>Hello World</h1>
-->
</div>
```

listening change

``` js
iblize.onChange((value) => {
  // do anything with value
});
```

## Options

### `language: String`

name of language to highlight. default is **"javascript"** 
[list of supported languages](https://prismjs.com/#supported-languages)

> By default Iblize will load the language modules from cdn
> but if you want to load locally, you can set `languagesPath` option bellow.

### `languagesPath: String`

path to **languages** folder. You can find the folder in the **dist** folder.

### `lineNumber: Boolean`
  
controls the display of line numbers. default is **true**

### `readOnly: Boolean` 

enable readonly mode. default is **false**

### `tabSize: Number` 

the number of spaces. default is **2** 

### `theme: String` 

theme name. default is **"iblize-dark"** 
[list of themes](./src/themes/README.md)

> Same with language, by default Iblize will load the themes from cdn.

### `themesPath: String` 

path to **themes** folder. You can find the folder in the **dist** folder.

## API Reference

### `getValue([from: Number, to: Number]) => String`

return editor value.

*from* and *to* parameter is **optional** it's just like a substring.

```js
/* example */

const editorValue = iblize.getValue();
const editorSubValue = iblize.getValue(0, 10);
```

### `setValue( value: String[, recordHistory: Boolean])`

set editor value.

___value___ parameter is a string to be displayed in the editor  
___recordHistory___ parameter is `optional` default is **true** it will record the value to history.

```js
/* example */

const code = "console.log('hello world')";

iblize.setValue(code);
```

### `getOptions() => Object`

return current editor options.

```js
/* example */

const options = iblize.getOptions();
  ```

### `setOptions( options: Object )`

update editor options.

```js
/* example */

iblize.setOptions({
    language: "html",
    lineNumber: false
    // etc
});
```

### `onUpdate( callback: Function )`

no description.

```js
/* example */

iblize.onUpdate((value) => {
    // do something
});
```

### `getSelection() => Object`

returns { start, end, dir }

```js
/* example */

const selection = iblize.getSelection();
```

### `setSelection(start: Number, end: Number[, dir: String])`

set selection

```js
/* example */

iblize.setSelection(0, 10);
```

### `getCursor() => Number`

returns current cursor position

```js
/* example */

const cursor = iblize.getCursor();
```

### `setCursor(pos: Number)`

set cursor position

```js
/* example */

iblize.setCursor(20);
```

### `getActiveLine() => Number`

return current active line

```js
/* example */

const activeLine = iblize.getActiveLine();
```

### `getTotalLine() => Number`

get total lines

```js
/* example */

const totalLines = iblize.getTotalLine();
```

### `getLineValue(line: Number) => String`

get value from specific line

```js
/* example */

const lineValue = iblize.getLineValue(5);
```

### `insertTab()`

no description.

```js
/* example */

iblize.inserTab();
```

### `insertText(from: Number, text: String [, options: Object])`

no description.

___from___ parameter is start position to insert text.  
___text___ paramter is the text to be inserted.  
___options___ paramter is `optional` containing :
- recordHistory: **"before"** | **"after"** | **"both"** | **"none"**
- moveCursor: cursor position after text is inserted

```js
/* example */

iblize.inserText(5, "what");
```

### `removeText(from: Number, to: Number [, options: Object])`

no description.

___from___ parameter is start position to remove text.  
___to___ parameter is end position to remove text.  
___options___ paramter is `optional` containing :
- recordHistory: **"before"** | **"after"** | **"both"** | **"none"**
- moveCursor: cursor position after text is removed

```js
/* example */

iblize.removeText(5, 6);
```

### `undo()`

no description.

```js
/* example */

iblize.undo();
```

### `redo()`

no description.

```js
/* example */

iblize.redo();
```

## Dependency

[PrismJs](prismjs.com) - iblize core syntax highlighter

## Browser Compatibility

tested on latest version of major browser

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
