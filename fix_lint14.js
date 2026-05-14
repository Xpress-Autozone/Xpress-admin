const fs = require('fs');
let file = 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<ShieldAlert className="w-4 h-4 text-red-500" \/> Reset Password/g, function (match, offset, original) {
    if (original.indexOf(match) === offset) {
        return '<ShieldAlert className="w-4 h-4 text-red-500" /> Block User';
    }
    return match;
});
fs.writeFileSync(file, content);

file = 'xpress-app/src/orderSlice.js';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\/\/ TODO: Implement email notifications for admins here/g, '');
fs.writeFileSync(file, content);
