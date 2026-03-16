import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [role, setRole]     = useState(null)   // 'student' | 'admin'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    if (stored && storedRole) {
      setUser(JSON.parse(stored))
      setRole(storedRole)
    }
    setLoading(false)
  }, [])

  const login = (userData, userRole, token) => {
    localStorage.setItem('user',  JSON.stringify(userData))
    localStorage.setItem('role',  userRole)
    localStorage.setItem('token', token)
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
