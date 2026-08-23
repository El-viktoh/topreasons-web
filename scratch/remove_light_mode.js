const fs = require('fs');

const css = fs.readFileSync('app/globals.css', 'utf8');

const startDark = css.indexOf('.dark {');
const endDark = css.indexOf('}', startDark);
const darkVars = css.substring(startDark + 7, endDark).trim();

// replace the content of :root with darkVars
const startRoot = css.indexOf(':root {');
const endRoot = css.indexOf('}', startRoot);

const newRoot = `:root {\n    ${darkVars}\n  }`;

let newCss = css.substring(0, startRoot) + newRoot + css.substring(endRoot + 1);

// now remove the `.dark` block completely
const newStartDark = newCss.indexOf('.dark {');
if (newStartDark !== -1) {
    const newEndDark = newCss.indexOf('}', newStartDark);
    newCss = newCss.substring(0, newStartDark).trimEnd() + '\n' + newCss.substring(newEndDark + 1).trimStart();
}

fs.writeFileSync('app/globals.css', newCss);
console.log('Removed light mode completely!');
