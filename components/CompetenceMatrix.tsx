import React, { useState } from 'react';
import { COMPETENCE_DATA } from '../constants';
import { CompetenceItem } from '../types';

const CompetenceMatrix: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(COMPETENCE_DATA[0].id);

  const activeData = COMPETENCE_DATA.find((item) => item.id === activeTabId) as CompetenceItem;
  const isVsNfdRelevant = activeData.certs.some(c => c.includes('VS-NfD')) || activeData.desc.includes('VS-NfD');

  return (
    <div className="mb-32 reveal-on-scroll">
      <div className="mb-10 border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-grip text-blue-600 text-[10px]"></i>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Skill Architecture</span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kompetenz-Matrix</h3>
          <p className="text-slate-500 mt-1 max-w-xl">
            Meine Qualifikationen sind strategisch darauf ausgelegt, Sicherheitsabläufe durch Technologie zu veredeln.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span> Standard
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500"></span> VS-NfD Level
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <nav className="flex flex-col p-2 space-y-1">
              {COMPETENCE_DATA.map((item) => {
                const itemVsNfd = item.certs.some(c => c.includes('VS-NfD'));
                const isActive = item.id === activeTabId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabId(item.id)}
                    className={`w-full text-left px-5 py-5 rounded-2xl transition-all flex items-center justify-between group relative ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center z-10">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <i className={`fas ${item.icon} text-lg`}></i>
                      </div>
                      <div className="font-extrabold text-xs uppercase tracking-widest">{item.title}</div>
                    </div>
                    {itemVsNfd && (
                      <div className={`h-2 w-2 rounded-full bg-red-500 relative z-10 ${isActive ? 'shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'opacity-40'}`}></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 min-h-[480px] flex flex-col relative overflow-hidden transition-all duration-500">
            {isVsNfdRelevant && (
              <div className="absolute top-0 right-0">
                <div className="bg-red-600 text-white text-[9px] font-black px-5 py-2 flex items-center gap-2 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg animate-in slide-in-from-right duration-500">
                  <i className="fas fa-shield-halved animate-pulse"></i>
                  VS-NfD Secure Mode
                </div>
              </div>
            )}
            
            <div key={activeTabId} className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-inner">
                  <i className={`fas ${activeData.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activeData.title}</h3>
                  <div className="h-1 w-20 bg-blue-600 rounded-full mt-1"></div>
                </div>
              </div>
              
              <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                {activeData.desc}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <i className="fas fa-award text-blue-500"></i> Zertifizierungen
                  </h4>
                  <ul className="space-y-3">
                    {activeData.certs.map((cert, idx) => (
                      <li key={idx} className="text-sm font-semibold flex items-center text-slate-700 bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                        <i className={`fas fa-check-circle ${cert.includes('VS-NfD') ? 'text-red-500' : 'text-blue-500'} mr-3 text-lg opacity-70`}></i> 
                        <span className="leading-snug">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <i className="fas fa-microchip text-blue-500"></i> Deployment Stack
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {activeData.tools.map((tool, idx) => (
                      <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-default">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 text-white p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-bolt-lightning"></i>
                </div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Core Value Proposition</h4>
                <p className="text-xl md:text-2xl font-extrabold italic leading-tight text-blue-50">
                  "{activeData.valueAdd}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetenceMatrix;