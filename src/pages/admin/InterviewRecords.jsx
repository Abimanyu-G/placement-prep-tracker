import { useState, useEffect } from 'react'
import { getAdminInterviews } from '../../services/api'

function ResultBadge({ result }) {
  const map = { Selected: 'badge-green', Rejected: 'badge-red', Pending: 'badge-yellow' }
  return <span className={`badge ${map[result] || 'badge-blue'}`}>{result}</span>
}

export default function InterviewRecords() {
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')

  useEffect(() => {
    getAdminInterviews()
      .then(res => setRecords(res.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = records.filter(r => {
    const matchFilter = filter === 'All' || r.result === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      r.studentName?.toLowerCase().includes(q) ||
      r.company?.toLowerCase().includes(q) ||
      r.round?.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const counts = {
    All: records.length,
    Selected: records.filter(r => r.result === 'Selected').length,
    Pending:  records.filter(r => r.result === 'Pending').length,
    Rejected: records.filter(r => r.result === 'Rejected').length,
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="page-title">Interview Records</h1>
        <p className="text-slate-400 text-sm mt-1">All student interview submissions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',    count: counts.All,      icon: '📋', color: 'text-white' },
          { label: 'Selected', count: counts.Selected, icon: '✅', color: 'text-emerald-400' },
          { label: 'Pending',  count: counts.Pending,  icon: '⏳', color: 'text-yellow-400' },
          { label: 'Rejected', count: counts.Rejected, icon: '❌', color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className="text-lg">{s.icon}</span>
            <p className={`text-xl font-extrabold mt-2 ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student, company, round…" className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Selected', 'Pending', 'Rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
                ${filter === f
                  ? 'bg-violet-500/15 border-violet-500/35 text-violet-400'
                  : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-400 text-sm font-medium">No interview records found</p>
            <p className="text-slate-600 text-xs mt-1">Records appear when students log interviews</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="table-th rounded-tl-2xl">#</th>
                  <th className="table-th">Student Name</th>
                  <th className="table-th">Company</th>
                  <th className="table-th">Date</th>
                  <th className="table-th">Round</th>
                  <th className="table-th rounded-tr-2xl">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r._id || i} className="hover:bg-slate-700/20 transition-colors">
                    <td className="table-td text-slate-500 text-xs font-mono">{i + 1}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-violet-400">{r.studentName?.[0]?.toUpperCase() || '?'}</span>
                        </div>
                        <span className="font-medium text-white text-sm">{r.studentName || '—'}</span>
                      </div>
                    </td>
                    <td className="table-td font-medium text-white">{r.company}</td>
                    <td className="table-td font-mono text-xs">{r.date ? new Date(r.date).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="table-td text-slate-300">{r.round}</td>
                    <td className="table-td"><ResultBadge result={r.result} /></td>
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
