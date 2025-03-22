"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (username, password) => {
    if (username === "drc_spit" && password === "yarmdrc25") {
      setIsAuthenticated(true)
      localStorage.setItem("auth", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("auth")
    navigate("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

