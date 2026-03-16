import { useState } from 'react'
import { addInterview } from '../../services/api'
import { useToast } from '../../components/Toast'
import ToastContainer from '../../components/Toast'

const rounds   = ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR Round', 'Managerial Round', 'Group Discussion', 'Final Round']
const results  = ['Pending', 'Selected', 'Rejected']

export default function InterviewTracker() {
  const { toasts, toast } = useToast()
  const [form, setForm] = useState({
    company: '', date: new Date().toISOString().split('T')[0],
    round: '', result: 'Pending', feedback: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addInterview(form)
      toast('Interview logged successfully!', 'success')
      setForm({ company: '', date: new Date().toISOString().split('T')[0], round: '', result: 'Pending', feedback: '' })
    } catch {
      toast('Failed to log interview.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const resultStyles = {
    Selected: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    Rejected: 'bg-red-500/10 border-red-500/25 text-red-400',
    Pending:  'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
  }

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="max-w-2xl space-y-6 animate-fade-up">
        <div>
          <h1 className="page-title">Interview Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Log a new interview and track your progress</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/8 border border-brand-500/20 text-brand-300 text-sm">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Log each round separately. View all records in <strong className="text-white">Interview History</strong>.
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-5">New Interview Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name</label>
                <input name="company" value={form.company} onChange={handleChange} required
                  placeholder="e.g. Google, TCS, Infosys" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Interview Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Interview Round</label>
              <select name="round" value={form.round} onChange={handleChange} required className="input-field">
                <option value="">Select round</option>
                {rounds.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Result selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Result</label>
              <div className="flex gap-2 flex-wrap">
                {results.map(r => (
                  <button type="button" key={r}
                    onClick={() => setForm(f => ({ ...f, result: r }))}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150
                      ${form.result === r ? resultStyles[r] : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Feedback / Notes</label>
              <textarea name="feedback" value={form.feedback} onChange={handleChange} rows={4}
                placeholder="What went well? What could be improved? Questions asked…"
                className="input-field resize-none" />
            </div>

            <button type="submit" disabled={submitting}
              className="btn-primary flex items-center gap-2">
              {submitting
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Log Interview
                  </>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
