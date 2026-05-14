const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/orderSlice.js', search: /\/\/ TODO: Implement email notifications for admins here/, replace: '' }
  ];

  for (const issue of issues) {
    if (fs.existsSync(issue.file)) {
      let content = fs.readFileSync(issue.file, 'utf8');
      content = content.replace(issue.search, issue.replace);
      fs.writeFileSync(issue.file, content);
    }
  }
}

fixEslint();
