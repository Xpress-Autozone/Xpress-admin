const fs = require('fs');

let file = 'xpress-app/tailwind.config.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/,\n    ,\n/g, "");
fs.writeFileSync(file, content);
