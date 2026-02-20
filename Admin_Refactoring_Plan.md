# Admin Refactoring Plan

> **Goal:** Align the Admin panel with the **Xpress Front-End** (Singular Source of Truth) and implement a structured Sidebar navigation with analytics-driven insights.

---

## 1 — The "Singular Source of Truth" (Frontend Contract)

### 1.1 The 8 Canonical Categories (User-Provided)
The Admin must **strictly** enforce these 8 categories. Any product not in one of these 8 is effectively valid but "invisible" in category filters until updated.

| UI Label | ID (for DB/URL) | Lucide Icon |
|---|---|---|
| **Body & Parts** | `body-parts` | `Car` |
| **Engine & Performance** | `engine-performance` | `Cpu` |
| **Wheels & Tires** | `wheels-tires` | `Disc` |
| **Lighting & Electronics** | `lighting-electronics` | `Zap` |
| **Accessories** | `accessories` | `Sparkles` |
| **Automotive Tools** | `automotive-tools` | `Wrench` |
| **Fluids & Car Care** | `fluids-car-care` | `Droplet` |
| **Cooling & AC** | `cooling-ac` | `Thermometer` |

### 1.2 The Xplore Page Contract (Display Flags)
The Admin must allow toggling these exact boolean flags to control the Xplore page sections:
*   `featured`
*   `newProduct`
*   `hotProduct`
*   `showOnHome`

---

## 2 — Sidebar & Navigation Structure (New)
The Sidebar will be reorganized into logical groups for better UX:

### **Group 1: Dashboard & Core Management**
1.  **Overview** (`/overview`) — Charts & Analytics.
2.  **Total Inventory** (`/products`) — **New Page**: View ALL products in one table.
3.  **Vendor Management** (`/vendors`) — Source tracking.

### **Group 2: Categories (Filtering & Visualization)**
*   [Dynamic List of the 8 Categories above]
*   *Each clicks to `/categories/:id`*

### **Group 3: Admin Controls**
1.  **Admin Management** (`/admin-roles`)

---

## 3 — Execution Phases

### Phase 1 — Constant & Setup (Strict)
- Create `src/constants/categories.js` with **only** the 8 canonical categories.
- Create `src/hooks/useCategories.js`.

### Phase 2 — Refactor Product Form
- **Replace** category dropdown with the 8 canonical options.
- **Add** 4 boolean toggles (`featured`, `newProduct`, `hotProduct`, `showOnHome`).
- **Rename** `quantity` → `stock`.
- **Rename** `category` → `categoryId`.
- **Remove** `priority` and `displayOnPage`.

### Phase 3 — Implement Edit Product
- New Page: `editProduct.jsx`.
- Update Slice: Add `updateProduct` thunk.
- **Purpose**: Critical for migrating old products to new categories.

### Phase 4 — Unified List Pages
- **New**: `AllProducts.jsx` (for "Total Inventory").
- **New**: `CategoryProducts.jsx` (for "Category" links).
- Both will reuse the enhanced `ProductList` component.

### Phase 5 — Sidebar & Navigation
- Reorganize sidebar into the 3 groups defined above.
- Use dynamic mapping for the Category group.

### Phase 6 — Routing Updates
- Update `dashboardLayout.jsx` to support `/products` (Total Inventory) and `/categories/:slug`.

### Phase 7 — ProductList & Inventory UI
- Add badges for `Featured`, `New`, `Hot`.
- Show computed Stock Status (Low/Out/In).

### Phase 8 — Cleanup
- **Delete** the 8 hardcoded category page files.

---

## 4 — Verification Plan

1.  **Sidebar Check**: Verify "Total Inventory" shows *all* products.
2.  **Category Check**: Verify clicking "Body & Parts" shows *only* products with `categoryId: 'body-parts'`.
3.  **Frontend Verify**: (User verifies) Confirm Xplore page features work.
