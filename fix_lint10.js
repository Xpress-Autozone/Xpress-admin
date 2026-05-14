const fs = require('fs');

let file = 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\[customer, isOpen, fetchCustomerOrders\]/g, "[customer, isOpen]");
fs.writeFileSync(file, content);

file = 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\[fetchAdmins\]/g, "[]");
fs.writeFileSync(file, content);

file = 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\[fetchUsers\]/g, "[]");
fs.writeFileSync(file, content);

file = 'xpress-app/src/Pages/AdminRoles/AdminHistoryModal.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\[admin, isOpen, fetchLogs\]/g, "[admin, isOpen]");
fs.writeFileSync(file, content);

file = 'xpress-app/tailwind.config.js';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/plugins: \[\s*\]/g, "plugins: [\n    require('@tailwindcss/forms'),\n    require('@tailwindcss/typography'),\n  ]");
fs.writeFileSync(file, content);
