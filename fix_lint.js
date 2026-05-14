const fs = require('fs');

function fixEslint() {
  const issues = [
    { file: 'xpress-app/src/Components/NetworkStatus/NetworkStatusBanner.jsx', search: /const \{ isFullyConnected \} = useNetworkStatus\(\);/, replace: '' },
    { file: 'xpress-app/src/Components/NetworkStatus/OfflinePage.jsx', search: /import React, \{ useEffect \} from 'react';/, replace: "import React from 'react';" },
    { file: 'xpress-app/src/Components/NetworkStatus/OfflinePage.jsx', search: /const \{ isServerDown \} = useNetworkStatus\(\);/, replace: '' },
    { file: 'xpress-app/src/Components/Ui/ProductList/productList.jsx', search: /onViewItem,/, replace: '' },
    { file: 'xpress-app/src/Components/Ui/VendorList/vendorList.jsx', search: /onViewItem,/, replace: '' },
    { file: 'xpress-app/src/Contexts/NetworkStatusContext.jsx', search: /} catch \(err\) {/, replace: '} catch (e) {' },
    { file: 'xpress-app/src/Contexts/authContext.jsx', search: /const navigate = useNavigate\(\);/, replace: '' },
    { file: 'xpress-app/src/Contexts/authContext.jsx', search: /import \{ useNavigate \} from 'react-router-dom';/, replace: '' },
    { file: 'xpress-app/src/DashBoardLayout/dashboardLayout.jsx', search: /import \{ useNotifications \} from '\.\.\/Contexts\/NotificationContext';/, replace: '' },
    { file: 'xpress-app/src/DashBoardLayout/dashboardLayout.jsx', search: /const \{ useNotifications \} = useNotifications\(\);/, replace: '' },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminHistoryModal.jsx', search: /  \}, \[admin, isOpen\]\);/, replace: '  }, [admin, isOpen, fetchLogs]);' },
    { file: 'xpress-app/src/Pages/AdminRoles/AdminRoles.jsx', search: /  \}, \[\]\);/, replace: '  }, [fetchUsers]);' },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /const navigate = useNavigate\(\);/, replace: '' },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /import \{ useNavigate \} from 'react-router-dom';/, replace: '' },
    { file: 'xpress-app/src/Pages/AdminRoles/SystemAdmins.jsx', search: /  \}, \[\]\);/, replace: '  }, [fetchAdmins]);' },
    { file: 'xpress-app/src/Pages/Dashboard/OverView/Overview.jsx', search: /\{\[...Array\(3\)\].map\(\(\_, i\) => \(/, replace: '{[...Array(3)].map((_, idx) => (' },
    { file: 'xpress-app/src/Pages/Dashboard/OverView/Overview.jsx', search: /\{\[...Array\(5\)\].map\(\(\_, i\) => \(/, replace: '{[...Array(5)].map((_, idx) => (' },
    { file: 'xpress-app/src/Pages/Dashboard/OverView/Overview.jsx', search: /key=\{i\}/, replace: 'key={idx}' },
    { file: 'xpress-app/src/Pages/Management/Customers/CustomerDetailModal.jsx', search: /  \}, \[customer, isOpen\]\);/, replace: '  }, [customer, isOpen, fetchCustomerOrders]);' },
    { file: 'xpress-app/src/Pages/Management/Customers/Customers.jsx', search: /  \}, \[\]\);/, replace: '  }, [fetchCustomers]);' },
    { file: 'xpress-app/src/Pages/Products/AllProducts.jsx', search: /const \[refreshKey, setRefreshKey\] = useState\(0\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/editProduct.jsx', search: /const \{ token \} = useSelector\(\(state\) => state\.auth\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/editProduct.jsx', search: /const \{ items \} = useSelector\(\(state\) => state\.vendors\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Products/editProduct.jsx', search: /  \}, \[\]\);/, replace: '  }, [navigate, user?.role, user?.uid]);' },
    { file: 'xpress-app/src/Pages/Products/product.jsx', search: /const vendorId = formData\.get\('vendorId'\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/OrderDetailModal.jsx', search: /const \[selectedStatus, setSelectedStatus\] = useState\(order\?\.orderStatus \|\| order\?\.status \|\| 'pending'\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/OrderDetailModal.jsx', search: /\.catch\(e => console\.error\("Error closing modal", e\)\);/, replace: '.catch(() => console.error("Error closing modal"));' },
    { file: 'xpress-app/src/Pages/Sales/Orders.jsx', search: /const shouldFetch = status === 'idle' \|\| \(lastFetched && Date\.now\(\) - lastFetched > 5 \* 60 \* 1000\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/Orders.jsx', search: /  \}, \[dispatch, pagination\.page, pagination\.limit\]\);/, replace: '  }, [dispatch, pagination.page, pagination.limit, lastFetched, status]);' },
    { file: 'xpress-app/src/Pages/Sales/Payments.jsx', search: /const \[searchTerm, setSearchTerm\] = useState\(''\);/, replace: '' },
    { file: 'xpress-app/src/Pages/Sales/Payments.jsx', search: /  \}, \[\]\);/, replace: '  }, [fetchAccountingData]);' }
  ];

  for (const issue of issues) {
    if (fs.existsSync(issue.file)) {
      let content = fs.readFileSync(issue.file, 'utf8');
      content = content.replace(issue.search, issue.replace);
      // for Overview duplicate keys
      if (issue.file.includes('Overview.jsx')) {
          content = content.replace(/key=\{i\}/g, 'key={idx}');
      }
      fs.writeFileSync(issue.file, content);
    }
  }
}

fixEslint();
