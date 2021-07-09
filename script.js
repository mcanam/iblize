"use strict";

const LANGUAGE_LIST = ["js", "html", "css"];
const TABSIZE_LIST = [2, 4, 6, 8, 10];
const THEME_LIST = ["iblize-light", "iblize-dark"];

const codeSample = {
    html: 
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="iblize.css">
    <title>iblize</title>
  </head>
  <body>
    <div id="my_editor"></div>
    <script src="iblize.js"></script>
  </body>
</html>`,
    css:
`#my_editor {
  font-family: "Fira Code";
  width: 100%;
  height: 300px;
}

.#my_editor > .iblize .iblize_linenumber,
.#my_editor > .iblize .iblize_pre,
.#my_editor > .iblize .iblize_textarea {
    padding: 10px 20px;
}`,
    js: 
`const iblize = new Iblize("#my_editor", {
  language: "javascript",
  lineNumber: false,
  readOnly: false,
  tabSize: 2,
  theme: "iblize-light"
});`
};

const iblize = new Iblize("#my_editor", {
    language: "javascript",
    lineNumber: false,
    readOnly: false,
    tabSize: 2,
    theme: "iblize-light"
});

iblize.setValue(codeSample.js);

const menu = document.querySelector(".menu");
const menuTrigger = menu.querySelector(".menu_trigger");
const menuContent = menu.querySelector(".menu_content");

menuContent.innerHTML = `
<div class="menu_item">
    <span>language</span>
    <select class="select" id="menuLanguage"></select>
</div>

<div class="menu_item">
    <span>linenumber</span>
    <input type="checkbox" class="switch" id="menuLinenumber">
</div>

<div class="menu_item">
    <span>readonly</span>
    <input type="checkbox" class="switch" id="menuReadOnly">
</div>

<div class="menu_item">
    <span>tab size</span>
    <select class="select" id="menuTabSize"></select>
</div>

<div class="menu_item">
    <span>theme</span>
    <select class="select" id="menuTheme"></select>
</div>`;

menuTrigger.addEventListener("click", () => {
    menuContent.classList.toggle("active");
    menuTrigger.classList.toggle("active");
});

menuLinenumber.addEventListener("click", event => {
    if (event.target.checked) {
        iblize.setOptions({ lineNumber: true });
    } else {
        iblize.setOptions({ lineNumber: false });
    }
});

menuReadOnly.addEventListener("click", event => {
    if (event.target.checked) {
        iblize.setOptions({ readOnly: true });
    } else {
        iblize.setOptions({ readOnly: false });
    }
});

generateOption(menuLanguage, LANGUAGE_LIST);
generateOption(menuTabSize, TABSIZE_LIST);
generateOption(menuTheme, THEME_LIST);

menuLanguage.addEventListener("change", event => {
    const language = event.target.value;
    iblize.setOptions({ language: language });
    iblize.setValue(codeSample[language]);
});

menuTabSize.addEventListener("change", event => {
    iblize.setOptions({ tabSize: parseInt(event.target.value) });
});

menuTheme.addEventListener("change", event => {
    iblize.setOptions({ theme: event.target.value });
});

function generateOption(target, options) {
    let html = "";

    options.forEach(option => {
        html += `<option value="${option}">${option}</option>`;
    });

    target.innerHTML = html;
}