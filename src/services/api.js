import axios from 'axios'

const api = axios.create({
  baseURL: 'https://placement-prep-tracker-q4sp.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────
export const registerStudent  = (data) => api.post('/register', data)
export const loginStudent     = (data) => api.post('/login', data)
export const loginAdmin       = (data) => api.post('/admin/login', data)

// ── Student ───────────────────────────────────────────────────────────────
export const getProfile       = ()     => api.get('/profile')
export const updateProfile    = (data) => api.put('/profile', data)

export const getPreparations  = ()     => api.get('/preparation')
export const addPreparation   = (data) => api.post('/preparation', data)

export const getMockTests     = ()     => api.get('/mocktests')
export const submitMockTest   = (data) => api.post('/mocktest/submit', data)

export const addInterview     = (data) => api.post('/interview', data)
export const getInterviews    = ()     => api.get('/interviews')

export const getDashboardStats = ()    => api.get('/dashboard')

// ── Admin ─────────────────────────────────────────────────────────────────
export const getAdminStudents   = ()     => api.get('/admin/students')
export const deleteStudent      = (id)   => api.delete(`/admin/students/${id}`)

export const addMockQuestion    = (data) => api.post('/mocktest/submit', data)

export const getAdminInterviews = ()     => api.get('/admin/interviews')
export const getAdminStats      = ()     => api.get('/admin/dashboard')

export default api
