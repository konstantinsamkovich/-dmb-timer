import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'dmb-timer-theme'
const THEME_COLORS = {
  light: '#f6faff',
  dark: '#0b1322',
}

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    return null
  }

  return null
}

function applyTheme(theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLORS[theme])
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage can be unavailable (private mode); the theme still works for this visit.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => getStoredTheme() ?? getSystemTheme())
  const [hasStoredTheme, setHasStoredTheme] = useState(() => getStoredTheme() !== null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (hasStoredTheme || !window.matchMedia) return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setTheme(event.matches ? 'dark' : 'light')

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [hasStoredTheme])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setHasStoredTheme(true)
    storeTheme(next)
  }, [theme])

  return { theme, toggleTheme }
}
