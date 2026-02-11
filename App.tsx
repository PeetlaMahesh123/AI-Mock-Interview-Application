
import React, { useState, useEffect } from 'react';
import { AppView, InterviewSession, InterviewQuestion } from './types';
import LandingPage from './pages/LandingPage';
import InterviewSetup from './pages/InterviewSetup';
import InterviewPage from './pages/InterviewPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LANDING');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [selectedRole, setSelectedRole] = useState('General HR');
  const [history, setHistory] = useState<InterviewSession[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aceit_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newSession: InterviewSession) => {
    const updated = [newSession, ...history];
    setHistory(updated);
    localStorage.setItem('aceit_history', JSON.stringify(updated));
  };

  const startInterview = (role: string) => {
    setSelectedRole(role);
    setSession({
      id: Math.random().toString(36).substr(2, 9),
      type: role,
      date: new Date().toISOString(),
      answers: []
    });
    setView('INTERVIEW');
  };

  const finishInterview = (finalSession: InterviewSession) => {
    setSession(finalSession);
    saveToHistory(finalSession);
    setView('RESULT');
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation Header */}
      <header className="glass-dark border-b border-white/10 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setView('LANDING')}
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
            <i className="fas fa-rocket text-xl"></i>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            ACE<span className="text-indigo-400">IT</span>
          </h1>
        </div>
        <nav className="flex items-center gap-8">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`text-sm font-bold tracking-wide transition-colors ${view === 'DASHBOARD' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
          >
            DASHBOARD
          </button>
          <button 
            onClick={() => setView('LANDING')}
            className={`text-sm font-bold tracking-wide transition-colors ${view === 'LANDING' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
          >
            EXPLORE
          </button>
          <button 
            onClick={() => setView('SETUP')}
            className="btn-vibrant px-6 py-2 rounded-full text-sm font-bold text-white"
          >
            START NOW
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {view === 'LANDING' && <LandingPage onStart={() => setView('SETUP')} />}
        {view === 'SETUP' && <InterviewSetup onStart={startInterview} />}
        {view === 'INTERVIEW' && session && (
          <InterviewPage 
            session={session} 
            role={selectedRole}
            onComplete={finishInterview} 
          />
        )}
        {view === 'RESULT' && session && (
          <ResultPage 
            session={session} 
            onRestart={() => setView('SETUP')} 
          />
        )}
        {view === 'DASHBOARD' && (
          <DashboardPage 
            history={history} 
            onViewResult={(s) => { setSession(s); setView('RESULT'); }}
          />
        )}
      </main>

      <footer className="glass-dark border-t border-white/5 py-8 px-8 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ACEIT AI. Built with the power of Gemini.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
