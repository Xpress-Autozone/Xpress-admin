const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /<ShieldAlert className="w-4 h-4 text-red-500" \/> Reset Password/, replace: '<ShieldAlert className="w-4 h-4 text-red-500" /> Reset Pass' },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /<ShieldAlert className="w-4 h-4 text-red-500" \/> Reset Password/, replace: '<ShieldAlert className="w-4 h-4 text-red-500" /> Block User' },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /<ShieldAlert className="w-4 h-4 text-red-500" \/> Reset Pass/, replace: '<ShieldAlert className="w-4 h-4 text-red-500" /> Reset Password' }
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
