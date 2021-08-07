<p align="center">
  <img src="https://img.shields.io/npm/v/iblize?color=%237171F3&label=latest&style=for-the-badge" />
</p>

<br>

<p align="center">
  <img src=".assets/preview.png" />
</p>

<h3 align="center">IBLIZE - Simple Javascript Code Editor Library</h3>

<p align="center">
  <a href="https://mcanam.github.io/iblize/"><strong>View Demo »</strong></a>
  <br> <br>
  <a href="https://github.com/mcanam/iblize/issues">Report Bug</a>
  <span> - </span>
  <a href="https://github.com/mcanam/iblize/issues">Request Feature</a>
</p>

<br><br>

# Getting Started

### 1. Include Iblize on your project

you can directly use cdn

```html
<script src="https://unpkg.com/iblize/dist/iblize.js"></script>
```

or install from npm

``` bash
$ npm install iblize --save
```

or download manually from [here](https://github.com/mcanam/iblize/archive/refs/tags/v2.0.1.zip)

### 2. Create editor container

iblize needs a div container to hold all elements.

```html
<div id="editor"></div>
```

then set the container width and height. you can also use inline style.

``` css
#editor { width: 100%; height: 400px }
```

### 3. Create initialization

the first argument can be a string selector or an dom element

```js
// use selector
const iblize = new Iblize("#editor");

// use dom element
const iblize = new Iblize(document.querySelector("#editor"));
```

the second argument is options. [see all options](#options)

```js
const iblize = new Iblize("#editor", {
    language: "html",
    // etc
});
```

### 4. Set editor default value (optional)

you can set editor value programmatically with javascript

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

### 5. Listening change

listen when the editor value changes

``` js
iblize.onUpdate((value) => {
  // do anything with value
});
```

done 👌. if you find bug or if you have a cool idea please [tell me](https://github.com/mcanam/iblize/issues)  

[explore editor API](https://mcanam.gitbook.io/iblize-docs/api-reference)

# Option List

### language
  
- Type: `String`  
  
- Default: `"js"`

the name of language to highlight [list of supported languages](https://prismjs.com/#supported-languages)

> Iblize has some built-in language modules. markup ( html, xml ), css, javascript / js, and clike. By default if you use a language other than the built-in one, Iblize will automatically load the language modules from cdn. But dont worry, if you want to work offline or load the modules locally, you can set **languagesPath** option bellow.

### languagesPath
  
- Type: `String`  
  
- Default: `""`

path to **languages** folder. You can find the folder in the **dist** folder.

### lineNumber
  
- Type: `Boolean`  
  
- Default: `true`
  
controls the display of line numbers

### readOnly 
  
- Type: `Boolean`  
  
- Default: `false`

controls the readonly mode

### tabSize
  
- Type: `Number`  
  
- Default: `2`

the number of spaces

### theme 
  
- Type: `String`  
  
- Default: `"iblize-dark"`

the name of theme [themes list](themes/README.md)

> Same with language, by default Iblize will load the themes from cdn.

### themesPath 
  
- Type: `String`  
  
- Default: `""`

path to **themes** folder. You can find the folder in the **dist** folder.


# API Reference

documentation move [here](https://mcanam.gitbook.io/iblize-docs/api-reference)

# Dependency

[PrismJs](prismjs.com) - main iblize syntax highlighter

# Browser Compatibility

tested on latest version of major browser

<img width="500px" src=".assets/browser-support.png" />

# License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
