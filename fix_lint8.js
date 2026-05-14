const fs = require('fs');

let file = 'xpress-app/src/Contexts/NetworkStatusContext.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/catch \(\) \{/, 'catch (_e) {');
fs.writeFileSync(file, content);

file = 'xpress-app/tailwind.config.js';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import forms from '@tailwindcss\/forms'/, "require('@tailwindcss/forms')");
content = content.replace(/import typography from '@tailwindcss\/typography'/, "require('@tailwindcss/typography')");
fs.writeFileSync(file, content);
