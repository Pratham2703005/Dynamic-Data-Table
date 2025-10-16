import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RowData {
  id: string
  name: string
  email: string
  age: number
  role: string
  [key: string]: any
}

export interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  order: number
}

interface TableState {
  rows: RowData[]
  columns: ColumnConfig[]
  searchQuery: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  page: number
  rowsPerPage: number
  editingRowId: string | null
}

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, order: 0 },
  { id: 'email', label: 'Email', visible: true, order: 1 },
  { id: 'age', label: 'Age', visible: true, order: 2 },
  { id: 'role', label: 'Role', visible: true, order: 3 },
]

// Sample initial data
const sampleData: RowData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', age: 25, role: 'Developer' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', age: 38, role: 'Analyst' },
]

const initialState: TableState = {
  rows: sampleData,
  columns: defaultColumns,
  searchQuery: '',
  sortColumn: null,
  sortDirection: 'asc',
  page: 0,
  rowsPerPage: 10,
  editingRowId: null,
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<RowData[]>) => {
      state.rows = action.payload
    },
    addRow: (state, action: PayloadAction<RowData>) => {
      state.rows.push(action.payload)
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<RowData> }>) => {
      const index = state.rows.findIndex(row => row.id === action.payload.id)
      if (index !== -1) {
        state.rows[index] = { ...state.rows[index], ...action.payload.data }
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter(row => row.id !== action.payload)
    },
    setColumns: (state, action: PayloadAction<ColumnConfig[]>) => {
      state.columns = action.payload
    },
    addColumn: (state, action: PayloadAction<Omit<ColumnConfig, 'order'>>) => {
      const maxOrder = Math.max(...state.columns.map(c => c.order), -1)
      state.columns.push({ ...action.payload, order: maxOrder + 1 })
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload)
      if (column) {
        column.visible = !column.visible
      }
    },
    reorderColumns: (state, action: PayloadAction<ColumnConfig[]>) => {
      state.columns = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.page = 0 // Reset to first page on search
    },
    setSorting: (state, action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>) => {
      state.sortColumn = action.payload.column
      state.sortDirection = action.payload.direction
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload
      state.page = 0
    },
    setEditingRowId: (state, action: PayloadAction<string | null>) => {
      state.editingRowId = action.payload
    },
    resetTable: (state) => {
      state.rows = sampleData
      state.columns = defaultColumns
      state.searchQuery = ''
      state.sortColumn = null
      state.sortDirection = 'asc'
      state.page = 0
    },
  },
})

export const {
  setRows,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  addColumn,
  toggleColumnVisibility,
  reorderColumns,
  setSearchQuery,
  setSorting,
  setPage,
  setRowsPerPage,
  setEditingRowId,
  resetTable,
} = tableSlice.actions

export default tableSlice.reducer
