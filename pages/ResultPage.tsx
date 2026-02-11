
import React from 'react';
import { InterviewSession } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  session: InterviewSession;
  onRestart: () => void;
}

const ResultPage: React.FC<Props> = ({ session, onRestart }) => {
  const perf = session.overallPerformance;
  if (!perf) return null;

  const chartData = [
    { subject: 'Poise', A: perf.confidenceScore, fullMark: 100 },
    { subject: 'Impact', A: perf.clarityScore, fullMark: 100 },
    { subject: 'Depth', A: perf.technicalDepthScore, fullMark: 100 },
    { subject: 'Growth', A: perf.overallScore, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen py-24 px-8 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-12">
          <div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9]">Session <span className="text-gradient">Debrief</span></h2>
            <div className="flex items-center gap-6">
                <span className="bg-indigo-600/20 text-indigo-400 px-6 py-2 rounded-full text-sm font-black border border-indigo-500/20 shadow-xl">{session.type}</span>
                <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">{new Date(session.date).toLocaleDateString()}</span>
            </div>
          </div>
          <button 
            onClick={onRestart}
            className="btn-vibrant text-white font-black py-6 px-16 rounded-[2rem] shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all uppercase tracking-widest text-lg"
          >
            Restart Simulation
          </button>
        </div>

        {/* Top Score Cards */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-5 glass-dark p-16 rounded-[4rem] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-3xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"></div>
            <div className="relative w-72 h-72 flex items-center justify-center mb-10 transition-transform duration-700 group-hover:scale-110">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="24" fill="transparent" className="text-white/5" />
                 <circle 
                  cx="144" cy="144" r="120" stroke="url(#gradientScore)" strokeWidth="24" fill="transparent" 
                  strokeDasharray={754} 
                  strokeDashoffset={754 - (754 * perf.overallScore) / 100}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_25px_rgba(129,140,248,0.8)]" 
                />
                <defs>
                    <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-8xl font-black text-white leading-none tracking-tighter">{perf.overallScore}</span>
                 <span className="text-indigo-400 font-black text-xl tracking-[0.3em] uppercase mt-2">Score</span>
               </div>
            </div>
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.4em] text-center">Mastery Index</h3>
          </div>

          <div className="lg:col-span-7 glass-dark p-16 rounded-[4rem] border border-white/10 h-[600px] shadow-3xl relative">
            <h3 className="font-black text-indigo-400 uppercase tracking-[0.4em] text-xs mb-14">Cognitive Profile Matrix</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: '800', letterSpacing: '1px' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                    name="Candidate" 
                    dataKey="A" 
                    stroke="#ec4899" 
                    strokeWidth={4}
                    fill="url(#radarGradient)" 
                    fillOpacity={0.6} 
                />
                <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/60 p-16 rounded-[4rem] border border-emerald-500/20 group hover:border-emerald-500/40 transition-all shadow-2xl">
            <h3 className="text-4xl font-black text-emerald-400 mb-10 flex items-center gap-5 tracking-tighter">
              <i className="fas fa-circle-check"></i> Key Strengths
            </h3>
            <ul className="space-y-8">
              {perf.strengths.map((s, i) => (
                <li key={i} className="flex gap-6 text-slate-200 text-xl font-medium leading-relaxed group-hover:translate-x-2 transition-transform">
                  <span className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-1"><i className="fas fa-plus text-xs"></i></span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-pink-900/40 to-slate-900/60 p-16 rounded-[4rem] border border-pink-500/20 group hover:border-pink-500/40 transition-all shadow-2xl">
            <h3 className="text-4xl font-black text-pink-400 mb-10 flex items-center gap-5 tracking-tighter">
              <i className="fas fa-circle-xmark"></i> Growth Areas
            </h3>
            <ul className="space-y-8">
              {perf.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-6 text-slate-200 text-xl font-medium leading-relaxed group-hover:translate-x-2 transition-transform">
                  <span className="w-8 h-8 bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center shrink-0 mt-1"><i className="fas fa-minus text-xs"></i></span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-indigo-800/60 via-purple-900/60 to-slate-950 p-20 rounded-[5rem] mb-24 relative overflow-hidden border border-white/10 shadow-3xl">
          <div className="absolute top-0 right-0 p-24 opacity-5 scale-[2] rotate-12 pointer-events-none">
            <i className="fas fa-brain-circuit text-white"></i>
          </div>
          <h3 className="text-4xl font-black mb-12 flex items-center gap-6 text-indigo-300 tracking-tighter uppercase">
             <i className="fas fa-robot-astromech"></i> AI Strategic Review
          </h3>
          <p className="text-slate-100 text-3xl leading-[1.3] mb-16 max-w-6xl font-bold tracking-tight">
            {perf.summary}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {perf.tipsForImprovement.map((tip, i) => (
              <div key={i} className="glass-dark p-12 rounded-[3rem] border border-white/10 hover:border-indigo-500/40 transition-all shadow-xl">
                <p className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-[0.4em]">Protocol {i+1}</p>
                <p className="text-xl text-slate-200 leading-relaxed font-bold tracking-tight">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
