"use client"

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Home } from "./pages/Home"
import { FlashControlPage } from "./pages/FlashControlPage"
import { ArmControlPage } from "./pages/ArmControlPage"
import { LoginPage } from "./pages/LoginPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import { Lightbulb, HomeIcon, LogOut, Bot } from "lucide-react"
import { useAuth } from "./context/AuthContext"

function NavLink({ to, children, icon: Icon }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive ? "bg-[#1d4ed8] text-white" : "text-gray-400 hover:text-white hover:bg-[#1e293b]"
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </Link>
  )
}

function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="h-screen flex flex-col bg-[#0d1117]">
      <header className="border-b border-[#1e2736] bg-[#0d1117]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#1d4ed8]" />
            <h1 className="text-xl font-bold text-white">DRC Controller</h1>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/" icon={HomeIcon}>
              Home
            </NavLink>
            <NavLink to="/flash" icon={Lightbulb}>
              LED
            </NavLink>
            <NavLink to="/arm" icon={Bot}>
              Arm
            </NavLink>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e293b] transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 flex justify-center">
        <div className="w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flash" element={<FlashControlPage />} />
            <Route path="/arm" element={<ArmControlPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App

