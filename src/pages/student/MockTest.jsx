import { useState, useEffect } from 'react'
import { getMockTests, submitMockTest } from '../../services/api'

const OPTIONS = ['A', 'B', 'C', 'D']

export default function MockTest() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')

  useEffect(() => {
    getMockTests()
      .then(res => setQuestions(res.data || []))
      .catch(() => setError('Could not load mock test questions.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const payload = { answers: questions.map((q, i) => ({ questionId: q._id || i, selected: answers[i] })) }
      const res = await submitMockTest(payload)
      setResult(res.data)
    } catch {
      setError('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetTest = () => { setAnswers({}); setResult(null); setError('') }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Score result screen
  if (result) {
    const pct = Math.round((result.score / result.total) * 100)
    const grade = pct >= 80 ? { label: 'Excellent!', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' }
                : pct >= 60 ? { label: 'Good Job!',  color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/25' }
                :             { label: 'Keep Going!', color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/25' }
    return (
      <div className="max-w-md mx-auto animate-fade-up mt-8">
        <div className={`card border text-center py-10 ${grade.bg}`}>
          <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
          <h2 className={`text-3xl font-extrabold mb-1 ${grade.color}`}>{grade.label}</h2>
          <p className="text-slate-400 text-sm mb-6">Test completed</p>
          <div className="text-5xl font-extrabold text-white mb-1">{pct}%</div>
          <p className="text-slate-400 text-sm">
            {result.score} / {result.total} correct answers
          </p>
          {/* Progress bar */}
          <div className="mt-6 bg-slate-700/60 rounded-full h-2.5 mx-4">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700"
              style={{ width: `${pct}%` }} />
          </div>
          <button onClick={resetTest} className="btn-primary mt-8">
            Take Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Mock Test</h1>
          <p className="text-slate-400 text-sm mt-1">{questions.length} aptitude questions · Select the best answer</p>
        </div>
        <div className="shrink-0 card py-2.5 px-4 text-center">
          <p className="text-lg font-extrabold text-white">{Object.keys(answers).length}<span className="text-slate-500 font-normal">/{questions.length}</span></p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Answered</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">🧪</div>
          <p className="text-slate-400 text-sm font-medium">No mock test questions available</p>
          <p className="text-slate-600 text-xs mt-1">Ask your admin to add questions</p>
        </div>
      ) : (
        <>
          <div className="space-y-5">
            {questions.map((q, qi) => (
              <div key={q._id || qi} className="card">
                <div className="flex items-start gap-3 mb-4">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-bold flex items-center justify-center">
                    {qi + 1}
                  </span>
                  <p className="text-sm font-medium text-white leading-relaxed pt-0.5">{q.question}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-10">
                  {OPTIONS.map(opt => {
                    const val = q[`option${opt}`]
                    if (!val) return null
                    const selected = answers[qi] === opt
                    return (
                      <button key={opt} onClick={() => handleSelect(qi, opt)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm text-left transition-all duration-150
                          ${selected
                            ? 'bg-brand-500/15 border-brand-500/40 text-white'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:border-slate-500/60 hover:text-white'}`}>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors
                          ${selected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-600 text-slate-500'}`}>
                          {opt}
                        </span>
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="btn-primary flex items-center gap-2 text-sm px-7 py-3">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</>
              : <>Submit Test <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>}
          </button>
        </>
      )}
    </div>
  )
}
