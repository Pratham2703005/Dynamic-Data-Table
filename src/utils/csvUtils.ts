import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import type { RowData, ColumnConfig } from '../features/tables/tableSlice'

export interface ImportError {
  row: number
  message: string
}

export interface ImportResult {
  data: RowData[]
  errors: ImportError[]
}

/**
 * Import CSV file and parse it into RowData array
 */
export const importCSV = (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: RowData[] = []
        const errors: ImportError[] = []

        results.data.forEach((row: any, index: number) => {
          // Normalize keys to lowercase for case-insensitive matching
          const normalizedRow: any = {}
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase()] = row[key]
          })
          
          // Generate ID if not present
          const id = normalizedRow.id || `imported-${Date.now()}-${index}`
          
          // Basic validation
          if (!normalizedRow.name || !normalizedRow.email) {
            errors.push({
              row: index + 1,
              message: 'Missing required fields: name or email',
            })
            return
          }

          // Validate email
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedRow.email)) {
            errors.push({
              row: index + 1,
              message: `Invalid email format: ${normalizedRow.email}`,
            })
            return
          }

          // Parse age
          const age = parseInt(normalizedRow.age, 10)
          if (isNaN(age) || age < 0 || age > 150) {
            errors.push({
              row: index + 1,
              message: `Invalid age: ${normalizedRow.age}`,
            })
            return
          }

          // Build the final row data using normalized keys
          data.push({
            id,
            name: normalizedRow.name,
            email: normalizedRow.email,
            age,
            role: normalizedRow.role || '',
            department: normalizedRow.department || '',
            location: normalizedRow.location || '',
          })
        })

        resolve({ data, errors })
      },
      error: (error) => {
        resolve({
          data: [],
          errors: [{ row: 0, message: `Parse error: ${error.message}` }],
        })
      },
    })
  })
}

/**
 * Export data to CSV file
 */
export const exportCSV = (
  rows: RowData[],
  columns: ColumnConfig[],
  filename: string = 'table-export.csv'
) => {
  // Get visible columns only
  const visibleColumns = columns
    .filter((col) => col.visible)
    .sort((a, b) => a.order - b.order)

  // Prepare data for export
  const exportData = rows.map((row) => {
    const exportRow: any = {}
    visibleColumns.forEach((col) => {
      exportRow[col.label] = row[col.id] ?? ''
    })
    return exportRow
  })

  // Convert to CSV
  const csv = Papa.unparse(exportData)

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

/**
 * Generate sample CSV template
 */
export const generateSampleCSV = () => {
  const sampleData = [
  { name: 'John Doe', email: 'john.doe@example.com', age: 28, role: 'Developer', department: 'Engineering', location: 'New York' },
  { name: 'Jane Smith', email: 'jane.smith@example.com', age: 32, role: 'Manager', department: 'Operations', location: 'San Francisco' },
  { name: 'Michael Johnson', email: 'michael.j@example.com', age: 45, role: 'Director', department: 'Sales', location: 'Chicago' },
  { name: 'Emily Davis', email: 'emily.davis@example.com', age: 26, role: 'Designer', department: 'Marketing', location: 'Los Angeles' },
  { name: 'Robert Brown', email: 'robert.brown@example.com', age: 38, role: 'Developer', department: 'Engineering', location: 'Seattle' },
  { name: 'Sarah Wilson', email: 'sarah.w@example.com', age: 29, role: 'Analyst', department: 'Finance', location: 'Boston' },
  { name: 'David Lee', email: 'david.lee@example.com', age: 41, role: 'Manager', department: 'HR', location: 'Austin' },
  { name: 'Jennifer Taylor', email: 'jennifer.t@example.com', age: 35, role: 'Developer', department: 'Engineering', location: 'Denver' },
  { name: 'James Anderson', email: 'james.a@example.com', age: 52, role: 'VP', department: 'Operations', location: 'Miami' },
  { name: 'Lisa Martinez', email: 'lisa.martinez@example.com', age: 30, role: 'Designer', department: 'Marketing', location: 'Portland' },
  { name: 'Christopher Garcia', email: 'chris.g@example.com', age: 27, role: 'Developer', department: 'Engineering', location: 'New York' },
  { name: 'Amanda Rodriguez', email: 'amanda.r@example.com', age: 33, role: 'Manager', department: 'Sales', location: 'Dallas' },
  { name: 'Daniel Hernandez', email: 'daniel.h@example.com', age: 39, role: 'Analyst', department: 'Finance', location: 'Phoenix' },
  { name: 'Michelle Lopez', email: 'michelle.l@example.com', age: 31, role: 'Designer', department: 'Marketing', location: 'San Diego' },
  { name: 'Kevin Gonzalez', email: 'kevin.g@example.com', age: 44, role: 'Director', department: 'Engineering', location: 'Atlanta' },
  { name: 'Patricia Wilson', email: 'patricia.w@example.com', age: 37, role: 'Manager', department: 'Operations', location: 'Houston' },
  { name: 'Thomas Moore', email: 'thomas.moore@example.com', age: 42, role: 'Developer', department: 'Engineering', location: 'Philadelphia' },
  { name: 'Nancy Jackson', email: 'nancy.j@example.com', age: 29, role: 'Analyst', department: 'Finance', location: 'San Antonio' },
]


  const csv = Papa.unparse(sampleData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'sample-template.csv')
}
