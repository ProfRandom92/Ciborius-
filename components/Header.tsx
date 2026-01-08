import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4 group cursor-default">
          <div className="h-11 w-11 bg-blue-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Alexander Kölnberger</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">MA #2666</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">Digital Security Ops</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center group">
            <i className="fas fa-map-marker-alt mr-2 text-blue-600 group-hover:animate-bounce"></i>
            Friedrichsfelder Landstr. 34
          </div>
          <div className="flex items-center group">
            <i className="fas fa-university mr-2 text-blue-600 group-hover:scale-110 transition-transform"></i>
            BiFZ Mannheim
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            System Online
          </div>
        </div>

        <button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-xl active:scale-95 w-full md:w-auto uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <i className="fas fa-envelope-open-text text-[14px]"></i>
          Kontakt Intern
        </button>
      </div>
    </header>
  );
};

export default Header;