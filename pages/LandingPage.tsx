
import React from 'react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center fade-in">
      {/* Hero Section */}
      <section className="w-full py-32 px-6 flex flex-col items-center text-center overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full -z-10 animate-pulse"></div>
        
        <div className="relative mb-6">
          <span className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-indigo-300 text-sm font-bold tracking-widest uppercase">
            Powered by Gemini 3 Flash
          </span>
        </div>

        <h2 className="text-7xl md:text-9xl font-black mb-8 max-w-5xl leading-[0.95] tracking-tighter">
          Crush your <span className="text-gradient">Interviews</span> with AI.
        </h2>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-3xl font-medium leading-relaxed">
          Master behavioral and technical sessions with real-time analysis, linguistic feedback, and advanced growth metrics. 
          <span className="text-slate-200 block mt-2">The future of career preparation is here.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={onStart}
            className="btn-vibrant text-white font-extrabold py-6 px-16 rounded-[2rem] shadow-2xl transition-all transform hover:scale-105 text-xl tracking-tight"
          >
            Get Started Free <i className="fas fa-arrow-right ml-3"></i>
          </button>
          <button className="glass-dark hover:bg-white/10 text-white font-extrabold py-6 px-16 rounded-[2rem] transition-all text-xl border border-white/20">
            Watch Story <i className="fas fa-play-circle ml-3 text-pink-400"></i>
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl w-full py-32 px-6 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "fa-microphone-lines",
            title: "Voice Analysis",
            desc: "Advanced NLP breakdown of your clarity, vocabulary, and confidence levels.",
            color: "from-indigo-500 to-blue-400",
            glow: "shadow-indigo-500/20"
          },
          {
            icon: "fa-bolt-lightning",
            title: "Hyper-Realism",
            desc: "Aggressive HR mode and pressure testing to ensure you're ready for anything.",
            color: "from-purple-500 to-pink-500",
            glow: "shadow-purple-500/20"
          },
          {
            icon: "fa-chart-simple",
            title: "Performance IQ",
            desc: "Visualize your mastery over time with beautiful interactive data visualizations.",
            color: "from-pink-500 to-orange-400",
            glow: "shadow-pink-500/20"
          }
        ].map((f, i) => (
          <div key={i} className={`glass-dark p-12 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all group hover:-translate-y-3 ${f.glow} shadow-2xl`}>
            <div className={`w-20 h-20 bg-gradient-to-br ${f.color} text-white rounded-[2rem] flex items-center justify-center mb-10 shadow-xl group-hover:rotate-6 transition-transform`}>
              <i className={`fas ${f.icon} text-3xl`}></i>
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium text-lg">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-6 mb-32">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 rounded-[4rem] p-20 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to secure the bag?</h3>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of candidates who used AceIt to land their dream roles at top tech companies.
          </p>
          <button onClick={onStart} className="btn-vibrant text-white font-black py-6 px-16 rounded-[2rem] text-xl">
            Initialize Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
