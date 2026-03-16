import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '../../services/api'
import { useToast } from '../../components/Toast'
import ToastContainer from '../../components/Toast'

const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Other']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export default function Profile() {
  const { toasts, toast } = useToast()
  const [form, setForm] = useState({ name: '', phone: '', department: '', year: '', skills: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    getProfile()
      .then(res => setForm({ ...res.data, skills: res.data.skills || '' }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      toast('Profile updated successfully!', 'success')
    } catch {
      toast('Failed to update profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="max-w-2xl space-y-6 animate-fade-up">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Update your personal information and skills</p>
        </div>

        {/* Avatar card */}
        <div className="card flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center shrink-0">
            <span className="text-2xl font-extrabold text-brand-400">{form.name?.[0]?.toUpperCase() || 'S'}</span>
          </div>
          <div>
            <p className="text-base font-bold text-white">{form.name || 'Student'}</p>
            <p className="text-sm text-slate-400">{form.department || 'Department not set'} · {form.year || 'Year not set'}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-5">Edit Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="Your full name" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
                <select name="department" value={form.department} onChange={handleChange} className="input-field">
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Year of Study</label>
                <select name="year" value={form.year} onChange={handleChange} className="input-field">
                  <option value="">Select year</option>
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Skills</label>
              <textarea name="skills" value={form.skills} onChange={handleChange} rows={4}
                placeholder="e.g. JavaScript, React, Node.js, Python, DSA, SQL…"
                className="input-field resize-none" />
              <p className="text-xs text-slate-600 mt-1">Separate skills with commas</p>
            </div>

            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    Save Changes
                  </>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
