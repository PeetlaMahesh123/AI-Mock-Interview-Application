
import React from 'react';
import { InterviewSession } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  history: InterviewSession[];
  onViewResult: (session: InterviewSession) => void;
}

const DashboardPage: React.FC<Props> = ({ history, onViewResult }) => {
  const trendData = [...history].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: s.overallPerformance?.overallScore || 0
  }));

  return (
    <div className="min-h-screen py-24 px-8 fade-in">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-7xl font-black text-white mb-20 tracking-tighter">Command <span className="text-gradient">Center</span></h2>
        
        {history.length === 0 ? (
          <div className="glass-dark p-32 rounded-[5rem] text-center border border-white/10 shadow-3xl">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl animate-bounce">
              <i className="fas fa-rocket-launch text-5xl"></i>
            </div>
            <h3 className="text-5xl font-black text-white mb-6 tracking-tighter">Awaiting First Mission</h3>
            <p className="text-slate-400 mb-14 text-2xl font-medium max-w-2xl mx-auto">No telemetry data recorded. Initialize your first mock interview to begin your trajectory.</p>
            <button className="btn-vibrant text-white font-black py-6 px-16 rounded-[2rem] text-xl">
              Launch Simulator
            </button>
          </div>
        ) : (
          <>
            {/* Summary Row */}
            <div className="grid md:grid-cols-3 gap-12 mb-20">
              {[
                { label: 'Total Missions', val: history.length, color: 'text-indigo-400', grad: 'from-indigo-600/20' },
                { 
                  label: 'Average Mastery', 
                  val: `${Math.round(history.reduce((acc, curr) => acc + (curr.overallPerformance?.overallScore || 0), 0) / history.length)}%`, 
                  color: 'text-purple-400',
                  grad: 'from-purple-600/20'
                },
                { label: 'Latest Trajectory', val: history[0].type.split(' ')[0], color: 'text-pink-400', grad: 'from-pink-600/20' }
              ].map((stat, i) => (
                <div key={i} className={`glass-dark p-14 rounded-[4rem] border border-white/5 relative group hover:border-white/20 transition-all shadow-2xl bg-gradient-to-br ${stat.grad} to-transparent`}>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-6">{stat.label}</p>
                  <p className={`text-7xl font-black ${stat.color} tracking-tighter truncate leading-none`}>{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Performance Trend Chart */}
            <div className="glass-dark p-16 rounded-[4rem] border border-white/10 mb-20 h-[600px] shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2] rotate-[-12deg] pointer-events-none">
                    <i className="fas fa-chart-line text-white"></i>
                </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] text-xs mb-16">Mastery Growth Timeline</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#475569" tick={{fontSize: 12, fontWeight: '800', letterSpacing: '1px'}} />
                  <YAxis domain={[0, 100]} stroke="#475569" tick={{fontSize: 12, fontWeight: '800'}} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '800' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#818cf8" 
                    strokeWidth={6} 
                    fillOpacity={1} 
                    fill="url(#colorScore)"
                    dot={{ r: 10, fill: '#818cf8', strokeWidth: 5, stroke: '#020617' }} 
                    activeDot={{ r: 12, fill: '#fff', strokeWidth: 0 }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Sessions Table */}
            <div className="glass-dark rounded-[4rem] border border-white/10 overflow-hidden shadow-3xl mb-24">
              <div className="p-14 border-b border-white/10 bg-white/5">
                <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] text-xs">Mission Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">
                    <tr>
                      <th className="px-14 py-8">Trajectory</th>
                      <th className="px-14 py-8">Timestamp</th>
                      <th className="px-14 py-8 text-right">Mastery Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((s) => (
                      <tr key={s.id} className="hover:bg-indigo-500/5 transition-all group">
                        <td className="px-14 py-10">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                              <i className="fas fa-satellite-dish text-xl"></i>
                            </div>
                            <span className="font-black text-white text-2xl tracking-tight">{s.type}</span>
                          </div>
                        </td>
                        <td className="px-14 py-10 text-slate-400 font-bold text-lg">{new Date(s.date).toLocaleDateString()}</td>
                        <td className="px-14 py-10 text-right">
                          <div className="flex items-center justify-end gap-10">
                            <span className={`text-4xl font-black tracking-tighter ${
                              (s.overallPerformance?.overallScore || 0) > 80 ? 'text-emerald-400' :
                              (s.overallPerformance?.overallScore || 0) > 60 ? 'text-indigo-400' : 'text-pink-400'
                            }`}>
                              {s.overallPerformance?.overallScore}%
                            </span>
                            <button 
                              onClick={() => onViewResult(s)}
                              className="bg-white/5 hover:bg-white/10 text-white font-black px-10 py-4 rounded-2xl border border-white/10 transition-all text-sm uppercase tracking-[0.2em] group-hover:border-indigo-500/50"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
