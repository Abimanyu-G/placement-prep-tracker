import { useState, useEffect } from 'react'
import { getPreparations, addPreparation } from '../../services/api'
import { useToast } from '../../components/Toast'
import ToastContainer from '../../components/Toast'

const platforms = ['LeetCode', 'HackerRank', 'CodeChef', 'Codeforces', 'GeeksforGeeks', 'InterviewBit', 'HackerEarth', 'Other']

export default function PreparationTracker() {
  const { toasts, toast } = useToast()
  const [logs, setLogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ topic: '', platform: '', problemsSolved: '', date: new Date().toISOString().split('T')[0] })

  const fetchLogs = async () => {
    try {
      const res = await getPreparations()
      setLogs(res.data || [])
    } catch { setLogs([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLogs() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addPreparation(form)
      toast('Preparation log added!', 'success')
      setForm({ topic: '', platform: '', problemsSolved: '', date: new Date().toISOString().split('T')[0] })
      fetchLogs()
    } catch {
      toast('Failed to add log.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const totalProblems = logs.reduce((s, l) => s + (Number(l.problemsSolved) || 0), 0)

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6 animate-fade-up">
        <div>
          <h1 className="page-title">Preparation Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Log your daily coding practice and study sessions</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Sessions',  value: logs.length,   icon: '📝', color: 'text-brand-400' },
            { label: 'Problems Solved', value: totalProblems, icon: '✅', color: 'text-emerald-400' },
            { label: 'Platforms Used',  value: [...new Set(logs.map(l => l.platform))].length, icon: '🌐', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-extrabold mt-2 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 card h-fit">
            <h2 className="text-sm font-semibold text-white mb-5">Log Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Topic Name</label>
                <input name="topic" value={form.topic} onChange={handleChange} required
                  placeholder="e.g. Dynamic Programming" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform Used</label>
                <select name="platform" value={form.platform} onChange={handleChange} required className="input-field">
                  <option value="">Select platform</option>
                  {platforms.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Problems Solved</label>
                <input name="problemsSolved" type="number" min="1" value={form.problemsSolved} onChange={handleChange} required
                  placeholder="e.g. 5" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required className="input-field" />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex items-center gap-2">
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</>
                  : <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Log
                    </>}
              </button>
            </form>
          </div>

          {/* Log list */}
          <div className="lg:col-span-3 card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Previous Logs</h2>
              <span className="text-xs text-slate-500">{logs.length} entries</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-slate-400 text-sm font-medium">No logs yet</p>
                <p className="text-slate-600 text-xs mt-1">Start logging your preparation activity</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {logs.map((log, i) => (
                  <div key={log._id || i} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{log.topic}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="badge badge-blue">{log.platform}</span>
                        <span className="text-xs text-slate-500">{log.problemsSolved} problems</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono shrink-0 ml-3 mt-0.5">
                      {log.date ? new Date(log.date).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
