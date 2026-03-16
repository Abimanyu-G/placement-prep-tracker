import { useState, useEffect } from 'react'
import { getDashboardStats, getInterviews } from '../../services/api'
import { useAuth } from '../../components/AuthContext'

function StatCard({ label, value, icon, color }) {
  const colors = {
    blue:   'from-brand-500/15 to-brand-600/5 border-brand-500/25 text-brand-400',
    green:  'from-emerald-500/15 to-emerald-600/5 border-emerald-500/25 text-emerald-400',
    yellow: 'from-yellow-500/15 to-yellow-600/5 border-yellow-500/25 text-yellow-400',
    purple: 'from-violet-500/15 to-violet-600/5 border-violet-500/25 text-violet-400',
  }
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-extrabold text-white">{value ?? '—'}</span>
      </div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
    </div>
  )
}

function ResultBadge({ result }) {
  const map = {
    Selected: 'badge-green',
    Rejected: 'badge-red',
    Pending:  'badge-yellow',
  }
  return <span className={`badge ${map[result] || 'badge-blue'}`}>{result}</span>
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats]       = useState(null)
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, iRes] = await Promise.all([getDashboardStats(), getInterviews()])
        setStats(sRes.data)
        setInterviews(iRes.data?.slice(0, 5) || [])
      } catch { /* backend not connected — show empty state */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-slate-400 text-sm">{greeting()},</p>
        <h1 className="page-title mt-0.5">{user?.name || 'Student'} 👋</h1>
      </div>

      {/* Stat cards */}
      <div className="animate-fade-up delay-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Interviews Attended"  value={stats?.totalInterviews}   icon="💼" color="blue" />
        <StatCard label="Mock Tests Taken"     value={stats?.totalMockTests}    icon="🧪" color="green" />
        <StatCard label="Avg Mock Score"       value={stats?.avgMockScore != null ? `${stats.avgMockScore}%` : null} icon="📊" color="yellow" />
        <StatCard label="Topics Practiced"     value={stats?.totalPreparations} icon="📚" color="purple" />
      </div>

      {/* Recent interviews */}
      <div className="animate-fade-up delay-200 card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Recent Interview Activity</h2>
          <span className="text-xs text-slate-500">{interviews.length} entries</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💼</div>
            <p className="text-slate-400 text-sm font-medium">No interviews logged yet</p>
            <p className="text-slate-600 text-xs mt-1">Add your first interview in the Interview Tracker</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="table-th rounded-l-lg">Company</th>
                  <th className="table-th">Round</th>
                  <th className="table-th">Date</th>
                  <th className="table-th rounded-r-lg">Result</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv, i) => (
                  <tr key={iv._id || i} className="hover:bg-slate-700/20 transition-colors">
                    <td className="table-td font-medium text-white">{iv.company}</td>
                    <td className="table-td">{iv.round}</td>
                    <td className="table-td font-mono text-xs">{iv.date ? new Date(iv.date).toLocaleDateString() : '—'}</td>
                    <td className="table-td"><ResultBadge result={iv.result} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="animate-fade-up delay-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/20">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">💡 Tip of the day</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Consistency beats intensity. Solve 2–3 problems daily rather than cramming before an interview.
          </p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">🎯 Today's goal</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Log your preparation activity and take at least one mock test to track your progress.
          </p>
        </div>
      </div>
    </div>
  )
}
