const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /import React, \{ useState, useEffect \} from 'react';/, replace: "import React, { useState, useEffect, useCallback } from 'react';" },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /const fetchAdmins = async \(\) => \{/, replace: "const fetchAdmins = useCallback(async () => {" },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /  \};/, replace: "  }, [token]);" },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /\[fetchAdmins\]/, replace: "[fetchAdmins]" },

    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /import React, \{ useState \} from 'react';/, replace: "import React, { useState, useEffect, useCallback } from 'react';" },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /const fetchUsers = async \(\) => \{/, replace: "const fetchUsers = useCallback(async () => {" },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /  \};/, replace: "  }, [token]);" },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /\[fetchUsers\]/, replace: "[fetchUsers]" },

    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /import React, \{ useState, useEffect \} from 'react';/, replace: "import React, { useState, useEffect, useCallback } from 'react';" },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /const fetchCustomerOrders = async \(\) => \{/, replace: "const fetchCustomerOrders = useCallback(async () => {" },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /  \};/, replace: "  }, [customer?.uid, token]);" },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /\[customer, isOpen, fetchCustomerOrders\]/, replace: "[customer, isOpen, fetchCustomerOrders]" },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /\[customer, isOpen\]/, replace: "[customer, isOpen, fetchCustomerOrders]" },
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
