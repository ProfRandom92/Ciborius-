
export interface CompetenceItem {
  id: string;
  title: string;
  icon: string;
  certs: string[];
  desc: string;
  valueAdd: string;
  tools: string[];
}

export interface LogEntry {
  t: number;
  text: string;
  c: string;
}

export interface ScenarioMetrics {
  time: string;
  compliance: string;
  effort: string;
}

export interface ScenarioDetail {
  desc: string;
  logs: LogEntry[];
  metrics: ScenarioMetrics;
}

export interface Scenario {
  manual: ScenarioDetail;
  auto: ScenarioDetail;
}

export type ScenarioType = 'routine' | 'visitor' | 'breach' | 'logistics' | 'infrastructure' | 'sabotage' | 'insider' | 'data_exfiltration';

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  duration?: string;
  tags: string[];
  category: 'KI' | 'Security' | 'Data' | 'Management' | 'Other';
}

export interface ConsultantHistoryItem {
  id: string;
  query: string;
  answer: string;
  timestamp: number;
}