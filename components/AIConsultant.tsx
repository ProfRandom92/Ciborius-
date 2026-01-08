
import React, { useState, useEffect, useRef } from 'react';
import { geminiService, AIResponse } from '../services/geminiService';
import { ConsultantHistoryItem } from '../types';

type AdvisorMode = 'fast' | 'precise' | 'thinking';

const AIConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState<ConsultantHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<AdvisorMode>('fast');
  const [useMaps, setUseMaps] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  const historyEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('security_ai_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('security_ai_history', JSON.stringify(history));
  }, [history]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const transcript = await geminiService.transcribeAudio(base64);
          setQuery(transcript);
          setIsLoading(false);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSpeech = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const buffer = await geminiService.generateSpeech(text);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer as any;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (e) {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedFile) return;

    setIsLoading(true);
    setLastResponse(null);

    let result: AIResponse;
    
    if (selectedFile && filePreview) {
      const analysis = await geminiService.analyzeMedia(filePreview, selectedFile.type, query);
      result = { text: analysis };
      setSelectedFile(null);
      setFilePreview(null);
    } else {
      let latLng = undefined;
      if (useMaps) {
        try {
          const pos: any = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) { console.error("Location error", e); }
      }
      result = await geminiService.getSecurityAdvice(query, mode, { useMaps, latLng });
    }
    
    setHistory(prev => [{
      id: crypto.randomUUID(),
      query: query || "Media Analysis",
      answer: result.text,
      timestamp: Date.now()
    }, ...prev]);
    setLastResponse(result);
    setQuery('');
    setIsLoading(false);
    setShowHistory(false);
  };

  return (
    <div className={`mb-20 rounded-3xl shadow-2xl p-6 md:p-10 text-white relative overflow-hidden border transition-all duration-700 ${
      mode === 'thinking' ? 'bg-slate-900 border-purple-500/30 ring-1 ring-purple-500/10' : 
      mode === 'precise' ? 'bg-slate-900 border-blue-500/30' : 
      'bg-slate-900 border-amber-500/30'
    }`}>
      {/* Dynamic Glows */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        mode === 'thinking' ? 'bg-purple-500/10' : mode === 'precise' ? 'bg-blue-500/10' : 'bg-amber-500/10'
      }`}></div>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
        <div className="flex items-center space-x-5">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl border transition-all duration-500 ${
            mode === 'thinking' ? 'bg-purple-600 border-purple-400/30' : 
            mode === 'precise' ? 'bg-blue-600 border-blue-400/30' : 
            'bg-amber-600 border-amber-400/30'
          }`}>
            <i className={`fas ${
              mode === 'thinking' ? 'fa-brain-circuit' : 
              mode === 'precise' ? 'fa-magnifying-glass-location' : 
              'fa-bolt'
            }`}></i>
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight">Intelligence Hub</h3>
            <p className="text-slate-400 text-sm mt-1">Multi-Modal Strategic Security Advisor</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-black/40 p-1 rounded-2xl border border-white/10 flex">
            <button onClick={() => setMode('fast')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'fast' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>Fast</button>
            <button onClick={() => setMode('precise')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'precise' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Precise</button>
            <button onClick={() => setMode('thinking')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'thinking' ? 'bg-purple-600 text-white' : 'text-slate-500'}`}>Thinking</button>
          </div>
          <button onClick={() => setUseMaps(!useMaps)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${useMaps ? 'bg-green-600 border-green-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
            <i className="fas fa-map-pin"></i> Maps
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
            <i className={`fas ${showHistory ? 'fa-pen' : 'fa-history'}`}></i>
          </button>
        </div>
      </div>

      <div className="relative z-10">
        {!showHistory ? (
          <>
            {filePreview && (
              <div className="mb-6 relative w-fit group">
                <img src={filePreview} className="h-32 w-auto rounded-xl border border-white/20 shadow-lg" alt="Upload Preview" />
                <button onClick={() => {setSelectedFile(null); setFilePreview(null);}} className="absolute -top-2 -right-2 bg-red-500 h-6 w-6 rounded-full flex items-center justify-center text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            
            <form onSubmit={handleAsk} className="mb-10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={mode === 'thinking' ? "Stelle eine hochkomplexe strategische Frage..." : "Security-Anfrage eingeben..."}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-32 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-blue-400 transition-colors">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button type="button" onMouseDown={startRecording} onMouseUp={stopRecording} onMouseLeave={stopRecording} className={`p-3 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-red-400'}`}>
                      <i className="fas fa-microphone"></i>
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
                </div>
                <button type="submit" disabled={isLoading} className={`px-8 py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center min-w-[180px] shadow-xl active:scale-95 ${
                  mode === 'thinking' ? 'bg-purple-600 hover:bg-purple-500' : 
                  mode === 'precise' ? 'bg-blue-600 hover:bg-blue-500' : 
                  'bg-amber-600 hover:bg-amber-500'
                }`}>
                  {isLoading ? <i className="fas fa-sync fa-spin"></i> : "Analysieren"}
                </button>
              </div>
            </form>

            {lastResponse && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                    mode === 'thinking' ? 'text-purple-400' : 'text-blue-400'
                  }`}>
                    {mode === 'thinking' ? "Strategic Deep Thinking Active" : "Intelligence Output"}
                  </div>
                  <button onClick={() => handleSpeech(lastResponse.text)} className={`p-2 rounded-lg transition-all ${isSpeaking ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
                    <i className="fas fa-volume-high"></i>
                  </button>
                </div>
                <div className="text-lg leading-relaxed text-blue-50/90 whitespace-pre-wrap font-medium mb-8">
                  {lastResponse.text}
                </div>
                
                {lastResponse.sources && lastResponse.sources.length > 0 && (
                  <div className="pt-6 border-t border-white/10">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Grounded Intelligence</div>
                    <div className="flex flex-wrap gap-2">
                      {lastResponse.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] text-blue-400 transition-all flex items-center gap-2">
                          <i className={`fas ${s.type === 'maps' ? 'fa-map-pin' : 'fa-globe'}`}></i> {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map(item => (
              <div key={item.id} className="bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm font-bold text-white mb-2 italic">"{item.query}"</p>
                <p className="text-xs text-slate-400 line-clamp-2">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConsultant;
