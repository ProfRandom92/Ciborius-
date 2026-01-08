
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <p className="font-bold text-slate-800 text-lg mb-2">Alexander Kölnberger</p>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Ciborius Security & Service Solutions | Mitarbeiter Nr. 2666<br />
              Spezialist für digitales Projektmanagement & KI-Integration im Sicherheitswesen.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition"><i className="fab fa-linkedin text-xl"></i></a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition"><i className="fab fa-github text-xl"></i></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Standorte</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li>Friedrichsfelder Landstr. 34</li>
              <li>BiFZ Mannheim</li>
              <li>Schwetzingen Liegenschaften</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Kontakt</h4>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm transition w-full flex items-center justify-center">
              <i className="fas fa-envelope mr-2 text-blue-600"></i> Interne Nachricht
            </button>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Alexander Kölnberger. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-600">Datenschutz</a>
            <a href="#" className="hover:text-slate-600">Impressum</a>
            <a href="#" className="hover:text-slate-600">Compliance-Richtlinien</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
