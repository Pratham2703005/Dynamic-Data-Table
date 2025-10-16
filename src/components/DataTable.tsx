'use client'
import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  IconButton,
  TableSortLabel,
  Tooltip,
  Box,
  Typography,
  Chip,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  setSearchQuery,
  setSorting,
  setPage,
  setRowsPerPage,
  deleteRow,
  updateRow,
  setEditingRowId,
} from '../features/tables/tableSlice'
import type { RowData } from '../features/tables/tableSlice'

export default function DataTable() {
  const dispatch = useAppDispatch()
  const {
    rows,
    columns,
    searchQuery,
    sortColumn,
    sortDirection,
    page,
    rowsPerPage,
    editingRowId,
  } = useAppSelector((state) => state.table)

  const [editedData, setEditedData] = useState<Partial<RowData>>({})
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Get visible columns only
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible).sort((a, b) => a.order - b.order)
  }, [columns])

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows

    const query = searchQuery.toLowerCase()
    return rows.filter((row) =>
      visibleColumns.some((col) => {
        const value = row[col.id]
        return value?.toString().toLowerCase().includes(query)
      })
    )
  }, [rows, searchQuery, visibleColumns])

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue || '').toLowerCase()
      const bStr = String(bValue || '').toLowerCase()

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }, [filteredRows, sortColumn, sortDirection])

  // Paginate rows
  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage
    return sortedRows.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedRows, page, rowsPerPage])

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      // Toggle direction
      dispatch(
        setSorting({
          column: columnId,
          direction: sortDirection === 'asc' ? 'desc' : 'asc',
        })
      )
    } else {
      // New column, default to asc
      dispatch(setSorting({ column: columnId, direction: 'asc' }))
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    dispatch(setPage(newPage))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRowsPerPage(parseInt(event.target.value, 10)))
  }

  const handleEdit = (rowId: string) => {
    dispatch(setEditingRowId(rowId))
    const row = rows.find((r) => r.id === rowId)
    if (row) {
      setEditedData({ ...row })
    }
  }

  const handleCancelEdit = () => {
    dispatch(setEditingRowId(null))
    setEditedData({})
  }

  const handleSaveEdit = () => {
    if (editingRowId) {
      dispatch(updateRow({ id: editingRowId, data: editedData }))
      dispatch(setEditingRowId(null))
      setEditedData({})
    }
  }

  const handleDelete = (rowId: string) => {
    if (deleteConfirmId === rowId) {
      dispatch(deleteRow(rowId))
      setDeleteConfirmId(null)
    } else {
      setDeleteConfirmId(rowId)
      setTimeout(() => setDeleteConfirmId(null), 3000)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setEditedData((prev) => ({ ...prev, [field]: value }))
  }

  const validateField = (field: string, value: any): boolean => {
    if (field === 'age') {
      const num = Number(value)
      return !isNaN(num) && num > 0 && num < 150
    }
    if (field === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
    return true
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search all fields"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Type to search across all columns..."
        />
      </Box>

    

      {/* Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={sortColumn === column.id}
                    direction={sortColumn === column.id ? sortDirection : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => {
                const isEditing = editingRowId === row.id
                return (
                  <TableRow
                    key={row.id}
                    hover={!isEditing}
                    sx={{
                      backgroundColor: isEditing ? 'action.selected' : 'inherit',
                    }}
                    onDoubleClick={() => !editingRowId && handleEdit(row.id)}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            value={editedData[column.id] ?? ''}
                            onChange={(e) => handleFieldChange(column.id, e.target.value)}
                            error={
                              !validateField(column.id, editedData[column.id])
                            }
                            helperText={
                              !validateField(column.id, editedData[column.id])
                                ? 'Invalid value'
                                : ''
                            }
                            fullWidth
                          />
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {isEditing ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={handleSaveEdit}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                color="default"
                                onClick={handleCancelEdit}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit (or double-click row)">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(row.id)}
                                disabled={!!editingRowId}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={
                                deleteConfirmId === row.id
                                  ? 'Click again to confirm'
                                  : 'Delete'
                              }
                            >
                              <IconButton
                                size="small"
                                color={deleteConfirmId === row.id ? 'error' : 'default'}
                                onClick={() => handleDelete(row.id)}
                                disabled={!!editingRowId}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  )
}
