'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material'
import { Add as AddIcon, DragIndicator as DragIcon } from '@mui/icons-material'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import {
  toggleColumnVisibility,
  addColumn,
  reorderColumns,
  type ColumnConfig,
} from '../features/tables/tableSlice'

interface ManageColumnsModalProps {
  open: boolean
  onClose: () => void
}

export default function ManageColumnsModal({ open, onClose }: ManageColumnsModalProps) {
  const dispatch = useAppDispatch()
  const columns = useAppSelector((state) => state.table.columns)

  const [newColumnId, setNewColumnId] = useState('')
  const [newColumnLabel, setNewColumnLabel] = useState('')

  const handleToggle = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId))
  }

  const handleAddColumn = () => {
    if (newColumnId && newColumnLabel) {
      // Check if column already exists
      if (columns.find((col) => col.id === newColumnId)) {
        alert('Column with this ID already exists!')
        return
      }

      dispatch(
        addColumn({
          id: newColumnId.toLowerCase().replace(/\s+/g, '_'),
          label: newColumnLabel,
          visible: true,
        })
      )
      setNewColumnId('')
      setNewColumnLabel('')
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property
    const updatedColumns = items.map((col, index) => ({
      ...col,
      order: index,
    }))

    dispatch(reorderColumns(updatedColumns))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add New Column
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              label="Column ID"
              value={newColumnId}
              onChange={(e) => setNewColumnId(e.target.value)}
              placeholder="e.g., department"
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Column Label"
              value={newColumnLabel}
              onChange={(e) => setNewColumnLabel(e.target.value)}
              placeholder="e.g., Department"
              sx={{ flex: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleAddColumn}
              disabled={!newColumnId || !newColumnLabel}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Show/Hide & Reorder Columns (Drag to reorder)
        </Typography>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          backgroundColor: snapshot.isDragging
                            ? 'action.hover'
                            : 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          {...provided.dragHandleProps}
                          sx={{ display: 'flex', mr: 1, cursor: 'grab' }}
                        >
                          <DragIcon />
                        </Box>
                        <Checkbox
                          checked={column.visible}
                          onChange={() => handleToggle(column.id)}
                        />
                        <ListItemText
                          primary={column.label}
                          secondary={`ID: ${column.id}`}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
