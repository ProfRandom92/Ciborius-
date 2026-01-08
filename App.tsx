
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CompetenceMatrix from './components/CompetenceMatrix';
import ScenarioSimulator from './components/ScenarioSimulator';
import CertificateGallery from './components/CertificateGallery';
import SkillRadar from './components/SkillRadar';
import AIConsultant from './components/AIConsultant';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <CompetenceMatrix />
        <ScenarioSimulator />
        <CertificateGallery />
        <AIConsultant />
        <SkillRadar />
      </main>
      <Footer />
    </div>
  );
};

export default App;
