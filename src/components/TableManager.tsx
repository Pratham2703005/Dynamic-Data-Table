'use client'
import React, { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import DataTable from './DataTable'
import ManageColumnsModal from './ManageColumnsModal'
import ImportExport from './ImportExport'
import ThemeToggle from './ThemeToggle'
import { useAppDispatch } from '../store/hooks'
import { resetTable, addRow } from '../features/tables/tableSlice'

export default function TableManager() {
  const dispatch = useAppDispatch()
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false)

  const handleAddRow = () => {
    const newRow = {
      id: Date.now().toString(),
      name: '',
      email: '',
      age: 0,
      role: '',
    }
    dispatch(addRow(newRow))
    // Optionally, you can set editing mode for the new row
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the table to default data?')) {
      dispatch(resetTable())
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default', maxWidth:'70vw', margin:'auto'  }}>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6, flex: 1 }}>
        {/* Header Section */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                 Data Table Manager
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                Manage your data with sorting, searching, pagination, inline editing, and CSV import/export
              </Typography>
            </Box>
            <ThemeToggle />
          </Box>
        </Box>

        {/* Action Bar */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)',
            backdropFilter: 'blur(10px)',
          }}
          elevation={0}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
              <ImportExport />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRow}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 2.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                  },
                }}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setManageColumnsOpen(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 2,
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.08)',
                  },
                }}
              >
                Manage
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1.5,
                  px: 2,
                  '&:hover': {
                    background: 'rgba(245, 127, 23, 0.08)',
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Data Table */}
        <Paper
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
          elevation={0}
        >
          <DataTable />
        </Paper>

        {/* Manage Columns Modal */}
        <ManageColumnsModal
          open={manageColumnsOpen}
          onClose={() => setManageColumnsOpen(false)}
        />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 'auto',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
            Built with Next.js, Redux Toolkit, and Material-UI • Sorting • Searching • Pagination • Inline Editing • CSV Import/Export
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}