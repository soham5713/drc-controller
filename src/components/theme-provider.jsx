"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({ theme: "dark", setTheme: () => null })

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  attribute = "class",
  forcedTheme = null,
}) {
  const [theme, setTheme] = useState(() => {
    if (forcedTheme) {
      return forcedTheme
    }
    
    if (typeof window !== "undefined") {
      // Check for stored theme preference
      const storedTheme = localStorage.getItem(storageKey)
      if (storedTheme) {
        return storedTheme
      }
      
      // Check for system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark"
      }
    }
    
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove previous theme attribute
    root.removeAttribute(attribute)
    
    // Set the theme attribute with the current theme value
    const themeValue = forcedTheme || theme
    if (attribute === "class") {
      root.classList.remove("light", "dark")
      if (themeValue) {
        root.classList.add(themeValue)
      }
    } else {
      if (themeValue) {
        root.setAttribute(attribute, themeValue)
      }
    }
  }, [theme, attribute, forcedTheme])

  useEffect(() => {
    if (forcedTheme || !storageKey) return
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey, forcedTheme])

  const value = {
    theme: forcedTheme || theme,
    setTheme: (newTheme) => {
      if (forcedTheme) return
      setTheme(newTheme)
    },
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
