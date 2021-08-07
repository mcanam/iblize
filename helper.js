// sample code
const SAMPLE_CODE = {
  js: 
`const iblize = new Iblize("#my_editor", {
  language: "javascript",
  lineNumber: false,
  readOnly: false,
  tabSize: 2,
  theme: "iblize-light"
});`,

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
};

// simple dropdown by me
function dropdown(selector) {
    const root = document.querySelector(selector);
    const head = root.querySelector(".dropdown-head");
    const body = root.querySelector(".dropdown-body");

    head.addEventListener("click", event => {
        head.classList.toggle("active");
        body.classList.toggle("active");
    });

    window.addEventListener("click", event => {
        if (event.target.closest(".dropdown") != null) return;
        head.classList.remove("active");
        body.classList.remove("active");
    });
    
    return root;
}

// simple custom select menu by me
function selectMenu(selector, items) {
    const root = document.querySelector(selector);
    const head = root.querySelector(".select-head");
    const body = root.querySelector(".select-body");

    items.forEach(data => {
        const item = document.createElement("div");
        item.className = "select-item";
        item.innerText = data;
        item.addEventListener("click", event => {
            root.value = data;
            head.innerText = data;
            root.dispatchEvent(new CustomEvent("change"));
        });

        body.appendChild(item);
    });

    root.value = items[0];
    head.innerText = items[0];
    head.addEventListener("click", event => {
        head.classList.toggle("active");
        body.classList.toggle("active");
    });

    window.addEventListener("click", event => {
        if (event.target == head) return;
        head.classList.remove("active");
        body.classList.remove("active");
    });
    
    return root;
}

// what is this?
async function loadJSON(url) {
    const resp = await fetch(url);

    if (resp.ok == true) {
        const text = await resp.json();
        return text;
    } else { return null; }
}
