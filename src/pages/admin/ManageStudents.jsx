import { useState, useEffect } from 'react'
import { getAdminStudents, deleteStudent } from '../../services/api'
import { useToast } from '../../components/Toast'
import ToastContainer from '../../components/Toast'

export default function ManageStudents() {
  const { toasts, toast } = useToast()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const fetchStudents = async () => {
    try {
      const res = await getAdminStudents()
      setStudents(res.data || [])
    } catch { setStudents([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await deleteStudent(id)
      toast('Student removed successfully.', 'success')
      setStudents(prev => prev.filter(s => s._id !== id))
    } catch {
      toast('Failed to delete student.', 'error')
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  const filtered = students.filter(s =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Manage Students</h1>
            <p className="text-slate-400 text-sm mt-1">{students.length} registered students</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, department…" className="input-field pl-9 text-sm" />
        </div>

        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">👥</div>
              <p className="text-slate-400 text-sm font-medium">No students found</p>
              <p className="text-slate-600 text-xs mt-1">Students will appear here after registering</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="table-th rounded-tl-2xl">#</th>
                    <th className="table-th">Name</th>
                    <th className="table-th">Email</th>
                    <th className="table-th">Department</th>
                    <th className="table-th">Year</th>
                    <th className="table-th rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s._id || i} className="hover:bg-slate-700/20 transition-colors">
                      <td className="table-td text-slate-500 text-xs font-mono">{i + 1}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-brand-400">{s.name?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                          <span className="font-medium text-white text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="table-td text-slate-400 text-xs font-mono">{s.email}</td>
                      <td className="table-td">
                        <span className="badge badge-blue">{s.department || '—'}</span>
                      </td>
                      <td className="table-td text-slate-400">{s.year || '—'}</td>
                      <td className="table-td">
                        {confirmId === s._id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-colors">
                              {deleting === s._id ? '…' : 'Confirm'}
                            </button>
                            <button onClick={() => setConfirmId(null)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:text-white transition-colors">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(s._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
