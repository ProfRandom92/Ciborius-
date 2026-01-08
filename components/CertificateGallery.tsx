
import React, { useState, useMemo } from 'react';
import { CERTIFICATES } from '../certificatesData';
import { Certificate } from '../types';

const CertificateGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'KI', 'Security', 'Data', 'Management'];

  const filteredCerts = useMemo(() => {
    return CERTIFICATES.filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || cert.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'KI': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Security': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Data': return 'bg-green-100 text-green-700 border-green-200';
      case 'Management': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Zertifikate & Qualifikationen</h3>
          <p className="text-slate-500 mt-1">Ein Auszug aus meiner Datenbank (61+ Zertifikate).</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Zertifikat suchen..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'All' ? 'Alle' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const isVsNfd = cert.tags.includes('VS-NfD') || cert.name.includes('VS-NfD');
            return (
              <div 
                key={cert.id} 
                className={`bg-white rounded-xl border p-5 hover:shadow-lg transition-all group flex flex-col relative ${isVsNfd ? 'border-red-200' : 'border-slate-200'}`}
              >
                {isVsNfd && (
                  <div className="absolute top-2 right-2 flex items-center">
                    <span className="bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse flex items-center gap-1">
                      <i className="fas fa-shield-halved"></i> VS-NFD
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getCategoryColor(cert.category)}`}>
                    {cert.category}
                  </span>
                  {!isVsNfd && <i className="fas fa-award text-slate-200 group-hover:text-blue-500 transition-colors"></i>}
                </div>
                
                <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug flex-grow pr-10">
                  {cert.name}
                </h4>
                
                <div className="space-y-2 pt-3 border-t border-slate-50">
                  <div className="flex items-center text-[11px] text-slate-500">
                    <i className="fas fa-university w-4 text-blue-500"></i>
                    <span className="font-medium">{cert.issuer}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center">
                      <i className="fas fa-calendar-alt w-4"></i>
                      <span>{cert.date}</span>
                    </div>
                    {cert.duration && (
                      <div className="flex items-center">
                        <i className="fas fa-clock w-4 ml-2"></i>
                        <span>{cert.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {cert.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[9px] px-1.5 py-0.5 rounded border ${tag === 'VS-NfD' ? 'bg-red-50 text-red-600 border-red-100 font-bold' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <i className="fas fa-search text-slate-300 text-4xl mb-4"></i>
          <p className="text-slate-500">Keine Zertifikate für diese Auswahl gefunden.</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 italic">
          * Diese Liste stellt eine Auswahl der wichtigsten Qualifikationen dar. <br className="md:hidden" />
          Vollständiges Portfolio auf Anfrage verfügbar.
        </p>
      </div>
    </div>
  );
};

export default CertificateGallery;
