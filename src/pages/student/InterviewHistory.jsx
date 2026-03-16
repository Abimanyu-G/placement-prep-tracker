import { useState, useEffect } from 'react'
import { getInterviews } from '../../services/api'

function ResultBadge({ result }) {
  const map = { Selected: 'badge-green', Rejected: 'badge-red', Pending: 'badge-yellow' }
  return <span className={`badge ${map[result] || 'badge-blue'}`}>{result}</span>
}

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('All')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    getInterviews()
      .then(res => setInterviews(res.data || []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = interviews.filter(iv => {
    const matchFilter = filter === 'All' || iv.result === filter
    const matchSearch = !search || iv.company?.toLowerCase().includes(search.toLowerCase()) || iv.round?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    All: interviews.length,
    Selected: interviews.filter(i => i.result === 'Selected').length,
    Pending:  interviews.filter(i => i.result === 'Pending').length,
    Rejected: interviews.filter(i => i.result === 'Rejected').length,
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="page-title">Interview History</h1>
        <p className="text-slate-400 text-sm mt-1">All your logged interview rounds</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',    count: counts.All,      color: 'text-white',         icon: '📋' },
          { label: 'Selected', count: counts.Selected, color: 'text-emerald-400',   icon: '✅' },
          { label: 'Pending',  count: counts.Pending,  color: 'text-yellow-400',    icon: '⏳' },
          { label: 'Rejected', count: counts.Rejected, color: 'text-red-400',       icon: '❌' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="text-lg">{s.icon}</span>
            <p className={`text-xl font-extrabold mt-2 ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search company or round…" className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Selected', 'Pending', 'Rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
                ${filter === f
                  ? 'bg-brand-500/15 border-brand-500/35 text-brand-400'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}>
              {f} <span className="ml-1 text-[10px] opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🕐</div>
            <p className="text-slate-400 text-sm font-medium">No interviews found</p>
            <p className="text-slate-600 text-xs mt-1">
              {interviews.length === 0 ? 'Log your first interview in Interview Tracker' : 'Try adjusting the filter or search'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="table-th rounded-tl-2xl">Company</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Round</th>
                  <th className="table-th">Result</th>
                  <th className="table-th rounded-tr-2xl">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((iv, i) => (
                  <tr key={iv._id || i} className="hover:bg-slate-700/20 transition-colors group">
                    <td className="table-td font-semibold text-white">{iv.company}</td>
                    <td className="table-td font-mono text-xs">{iv.date ? new Date(iv.date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="table-td">{iv.round}</td>
                    <td className="table-td"><ResultBadge result={iv.result} /></td>
                    <td className="table-td max-w-xs">
                      <span className="text-slate-400 text-xs line-clamp-2">{iv.feedback || <span className="text-slate-600">—</span>}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
