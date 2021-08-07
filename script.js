"use strict";

loadJSON("https://raw.githubusercontent.com/mcanam/iblize/master/package.json").then(data => {
    const script = document.createElement("script");
    script.src = `https://unpkg.com/iblize@${data.version}/dist/iblize.js`;
    script.addEventListener("load", startDemo);
    document.body.appendChild(script);
});

function startDemo() {
    const iblize = new Iblize("#iblize", { lineNumber: false });
    const settingMenu = dropdown("#setting-menu");
    
    iblize.setValue(SAMPLE_CODE["js"]);
    
    loadJSON("https://raw.githubusercontent.com/mcanam/iblize/master/themes/themes.json").then(data => {
        if (data == null) return;
        const menuThemes = selectMenu("#menu-theme", data);
        menuThemes.addEventListener("change", () => {
            iblize.setOptions({ theme: menuThemes.value });
        });
    });
    
    const menuLang = selectMenu("#menu-language", Object.keys(SAMPLE_CODE));
    menuLang.addEventListener("change", () => {
        iblize.setOptions({ language: menuLang.value });
        iblize.setValue(SAMPLE_CODE[menuLang.value]);
    });
    
    const menuTabsize = selectMenu("#menu-tabsize", [2, 4, 6, 8, 10]);
    menuTabsize.addEventListener("change", () => {
        iblize.setOptions({ tabSize: menuTabsize.value });
    });
    
    const menuLineNumber = document.querySelector("#menu-linenumber");
    menuLineNumber.addEventListener("change", () => {
        iblize.setOptions({ lineNumber: menuLineNumber.checked });
    });
    
    const menuReadOnly = document.querySelector("#menu-readonly");
    menuReadOnly.addEventListener("change", () => {
        iblize.setOptions({ readOnly: menuReadOnly.checked });
    });
    
    const shareBtn = document.querySelector("#share-btn");
    shareBtn.addEventListener("click", async () => {
        if (navigator.share == undefined) return;
        await navigator.share({
            title: "IBLIZE",
            text: "Iblize - Simple Javascript Code Editor Library",
            url: "https://github.com/mcanam/iblize"
        });
    });
}