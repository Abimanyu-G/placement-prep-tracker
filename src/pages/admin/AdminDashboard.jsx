import { useState, useEffect } from 'react'
import { getAdminStats } from '../../services/api'

function StatCard({ label, value, icon, sublabel, color }) {
  const colors = {
    blue:   'from-brand-500/15 to-brand-600/5 border-brand-500/25 text-brand-400',
    green:  'from-emerald-500/15 to-emerald-600/5 border-emerald-500/25 text-emerald-400',
    purple: 'from-violet-500/15 to-violet-600/5 border-violet-500/25 text-violet-400',
    yellow: 'from-yellow-500/15 to-yellow-600/5 border-yellow-500/25 text-yellow-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-extrabold text-white">{value ?? '—'}</span>
      </div>
      <p className="text-sm font-semibold text-white">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-7 animate-fade-up">
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Admin Console</p>
        <h1 className="page-title mt-1">Dashboard Overview</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard label="Total Students"   value={stats?.totalStudents}   icon="👥" sublabel="Registered accounts" color="blue" />
          <StatCard label="Total Interviews" value={stats?.totalInterviews} icon="💼" sublabel="Across all students"  color="green" />
          <StatCard label="Mock Tests Taken" value={stats?.totalMockTests}  icon="🧪" sublabel="Submitted attempts"  color="purple" />
        </div>
      )}

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: '👥', title: 'Manage Students',       desc: 'View, search, and remove student accounts',      href: '/admin/students' },
          { emoji: '➕', title: 'Add Mock Questions',    desc: 'Create aptitude questions for student tests',     href: '/admin/mocktest' },
          { emoji: '📋', title: 'Interview Records',     desc: 'Browse all student interview submissions',        href: '/admin/interviews' },
        ].map(c => (
          <a key={c.title} href={c.href}
            className="card hover:border-violet-500/30 transition-colors duration-200 group cursor-pointer block">
            <span className="text-2xl">{c.emoji}</span>
            <p className="text-sm font-semibold text-white mt-3 group-hover:text-violet-300 transition-colors">{c.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.desc}</p>
          </a>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">System Online</p>
            <p className="text-xs text-slate-500 mt-0.5">All services are running. Backend at <span className="font-mono text-slate-400">localhost:5000</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
