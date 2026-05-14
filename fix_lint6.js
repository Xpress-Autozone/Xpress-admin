const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/Components/NetworkStatus/NetworkStatusBanner.jsx', search: /const \{ isFullyConnected \} = useNetworkStatus\(\);/, replace: '' },
    { file: 'xpress-app/src/Components/NetworkStatus/OfflinePage.jsx', search: /import React, \{ useEffect \} from 'react';/, replace: "import React from 'react';" },
    { file: 'xpress-app/src/Components/NetworkStatus/OfflinePage.jsx', search: /const \{ isServerDown \} = useNetworkStatus\(\);/, replace: '' },
    { file: 'xpress-app/src/Contexts/NetworkStatusContext.jsx', search: /} catch \(error\) {/, replace: '} catch (e) {' },
    { file: 'xpress-app/src/Contexts/NetworkStatusContext.jsx', search: /} catch \(err\) {/, replace: '} catch (e) {' },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /import \{ useNavigate \} from 'react-router-dom';/, replace: '' },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /const navigate = useNavigate\(\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/AllProducts.jsx', search: /import React, \{ useState, useEffect \} from 'react';/, replace: "import React, { useEffect } from 'react';" },
    { file: 'xpress-app/src/Pages/Products/editProduct.jsx', search: /const \{ token \} = useSelector\(\(state\) => state\.auth\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/editProduct.jsx', search: /const \{ items \} = useSelector\(\(state\) => state\.vendors\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/product.jsx', search: /const vendorId = formData\.get\('vendorId'\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/OrderDetailModal.jsx', search: /const \[selectedStatus, setSelectedStatus\] = useState\(order\?\.orderStatus \|\| order\?\.status \|\| 'pending'\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/Orders.jsx', search: /const shouldFetch = status === 'idle' \|\| \(lastFetched && Date\.now\(\) - lastFetched > 5 \* 60 \* 1000\);/, replace: '' },
    { file: 'xpress-app/tailwind.config.js', search: /require\('@tailwindcss\/forms'\)/, replace: "import forms from '@tailwindcss/forms'" },
    { file: 'xpress-app/tailwind.config.js', search: /require\('@tailwindcss\/typography'\)/, replace: "import typography from '@tailwindcss/typography'" },
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
