const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /import React, \{ useState, useEffect \} from 'react';/, replace: "import React, { useState, useEffect, useCallback } from 'react';" },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /\[fetchAdmins\]/g, replace: "[fetchAdmins]" },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /import React, \{ useState, useEffect \} from 'react';/, replace: "import React, { useState, useEffect, useCallback } from 'react';" },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /\[fetchUsers\]/g, replace: "[fetchUsers]" },
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
