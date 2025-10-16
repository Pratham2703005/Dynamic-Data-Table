// Type definitions for the application

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

export type SortDirection = 'asc' | 'desc'

export interface ImportError {
  row: number
  message: string
}
