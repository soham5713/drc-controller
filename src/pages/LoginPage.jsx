"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Bot, Loader2 } from "lucide-react"

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate network delay
    setTimeout(() => {
      const success = login(username, password)
      if (success) {
        navigate("/")
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
      <div className="w-full max-w-md p-8 bg-[#141c2b] rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#1d4ed8]/20 rounded-full flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-[#60a5fa]" />
          </div>
          <h1 className="text-2xl font-bold text-white">DRC Controller</h1>
          <p className="text-gray-400 mt-1">Login to access the control panel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a2332] border border-[#1e2736] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a2332] border border-[#1e2736] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg flex items-center justify-center transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

