'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Alert,
  Typography,
  LinearProgress,
} from '@mui/material'
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as TemplateIcon,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setRows } from '../features/tables/tableSlice'
import { importCSV, exportCSV, generateSampleCSV, type ImportError } from '../utils/csvUtils'

interface ImportExportProps {
  onImportComplete?: () => void
}

export default function ImportExport({ onImportComplete }: ImportExportProps) {
  const dispatch = useAppDispatch()
  const { rows, columns } = useAppSelector((state) => state.table)

  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importErrors, setImportErrors] = useState<ImportError[]>([])
  const [importing, setImporting] = useState(false)

  const handleImportClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setImporting(true)
        setImportDialogOpen(true)
        setImportErrors([])

        const result = await importCSV(file)

        setImporting(false)

        if (result.errors.length > 0) {
          setImportErrors(result.errors)
        } else {
          dispatch(setRows(result.data))
          setImportDialogOpen(false)
          onImportComplete?.()
        }

        if (result.data.length > 0 && result.errors.length === 0) {
          // Success!
        }
      }
    }
    input.click()
  }

  const handleExport = () => {
    exportCSV(rows, columns)
  }

  const handleDownloadTemplate = () => {
    generateSampleCSV()
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleImportClick}
        >
          Import CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={rows.length === 0}
        >
          Export CSV
        </Button>
        <Button
          variant="text"
          startIcon={<TemplateIcon />}
          onClick={handleDownloadTemplate}
          size="small"
        >
          Download Template
        </Button>
      </Box>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => !importing && setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Results</DialogTitle>
        <DialogContent>
          {importing ? (
            <Box sx={{ py: 2 }}>
              <Typography gutterBottom>Processing CSV file...</Typography>
              <LinearProgress />
            </Box>
          ) : importErrors.length > 0 ? (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                Found {importErrors.length} error(s) in the CSV file. Please fix these
                issues and try again.
              </Alert>
              <List dense>
                {importErrors.map((error, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Row ${error.row}: ${error.message}`}
                      primaryTypographyProps={{ color: 'error' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Alert severity="success">
              CSV imported successfully! The table has been updated with the new data.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)} disabled={importing}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
