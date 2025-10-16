# 📊 Dynamic Data Table Manager

A powerful, feature-rich data table manager built with **Next.js**, **Redux Toolkit**, and **Material UI**.

---

## 🎯 Overview

This project demonstrates advanced React patterns including state management, CSV handling, inline editing, and dynamic UI updates. Perfect for managing tabular data with import/export capabilities.

---

## ✨ Features Walkthrough

### 1️⃣ **Table View with Sorting & Pagination**

Display data in a clean, sortable table with pagination controls.

**Implementation:**
- Material UI `Table` components for layout
- Click column headers to toggle ASC/DESC sorting
- Client-side pagination (10 rows per page)
- Redux manages sorting and pagination state

*[Add screenshot: Main table view with data]*

---

### 2️⃣ **Global Search**

Search across all fields in real-time.

**Implementation:**
- Search input filters all visible rows
- Case-insensitive matching
- Searches across Name, Email, Age, Role, Department, Location

*[Add screenshot: Search bar with filtered results]*

---

### 3️⃣ **Manage Columns (Dynamic UI)**

Add new columns or show/hide existing ones dynamically.

**Implementation:**
- Modal dialog with checkboxes for visibility toggle
- Add custom columns (e.g., Department, Location, Salary)
- Changes reflect instantly in the table
- State persisted via Redux Persist in localStorage

*[Add screenshot: Manage Columns modal open]*

---

### 4️⃣ **Import CSV**

Upload CSV files with validation and error handling.

**Implementation:**
- Uses **PapaParse** library for parsing
- Validates required fields (Name, Email)
- Email format validation
- Age range validation (0-150)
- Shows error messages for invalid rows

**How to test:**
- Use the provided `public/sample-data.csv` file
- Or create your own with columns: Name, Email, Age, Role, Department, Location

*[Add screenshot: Import dialog and success/error messages]*

---

### 5️⃣ **Export CSV**

Download the current table view as a CSV file.

**Implementation:**
- Uses **FileSaver.js** for file download
- Only exports **visible columns**
- Respects current filters and sorting
- Generates proper CSV format with headers

*[Add screenshot: Export button and downloaded file]*

---

### 6️⃣ **Inline Row Editing** ⭐ Bonus

Double-click any cell to edit it inline with validation.

**Implementation:**
- Double-click cell to enter edit mode
- Press Enter or click outside to save
- ESC to cancel editing
- Input validation (email format, age is numeric)
- Visual feedback with blue outline

*[Add screenshot: Cell in edit mode]*

---

### 7️⃣ **Add New Rows** ⭐ Bonus

Create new rows on the fly.

**Implementation:**
- "Add New Row" button creates empty row at top
- Fill in data using inline editing
- Auto-generates unique ID for each row
- Redux action dispatches new row to state

*[Add screenshot: New empty row added]*

---

### 8️⃣ **Delete Rows** ⭐ Bonus

Remove rows with confirmation dialog.

**Implementation:**
- Delete icon button in each row
- Confirmation dialog prevents accidental deletion
- Redux action removes row from state

*[Add screenshot: Delete confirmation dialog]*

---

### 9️⃣ **Theme Toggle (Light/Dark Mode)** ⭐ Bonus

Switch between light and dark themes.

**Implementation:**
- Custom MUI theme with light/dark palettes
- Toggle button in header (sun/moon icon)
- Theme preference persisted in localStorage
- Smooth transition between themes

*[Add screenshot: Dark mode view]*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Redux Toolkit** | State management |
| **Redux Persist** | Persist state to localStorage |
| **Material UI v5** | Component library & theming |
| **TypeScript** | Type safety |
| **PapaParse** | CSV parsing |
| **FileSaver.js** | CSV export |

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main page
│   ├── providers.tsx           # Redux + Theme providers
│   └── theme.ts                # Light/Dark theme config
├── components/
│   ├── DataTable.tsx           # Table with sorting & pagination
│   ├── ImportExport.tsx        # CSV import/export UI
│   ├── ManageColumnsModal.tsx  # Column visibility manager
│   ├── TableManager.tsx        # Main container
│   └── ThemeToggle.tsx         # Theme switcher
├── features/tables/
│   └── tableSlice.ts           # Redux slice (actions & reducers)
├── store/
│   ├── store.ts                # Redux store with persist
│   └── hooks.ts                # Typed useAppDispatch/useAppSelector
├── types/
│   └── index.ts                # TypeScript interfaces
└── utils/
    └── csvUtils.ts             # CSV parsing & export logic
