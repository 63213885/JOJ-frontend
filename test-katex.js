const MarkdownIt = require("markdown-it");
const mk = require("markdown-it-katex");

const md = new MarkdownIt().use(mk);
console.log(md.render("Math: $E = mc^2$ and block: \n\n$$ a^2 + b^2 = c^2 $$"));
