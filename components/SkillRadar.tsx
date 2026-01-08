
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { subject: 'Wachdienst (§34a)', Standard: 10, Koelnberger: 10, fullMark: 10 },
  { subject: 'IT-Sicherheit', Standard: 2, Koelnberger: 9, fullMark: 10 },
  { subject: 'Prozess-Analyse', Standard: 3, Koelnberger: 9, fullMark: 10 },
  { subject: 'Meldewesen Autom.', Standard: 2, Koelnberger: 10, fullMark: 10 },
  { subject: 'Projektleitung', Standard: 1, Koelnberger: 8, fullMark: 10 },
  { subject: 'Teamführung', Standard: 4, Koelnberger: 9, fullMark: 10 },
];

const SkillRadar: React.FC = () => {
  return (
    <div className="mb-20 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Skill-Shift</h3>
      <p className="text-slate-500 text-center mb-8">Vom klassischen Wachdienst zum Digitalen Projektmanager.</p>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Tooltip />
            <Radar
              name="Markt-Standard"
              dataKey="Standard"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
            />
            <Radar
              name="Alexander Kölnberger"
              dataKey="Koelnberger"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillRadar;
