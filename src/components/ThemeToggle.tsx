'use client'
import React, { useState, useEffect } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    setIsDark(savedTheme === 'dark')
  }, [])

  const handleToggle = () => {
    if (typeof window !== 'undefined' && (window as any).toggleTheme) {
      (window as any).toggleTheme()
      setIsDark(!isDark)
    }
  }

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton onClick={handleToggle} color="inherit">
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}
