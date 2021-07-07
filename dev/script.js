import Iblize from "../src/iblize.js";

const iblize = new Iblize("#myEditor", {
    language: "javascript",
    lineNumber: true,
    readOnly: false,
    tabSize: 2,
    theme: "iblize-light"
});

iblize.setValue(
`import Iblize from "iblize";

const iblize = new Iblize("#editor", {
  language: "javascript",
  lineNumber: true,
  readOnly: false,
  tabSize: 2,
  theme: "iblize-dark"
});`
);