import { useState } from 'react'
import { addMockQuestion } from '../../services/api'
import { useToast } from '../../components/Toast'
import ToastContainer from '../../components/Toast'

const CORRECT_OPTIONS = ['A', 'B', 'C', 'D']
const empty = () => ({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' })

export default function AddMockQuestion() {
  const { toasts, toast } = useToast()
  const [form, setForm]       = useState(empty())
  const [submitting, setSubmitting] = useState(false)
  const [added, setAdded]     = useState(0)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.correctAnswer) { toast('Please select the correct answer.', 'error'); return }
    setSubmitting(true)
    try {
      await addMockQuestion(form)
      toast('Question added successfully!', 'success')
      setForm(empty())
      setAdded(n => n + 1)
    } catch {
      toast('Failed to add question.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="max-w-2xl space-y-6 animate-fade-up">
        <div>
          <h1 className="page-title">Add Mock Test Question</h1>
          <p className="text-slate-400 text-sm mt-1">Create aptitude questions for students</p>
        </div>

        {added > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            {added} question{added > 1 ? 's' : ''} added this session
          </div>
        )}

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-5">Question Form</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Question text */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Question</label>
              <textarea name="question" value={form.question} onChange={handleChange} rows={3} required
                placeholder="Enter the aptitude question here…"
                className="input-field resize-none" />
            </div>

            {/* Options */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-3">Answer Options</label>
              <div className="space-y-2.5">
                {CORRECT_OPTIONS.map(opt => (
                  <div key={opt} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors
                      ${form.correctAnswer === opt
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-600 text-slate-500'}`}>
                      {opt}
                    </span>
                    <input
                      name={`option${opt}`}
                      value={form[`option${opt}`]}
                      onChange={handleChange}
                      required
                      placeholder={`Option ${opt}`}
                      className="input-field flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct answer */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Correct Answer</label>
              <div className="flex gap-2">
                {CORRECT_OPTIONS.map(opt => (
                  <button type="button" key={opt}
                    onClick={() => setForm(f => ({ ...f, correctAnswer: opt }))}
                    className={`w-11 h-11 rounded-xl border-2 font-bold text-sm transition-all duration-150
                      ${form.correctAnswer === opt
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400'
                        : 'border-slate-600 text-slate-500 hover:border-slate-400'}`}>
                    {opt}
                  </button>
                ))}
              </div>
              {form.correctAnswer && (
                <p className="text-xs text-emerald-400 mt-2">✓ Option {form.correctAnswer} selected as correct</p>
              )}
            </div>

            <button type="submit" disabled={submitting}
              className="btn-primary flex items-center gap-2 bg-violet-600 hover:bg-violet-700 shadow-violet-500/20">
              {submitting
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Question
                  </>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