```

---

## 📝 Key Implementation Details

### Redux State Management
- **tableSlice.ts**: Manages rows, columns, sorting, search, pagination
- **Redux Persist**: Auto-saves column visibility to localStorage
- **Typed Hooks**: `useAppDispatch` and `useAppSelector` for type safety

### CSV Import/Export
- **Case-insensitive** header matching (Name/name/NAME all work)
- **Validation**: Required fields, email format, age range
- **Error reporting**: Shows which rows failed validation

### Inline Editing
- Click cell → Edit mode → Validate → Save/Cancel
- Validation rules: Email format, Age 0-150, Required fields

### Responsive Design
- Mobile-friendly table with horizontal scroll
- Adaptive button layouts
- Touch-friendly edit interactions

---

## 🎯 Assignment Checklist

### Core Features
- ✅ Table with Name, Email, Age, Role columns
- ✅ Column header sorting (ASC/DESC)
- ✅ Global search across all fields
- ✅ Pagination (10 rows/page)
- ✅ Manage Columns modal (add/show/hide)
- ✅ Column visibility persisted
- ✅ Import CSV with validation
- ✅ Export CSV (visible columns only)

### Bonus Features
- ✅ Inline row editing with validation
- ✅ Add new rows
- ✅ Delete rows with confirmation
- ✅ Light/Dark theme toggle
- ✅ Fully responsive design
- ⬜ Column drag-and-drop reordering (not implemented)

---

## 📦 Sample Data

Test the app with: **`public/sample-data.csv`**
- 19 rows of sample data
- Includes: Name, Email, Age, Role, Department, Location

---

## 📄 License

MIT

---

**Built with ❤️ for Surefy Tech Pvt Ltd**

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Material-UI (MUI) v7
- **Language**: TypeScript
- **CSV Parsing**: PapaParse
- **File Export**: FileSaver.js
- **Drag & Drop**: @hello-pangea/dnd

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Usage Guide

### Basic Operations

1. **Search**: Use the search bar to filter across all visible columns
2. **Sort**: Click any column header to sort (click again to reverse)
3. **Paginate**: Use pagination controls at the bottom
4. **Edit**: Double-click a row or click the edit icon
5. **Delete**: Click delete icon twice to confirm deletion

### Column Management

1. Click "Manage Columns" button
2. **Add Column**: Enter ID and Label, click + icon
3. **Show/Hide**: Check/uncheck columns
4. **Reorder**: Drag columns using the handle icon

### Import/Export

**Import CSV:**
1. Click "Import CSV"
2. Select a CSV file (name, email, age, role required)
3. Review any errors
4. Data automatically loads on success
5. **Sample CSV**: A test file is available at `public/sample-data.csv`

**Export CSV:**
1. Click "Export CSV"
2. File downloads with visible columns only

### Adding New Rows

1. Click "Add New Row" button
2. A blank row appears at the bottom
3. Double-click or click edit to fill in the data
4. Save your changes

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   ├── providers.tsx        # Redux, Theme providers
│   └── theme.ts             # MUI themes
├── components/
│   ├── DataTable.tsx        # Main table
│   ├── ManageColumnsModal.tsx # Column management
│   ├── ImportExport.tsx     # CSV operations
│   ├── TableManager.tsx     # Main container
│   └── ThemeToggle.tsx      # Theme switcher
├── features/tables/
│   └── tableSlice.ts        # Redux slice
├── store/
│   ├── store.ts             # Redux store
│   └── hooks.ts             # Typed hooks
└── utils/
    └── csvUtils.ts          # CSV utilities
```

## 📝 CSV Format

Required columns:
- `name` (string)
- `email` (valid email)
- `age` (number, 0-150)
- `role` (string)

Example:
```csv
name,email,age,role
John Doe,john@example.com,28,Developer
Jane Smith,jane@example.com,32,Designer
```

## 🎯 Key Features Implemented

✅ Sorting (ASC/DESC toggle)  
✅ Global search  
✅ Client-side pagination  
✅ Dynamic column add/remove  
✅ Show/hide columns  
✅ CSV Import with validation  
✅ CSV Export (visible columns only)  
✅ Inline row editing  
✅ Row delete with confirmation  
✅ Theme toggle (Light/Dark)  
✅ Drag-and-drop column reordering  
✅ Redux Persist for state  
✅ Responsive design  
✅ TypeScript throughout  
✅ Material-UI components

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   D y n a m i c - D a t a - T a b l e  
 