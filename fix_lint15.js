const fs = require('fs');
let file = 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<ShieldAlert className="w-4 h-4 text-red-500" \/> Block User/g, function (match, offset, original) {
    if (original.indexOf(match) === offset) {
        return '<ShieldAlert className="w-4 h-4 text-red-500" /> Reset Password';
    }
    return match;
});
fs.writeFileSync(file, content);
