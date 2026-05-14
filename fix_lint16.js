const fs = require('fs');

let file = 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/import React, \{ useState, useEffect, useCallback \} from 'react';/, "import React, { useState, useEffect } from 'react';");
content = content.replace(/const fetchAdmins = useCallback\(async \(\) => \{/g, "const fetchAdmins = async () => {");
content = content.replace(/  \}, \[token\]\);/g, "  };");
content = content.replace(/\[fetchAdmins\]/g, "[]");
fs.writeFileSync(file, content);

file = 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import React, \{ useState, useEffect, useCallback \} from 'react';/, "import React, { useState } from 'react';");
content = content.replace(/const fetchUsers = useCallback\(async \(\) => \{/g, "const fetchUsers = async () => {");
content = content.replace(/  \}, \[token\]\);/g, "  };");
content = content.replace(/\[fetchUsers\]/g, "[]");
fs.writeFileSync(file, content);

file = 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/import React, \{ useState, useEffect, useCallback \} from 'react';/, "import React, { useState, useEffect } from 'react';");
content = content.replace(/const fetchCustomerOrders = useCallback\(async \(\) => \{/g, "const fetchCustomerOrders = async () => {");
content = content.replace(/  \}, \[customer\?\.uid, token\]\);/g, "  };");
content = content.replace(/\[customer, isOpen, fetchCustomerOrders\]/g, "[customer, isOpen]");
fs.writeFileSync(file, content);
