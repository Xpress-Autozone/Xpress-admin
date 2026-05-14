const fs = require('fs');

function fixEslint() {
  let file = 'xpress-app/src/Pages/Dashboard/OverView/Overview.jsx';
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/\{\[...Array\(3\)\].map\(\(\_, idx\) => \(/g, '{[...Array(3)].map((_, i) => (');
      content = content.replace(/\{\[...Array\(5\)\].map\(\(\_, idx\) => \(/g, '{[...Array(5)].map((_, i) => (');
      content = content.replace(/key=\{idx\}/g, 'key={i}');
      fs.writeFileSync(file, content);
  }
}
fixEslint();
