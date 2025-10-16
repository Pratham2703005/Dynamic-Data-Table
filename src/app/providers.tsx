'use client'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store, persistor } from '../store/store'
import { lightTheme, darkTheme } from './theme'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  // Add theme toggle to window for access from components
  useEffect(() => {
    if (mounted) {
      (window as any).toggleTheme = toggleTheme
    }
  }, [mounted, isDarkMode])

  if (!mounted) {
    return null
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
