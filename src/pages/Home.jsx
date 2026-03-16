import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg grid-pattern flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">PlaceTrack</span>
        </div>
        <Link to="/admin/login" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
          Admin Login →
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-5 py-12">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-semibold mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Campus Placement Management System
        </div>

        {/* Title */}
        <h1 className="animate-fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
          Placement Preparation<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">
            & Interview Tracking
          </span>
        </h1>

        <p className="animate-fade-up delay-200 mt-5 text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Track your preparation, take mock tests, log interviews, and land your dream placement — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-300 flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link to="/login" className="btn-primary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Student Login
          </Link>
          <Link to="/register" className="btn-outline flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            Student Register
          </Link>
        </div>

        {/* Feature grid */}
        <div className="animate-fade-up delay-300 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
          {[
            { icon: '📚', title: 'Preparation Tracker', desc: 'Log DSA topics, platforms & problems solved' },
            { icon: '🧪', title: 'Mock Tests',          desc: 'Aptitude tests with instant scoring' },
            { icon: '💼', title: 'Interview Log',       desc: 'Track every round, result & feedback' },
          ].map((f) => (
            <div key={f.title} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-left hover:border-brand-500/30 transition-colors duration-300">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-600">
        © {new Date().getFullYear()} PlaceTrack · Placement Preparation & Interview Tracking System
      </footer>
    </div>
  )
}
