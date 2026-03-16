import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home        from './pages/Home'
import Register    from './pages/Register'
import Login       from './pages/Login'
import AdminLogin  from './pages/AdminLogin'

// Layouts
import StudentLayout from './components/StudentLayout'
import AdminLayout   from './components/AdminLayout'

// Student pages
import StudentDashboard  from './pages/student/Dashboard'
import Profile           from './pages/student/Profile'
import PreparationTracker from './pages/student/PreparationTracker'
import MockTest          from './pages/student/MockTest'
import InterviewTracker  from './pages/student/InterviewTracker'
import InterviewHistory  from './pages/student/InterviewHistory'

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard'
import ManageStudents   from './pages/admin/ManageStudents'
import AddMockQuestion  from './pages/admin/AddMockQuestion'
import InterviewRecords from './pages/admin/InterviewRecords'

function StudentPageWrapper({ children }) {
  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout>{children}</StudentLayout>
    </ProtectedRoute>
  )
}

function AdminPageWrapper({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"             element={<Home />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/admin/login"  element={<AdminLogin />} />

          {/* Student */}
          <Route path="/student/dashboard"   element={<StudentPageWrapper><StudentDashboard /></StudentPageWrapper>} />
          <Route path="/student/profile"     element={<StudentPageWrapper><Profile /></StudentPageWrapper>} />
          <Route path="/student/preparation" element={<StudentPageWrapper><PreparationTracker /></StudentPageWrapper>} />
          <Route path="/student/mocktest"    element={<StudentPageWrapper><MockTest /></StudentPageWrapper>} />
          <Route path="/student/interview"   element={<StudentPageWrapper><InterviewTracker /></StudentPageWrapper>} />
          <Route path="/student/history"     element={<StudentPageWrapper><InterviewHistory /></StudentPageWrapper>} />

          {/* Admin */}
          <Route path="/admin/dashboard"  element={<AdminPageWrapper><AdminDashboard /></AdminPageWrapper>} />
          <Route path="/admin/students"   element={<AdminPageWrapper><ManageStudents /></AdminPageWrapper>} />
          <Route path="/admin/mocktest"   element={<AdminPageWrapper><AddMockQuestion /></AdminPageWrapper>} />
          <Route path="/admin/interviews" element={<AdminPageWrapper><InterviewRecords /></AdminPageWrapper>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
