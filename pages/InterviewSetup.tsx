
import React, { useState } from 'react';
import { INTERVIEW_TYPES } from '../constants';

interface Props {
  onStart: (role: string) => void;
}

const InterviewSetup: React.FC<Props> = ({ onStart }) => {
  const [role, setRole] = useState(INTERVIEW_TYPES[0]);

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 fade-in">
      <div className="glass-dark p-16 rounded-[4rem] shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Colorful ambient blurs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full"></div>
        
        <div className="flex items-center gap-6 mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl">
            01
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Configuration</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Prepare the environment</p>
          </div>
        </div>

        <div className="mb-16">
          <label className="block text-slate-500 font-black uppercase tracking-widest text-xs mb-8">Target Domain</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INTERVIEW_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setRole(t)}
                className={`group py-7 px-8 rounded-[2rem] border-2 text-left transition-all duration-300 relative overflow-hidden ${
                  role === t 
                    ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:text-white'
                }`}
              >
                {role === t && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
                )}
                <div className="flex items-center justify-between relative z-10">
                  <span className={`text-xl font-bold tracking-tight ${role === t ? 'text-indigo-300' : ''}`}>
                    {t}
                  </span>
                  {role === t && <i className="fas fa-circle-check text-indigo-400 text-xl animate-in zoom-in duration-300"></i>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-10 mb-16">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 bg-yellow-400/20 text-yellow-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-yellow-400/10">
              <i className="fas fa-shield-halved text-2xl"></i>
            </div>
            <div>
              <h4 className="text-white font-black text-lg mb-2">Biometric Data Protection</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Your video and audio streams are processed locally for analysis. We only transmit text transcripts to Gemini AI to maintain maximum privacy.
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onStart(role)}
          className="w-full btn-vibrant text-white font-black py-8 rounded-[2rem] shadow-2xl transition-all text-2xl uppercase tracking-[0.2em]"
        >
          Initialize Mission <i className="fas fa-rocket-launch ml-3"></i>
        </button>
      </div>
    </div>
  );
};

export default InterviewSetup;
