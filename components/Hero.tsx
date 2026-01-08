import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-grid-slate-100 border-b border-slate-100">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-700 mb-6 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
          <i className="fas fa-microchip animate-pulse"></i>
          Next-Gen Security Management
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
          Vom Posten zum <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800">Process Architect</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
          Die Fusion von <strong>operativer Härte (§ 34a)</strong> und 
          <strong> digitaler Präzision (AI & Data)</strong>. Ich transformiere Liegenschaftsschutz 
          von reaktiver Überwachung in proaktive Datenintelligenz.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <i className="fas fa-certificate text-lg"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Portfolio</div>
              <div className="text-sm font-extrabold text-slate-800">61+ Zertifikate</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
              <i className="fas fa-shield-halved text-lg"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Sicherheit</div>
              <div className="text-sm font-extrabold text-slate-800">VS-NfD Konform</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
              <i className="fas fa-code-branch text-lg"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Methodik</div>
              <div className="text-sm font-extrabold text-slate-800">AI Frameworks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;