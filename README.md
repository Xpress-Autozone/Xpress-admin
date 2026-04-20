# Xpress Autozone - Management Dashboard

Professional enterprise administration panel for the Xpress Autozone ecosystem. This platform provides real-time oversight of inventory, automated financial tracking, and customer relationship management.

## 🚀 Key Features

### 1. Analytics & Overview
- **Real-time Metrics**: Live tracking of Total Products, Sales Volume, and Active/Completed Orders.
- **Interactive Charts**: 12-month rolling visualization for **Revenue**, **Order counts**, and **New Signups** with dynamic toggles.
- **System Health**: Quick-access critical stock alerts and security audit logs.

### 2. Accounting & Sales Ledger
- **Cash Flow Tracking**: A professional ledger for income, payouts, and manual payment confirmations.
- **Receipt Generation**: Automated `INV-{3 digits}` ID generation (e.g., `INV-001`) for manual records.
- **Data Export**: One-click CSV export for all ledger transactions.
- **PoD Workflow**: Dedicated processing tools for Pay-on-Delivery confirmation.

### 3. Inventory Management
- **Category Control**: Enforcement of the 8 canonical automotive categories.
- **Smart Thresholds**: Automated low-stock detection based on customizable `lowStockThreshold` fields.
- **Promotion Flags**: Direct control over `featured`, `newProduct`, and `hotProduct` status for the consumer app.

### 4. Customer CRM
- **User Profiling**: Unified view of Firebase Auth metadata joined with Firestore transactional data.
- **Segmentation**: Support for persistent user tags (e.g., `VIP`, `Wholesale`).
- **Audit**: View order history and account status in a simplified, professional detail view.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (Vite) |
| **State Management** | Redux Toolkit |
| **Styling** | TailwindCSS |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **API Backend** | Node.js (Render) |
| **Database** | Firebase / Firestore |

---

## 📦 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation
1. Navigate to the app directory:
   ```bash
   cd xpress-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### API Configuration
The dashboard is configured to communicate with the production backend at:
`https://xpress-backend-eeea.onrender.com`

---

## 🔐 Security & Roles
Access is strictly limited to users with the `admin` custom claim. Unauthorized users are redirected to the main consumer homepage.

---
© 2026 Xpress Autozone. All rights reserved.
