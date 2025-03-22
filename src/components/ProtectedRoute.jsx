"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0d1117]">
        <Loader2 className="w-8 h-8 text-[#1d4ed8] animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

