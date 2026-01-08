import React, { useState, useRef, useEffect } from 'react';
import { SCENARIOS } from '../constants';
import { ScenarioType, LogEntry } from '../types';
import { geminiService } from '../services/geminiService';

const ScenarioSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioType>('visitor');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto' | null>(null);
  const [progress, setProgress] = useState(0);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const runSimulation = async (simMode: 'manual' | 'auto') => {
    if (isRunning) return;
    setIsRunning(true);
    setMode(simMode);
    setLogs([]);
    setProgress(0);
    setAiReport(null);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
    setFeedbackComment('');

    const data = SCENARIOS[scenario][simMode];
    
    for (let i = 0; i < data.logs.length; i++) {
      const log = data.logs[i];
      const delay = 300 + Math.random() * 400; 
      await new Promise((resolve) => setTimeout(resolve, delay));
      setLogs((prev) => [...prev, log]);
      setProgress(log.t);
    }

    setProgress(100);
    setIsRunning(false);
  };

  const handleGenerateReport = async () => {
    if (!mode || isRunning) return;
    setIsGeneratingReport(true);
    const scenarioData = SCENARIOS[scenario][mode];
    
    const scenarioDisplayNames: Record<ScenarioType, string> = {
      routine: 'Routinebetrieb',
      visitor: 'Besuchermanagement',
      breach: 'Sicherheitsvorfall',
      logistics: 'Warenannahme & Logistik',
      infrastructure: 'Infrastruktur-Überwachung',
      sabotage: 'Physische Sabotage',
      insider: 'Insider-Bedrohung',
      data_exfiltration: 'Datenabfluss-Versuch'
    };

    const report = await geminiService.generateDailyReport(
      scenarioDisplayNames[scenario],
      mode,
      scenarioData.logs,
      scenarioData.metrics
    );
    setAiReport(report);
    setIsGeneratingReport(false);
    
    setTimeout(() => {
      document.getElementById('ai-report-view')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRating) return;
    
    setIsSubmittingFeedback(true);
    await new Promise(r => setTimeout(r, 800));
    
    console.log('--- USER FEEDBACK LOGGED ---', {
      scenario, mode, rating: feedbackRating, comment: feedbackComment
    });
    
    setIsSubmittingFeedback(false);
    setFeedbackSubmitted(true);
  };

  const activeMetrics = mode ? SCENARIOS[scenario][mode].metrics : null;

  return (
    <section className="mb-32 reveal-on-scroll">
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden text-white border border-slate-800 shadow-blue-900/10">
        <div className="p-6 md:p-12 relative overflow-hidden">
          {/* HUD Background Decorations */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
          
          <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-blue-400 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">Ciborius Ops Center</span>
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight mb-2">Einsatz-Simulator</h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Vergleichen Sie die Effizienz konventioneller Wachabläufe mit digital-optimierten KI-Workflows in Echtzeit.
              </p>
            </div>
            
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-layer-group text-slate-500 text-[10px]"></i>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Szenario wählen</label>
              </div>
              <select 
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioType)}
                disabled={isRunning}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none block w-full lg:w-72 p-3.5 transition-all cursor-pointer hover:bg-slate-700 shadow-inner"
              >
                <optgroup label="Basis-Betrieb" className="bg-slate-900">
                  <option value="routine">Standardbetrieb / Routine</option>
                  <option value="visitor">Zutrittskontrolle / Handwerker</option>
                  <option value="logistics">Warenannahme / Logistik</option>
                </optgroup>
                <optgroup label="Hochrisiko-Szenarien" className="bg-slate-900">
                  <option value="breach">Zaunüberstieg Detektion</option>
                  <option value="sabotage">Infrastruktur-Sabotage</option>
                  <option value="insider">Insider-Bedrohung</option>
                  <option value="data_exfiltration">Datenabfluss (USB/DLP)</option>
                </optgroup>
                <optgroup label="Technik & Wartung" className="bg-slate-900">
                  <option value="infrastructure">IoT-Zustandsüberwachung</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <button 
                  onClick={() => runSimulation('manual')}
                  disabled={isRunning}
                  className={`w-full group bg-slate-800/40 hover:bg-slate-800 border rounded-2xl p-6 text-left transition-all relative overflow-hidden ${mode === 'manual' ? 'border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20' : 'border-slate-800'}`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'manual' ? 'text-amber-400' : 'text-slate-500'}`}>Modus: Analog</span>
                      {mode === 'manual' && isRunning && <i className="fas fa-spinner fa-spin text-amber-500"></i>}
                    </div>
                    <span className={`font-bold text-lg block mb-1 ${mode === 'manual' ? 'text-white' : 'text-slate-300'}`}>Konventionell</span>
                    <div className="text-[11px] text-slate-500 leading-snug">Wachbuch, Funk & Telefon.</div>
                  </div>
                </button>

                <button 
                  onClick={() => runSimulation('auto')}
                  disabled={isRunning}
                  className={`w-full group bg-blue-900/10 hover:bg-blue-900/20 border rounded-2xl p-6 text-left transition-all relative overflow-hidden ${mode === 'auto' ? 'border-blue-500/50 bg-blue-500/10 ring-1 ring-blue-500/20' : 'border-slate-800'}`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'auto' ? 'text-blue-400' : 'text-slate-500'}`}>Modus: Digital</span>
                      {mode === 'auto' && isRunning && <i className="fas fa-circle-notch fa-spin text-blue-500"></i>}
                    </div>
                    <span className={`font-bold text-lg block mb-1 ${mode === 'auto' ? 'text-white' : 'text-slate-300'}`}>Digital Ops</span>
                    <div className="text-[11px] text-slate-400 leading-snug">AI, IoT & Automated Reporting.</div>
                  </div>
                </button>
              </div>
              
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm relative">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <i className="fas fa-microchip text-2xl"></i>
                </div>
                <h4 className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-6 font-black">Performance Delta</h4>
                <div className="space-y-5">
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Latenz</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${mode === 'auto' ? 'w-10 bg-blue-500' : mode === 'manual' ? 'w-full bg-amber-500' : 'w-0'}`}></div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${mode === 'auto' ? 'text-blue-400' : 'text-slate-400'}`}>{activeMetrics?.time || '---'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Compliance</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${mode === 'auto' ? 'w-full bg-green-500' : mode === 'manual' ? 'w-1/2 bg-yellow-500' : 'w-0'}`}></div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${mode === 'auto' ? 'text-green-400' : 'text-slate-400'}`}>{activeMetrics?.compliance || '---'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Effort</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${mode === 'auto' ? 'w-4 bg-blue-400' : mode === 'manual' ? 'w-3/4 bg-red-500' : 'w-0'}`}></div>
                      </div>
                      <span className={`font-mono text-xs font-bold ${mode === 'auto' ? 'text-blue-300' : 'text-slate-400'}`}>{activeMetrics?.effort || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {mode && !isRunning && (
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 border-b-4 border-blue-800 hover:border-blue-700"
                >
                  {isGeneratingReport ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <><i className="fas fa-shield-halved"></i> Report generieren</>
                  )}
                </button>
              )}
            </div>

            <div className="lg:col-span-8 group/terminal">
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-slate-800 font-mono-terminal text-[13px] relative flex flex-col h-[460px] shadow-2xl transition-all duration-500 group-hover/terminal:border-slate-700">
                <div className="terminal-scanline"></div>
                
                {/* Terminal Header */}
                <div className="bg-slate-900/90 px-5 py-3 flex justify-between items-center border-b border-slate-800/50 rounded-t-2xl z-10 backdrop-blur-md">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/20"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-satellite"></i>
                      Link: {isRunning ? 'Active' : 'Standby'}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-2 ${isRunning ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                      {isRunning ? 'Data Stream' : 'Console'}
                    </span>
                  </div>
                </div>
                
                {/* Terminal Logs */}
                <div 
                  ref={terminalRef}
                  className="flex-grow p-8 overflow-y-auto space-y-2.5 text-slate-300 custom-scrollbar z-10 relative scroll-smooth"
                >
                  {logs.length === 0 && !isRunning && (
                    <div className="text-slate-800 italic animate-pulse">
                      &gt; initialisiere schnittstelle...<br />
                      &gt; bereit für simulation.<br />
                      <span className="cursor-blink"></span>
                    </div>
                  )}
                  {logs.map((log, i) => {
                    const isLast = i === logs.length - 1;
                    return (
                      <div 
                        key={i} 
                        className={`
                          ${log.c} 
                          pl-4 py-2 flex items-start animate-log-entry transition-all duration-300 border-l-2
                          ${isLast ? 'log-line-active border-blue-500' : 'border-slate-800/30'}
                        `}
                      >
                        <span className="opacity-20 text-[10px] mr-5 select-none pt-0.5 font-bold min-w-[55px]">
                          {new Date().toLocaleTimeString('de-DE').split(' ')[0]}
                        </span>
                        <div className="flex-grow">
                          <span className="font-bold tracking-tight">{log.text}</span>
                          {isLast && isRunning && <span className="cursor-blink"></span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Tracking */}
                <div className="p-6 border-t border-slate-800/50 bg-slate-900/40 rounded-b-2xl z-10">
                  <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <span>Task-Fortschritt</span>
                    <span className="text-blue-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 relative overflow-hidden shadow-inner">
                    <div 
                      style={{ width: `${progress}%` }}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI REPORT VIEW - REFINED */}
      {aiReport && (
        <div id="ai-report-view" className="mt-12 bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-12 duration-1000">
          <div className="p-8 md:p-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-100 pb-10">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-slate-900/10">
                  <i className="fas fa-file-invoice"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-3xl text-slate-900 tracking-tight">Einsatz-Analysebericht</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest px-2 py-1 bg-blue-50 rounded">Generated by Gemini AI</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ref: OPS-SIG-2666</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center h-12 w-12 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
                  <i className="fas fa-share-nodes"></i>
                </button>
                <button className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-3">
                  <i className="fas fa-download"></i> PDF Export
                </button>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-16">
              {aiReport.split('\n').map((line, i) => {
                if (line.startsWith('#')) {
                  const level = line.match(/^#+/)?.[0].length || 1;
                  const text = line.replace(/#+/, '').trim();
                  return <h5 key={i} className={`font-black text-slate-900 mt-12 mb-6 border-l-4 border-blue-600 pl-6 uppercase tracking-[0.1em] ${level === 1 ? 'text-lg' : 'text-sm opacity-60'}`}>{text}</h5>;
                }
                if (line.trim() === '') return null;
                return <p key={i} className="mb-4 text-[16px] leading-relaxed opacity-90">{line}</p>;
              })}
            </div>

            {/* Quality Feedback - Refined Glass Effect */}
            <div className="mt-16 pt-12 border-t border-slate-100">
              {feedbackSubmitted ? (
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-12 text-center animate-in zoom-in duration-500">
                  <div className="inline-flex h-20 w-20 bg-blue-600 text-white rounded-full items-center justify-center mb-6 shadow-2xl shadow-blue-600/30">
                    <i className="fas fa-check text-3xl"></i>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-2xl mb-2">Analyse bewertet</h5>
                  <p className="text-slate-500 max-w-md mx-auto">Vielen Dank für Ihre Rückmeldung. Die Daten fließen direkt in die Modelloptimierung für den Standort Schwetzingen ein.</p>
                  <button 
                    onClick={() => setFeedbackSubmitted(false)} 
                    className="mt-8 text-blue-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
                  >
                    <i className="fas fa-rotate-left"></i> Neue Bewertung abgeben
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50/50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-6xl pointer-events-none">
                    <i className="fas fa-medal"></i>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-lg">
                      <i className="fas fa-star-half-stroke"></i>
                    </div>
                    <h5 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Berichts-Qualität verifizieren</h5>
                  </div>
                  
                  <form onSubmit={handleFeedbackSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Präzision der Lagebewertung</label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              disabled={isSubmittingFeedback}
                              onClick={() => setFeedbackRating(num)}
                              className={`flex-grow h-14 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1 ${
                                feedbackRating === num 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105' 
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600'
                              }`}
                            >
                              <span className="text-sm">{num}</span>
                              <i className={`fas fa-star text-[8px] ${feedbackRating && feedbackRating >= num ? 'opacity-100' : 'opacity-20'}`}></i>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Operative Anmerkungen</label>
                        <textarea 
                          value={feedbackComment}
                          disabled={isSubmittingFeedback}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="Zusätzliche Details für das KI-Modell (z.B. Wetterbedingungen, Personalstatus)..."
                          className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-32"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">
                      <button 
                        type="submit"
                        disabled={!feedbackRating || isSubmittingFeedback}
                        className="bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-3"
                      >
                        {isSubmittingFeedback ? (
                          <><i className="fas fa-spinner fa-spin"></i> Übertrage...</>
                        ) : (
                          <><i className="fas fa-database text-[14px]"></i> Log speichern</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ScenarioSimulator;