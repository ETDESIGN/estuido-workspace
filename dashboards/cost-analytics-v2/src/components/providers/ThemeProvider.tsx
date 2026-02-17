'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
  defaultDark?: boolean
}

export function ThemeProvider({ children, defaultDark = true }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(defaultDark)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    if (stored) {
      setIsDark(stored === 'dark')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark, mounted])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
