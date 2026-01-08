
import { CompetenceItem, Scenario, ScenarioType } from './types';

export const COMPETENCE_DATA: CompetenceItem[] = [
  {
    id: 'process',
    title: 'Prozessoptimierung & AI',
    icon: 'fa-cogs',
    certs: ['AI Agent Developer', 'Automations Specialist'],
    desc: 'Entwicklung von Lösungen, die manuelle Abläufe an der Pforte oder in der Leitstelle reduzieren.',
    valueAdd: 'Reduzierung von Wartezeiten am Tor durch automatisierte Voranmeldungssysteme. Entlastung der Wachschichtführer von Papierkram.',
    tools: ['Python Agents', 'Digital Logbooks', 'Workflow Automation']
  },
  {
    id: 'data',
    title: 'Reporting & Analyse',
    icon: 'fa-chart-bar',
    certs: ['Data Science Fundamentals', 'Excel Copilot Expert'],
    desc: 'Aufbereitung von Sicherheitsdaten für die Standortleitung und Ciborius-Führung.',
    valueAdd: 'Erstellung von automatischen Lageberichten. Erkennung von Mustern bei Sicherheitsvorfällen in den Liegenschaften.',
    tools: ['Power BI', 'SQL', 'Advanced Excel']
  },
  {
    id: 'compliance',
    title: 'Compliance & Sicherheit',
    icon: 'fa-lock',
    certs: ['Microsoft Security Essentials', '§ 34a GewO', 'VS-NfD Awareness'],
    desc: 'Verbindung von physischer Sicherheit (Tor/Streife) mit IT-Sicherheit.',
    valueAdd: 'Sicherstellung, dass neue digitale Tools den strengen Vorgaben der Bundeswehr (Datenschutz, VS-NfD) entsprechen.',
    tools: ['Compliance Manager', 'Risk Assessment', 'DSGVO']
  }
];

export const SCENARIOS: Record<ScenarioType, Scenario> = {
  routine: {
    manual: {
      desc: "Warten, Kaffee, Stundenlanges Nichts-Tun.",
      logs: [
        { t: 0, text: "Schichtbeginn 06:00. Wachbuch übernommen.", c: "text-slate-300" },
        { t: 20, text: "08:00: Keine Vorkommnisse.", c: "text-slate-500" },
        { t: 40, text: "10:00: Streifengang Außenbereich. Alles ruhig.", c: "text-slate-400" },
        { t: 60, text: "12:00: Mittagspause. Tor verschlossen.", c: "text-slate-500" },
        { t: 80, text: "14:00: Warten auf Ablösung... Müdigkeit steigt.", c: "text-slate-500 italic" },
        { t: 100, text: "16:00: Eintrag Wachbuch: 'Keine Vorkommnisse'.", c: "text-slate-300" }
      ],
      metrics: { time: "10 Std.", compliance: "Passiv", effort: "Hoch (Leerlauf)" }
    },
    auto: {
      desc: "24/7 Hintergrund-Monitoring & Auto-Log.",
      logs: [
        { t: 0, text: "System Start. Sensoren & Kameras Online.", c: "text-blue-300" },
        { t: 20, text: "Heartbeat Check (alle 5min): OK.", c: "text-slate-500 text-xs" },
        { t: 40, text: "Kamera 4 (Zaun Süd): Bewegung erkannt (Tier). Ignoriert.", c: "text-blue-200" },
        { t: 60, text: "Datenbank-Backup: OK.", c: "text-slate-500 text-xs" },
        { t: 80, text: "Auto-Logbuch Update: 'Status Grün'.", c: "text-green-300" },
        { t: 100, text: "Schichtbericht PDF generiert & archiviert.", c: "text-green-400" }
      ],
      metrics: { time: "0 Sek.", compliance: "100% Lückenlos", effort: "Null" }
    }
  },
  visitor: {
    manual: {
      desc: "Papierlisten, Telefonate, Stau am Tor.",
      logs: [
        { t: 0, text: "Fahrzeug am Tor. Fahrer: 'Handwerker'.", c: "text-slate-300" },
        { t: 20, text: "Suche auf Papierliste KW38...", c: "text-slate-400" },
        { t: 40, text: "Name nicht gefunden. Rückfrage Telefon.", c: "text-yellow-400" },
        { t: 60, text: "Keine Antwort. Stau bildet sich.", c: "text-red-400" },
        { t: 80, text: "Manuelle Erfassung der Personalausweisdaten.", c: "text-slate-400" },
        { t: 100, text: "Einfahrt gewährt nach 15 Min.", c: "text-slate-300" }
      ],
      metrics: { time: "15-20 Min.", compliance: "Fehleranfällig", effort: "Hoch" }
    },
    auto: {
      desc: "QR-Code Scan, Datenbank, Sofort-Zutritt.",
      logs: [
        { t: 0, text: "Kennzeichenerkennung: MA-XY 123.", c: "text-blue-300" },
        { t: 40, text: "Datenbank-Check: Voranmeldung aktiv.", c: "text-green-400" },
        { t: 60, text: "QR-Code Scan am Terminal: Gültig.", c: "text-green-300" },
        { t: 80, text: "Schranke öffnet. Zeitstempel gesetzt.", c: "text-blue-200" },
        { t: 100, text: "Notification an Ansprechpartner gesendet.", c: "text-slate-400" }
      ],
      metrics: { time: "45 Sek.", compliance: "100% Digital", effort: "Gering" }
    }
  },
  breach: {
    manual: {
      desc: "Alarm, Verwirrung, Telefonkette.",
      logs: [
        { t: 0, text: "ALARMTON im Wachlokal.", c: "text-red-500 font-bold" },
        { t: 20, text: "Wachposten schaut auf Monitor-Wand...", c: "text-slate-400" },
        { t: 40, text: "Welcher Sektor? Sektor 3 oder 4?", c: "text-yellow-400" },
        { t: 60, text: "Anruf beim OvWa (Besetzt).", c: "text-red-400" },
        { t: 80, text: "Streife läuft zu Fuß los...", c: "text-slate-400" },
        { t: 100, text: "Eintreffen am Zaun nach 8 Min. Spur kalt.", c: "text-red-500" }
      ],
      metrics: { time: "8-10 Min.", compliance: "Kritisch", effort: "Stress" }
    },
    auto: {
      desc: "Sensor-Trigger, Drohne/Kamera, Auto-Alert.",
      logs: [
        { t: 0, text: "Sensor Sektor 4: Durchtrennung erkannt.", c: "text-red-400 font-bold" },
        { t: 20, text: "PTZ-Kamera schwenkt automatisch auf Ziel.", c: "text-blue-300" },
        { t: 40, text: "Objekterkennung: 'Person, maskiert'.", c: "text-red-300" },
        { t: 60, text: "Push-Alarm an alle Mobilgeräte (OvWa/Streife).", c: "text-green-400" },
        { t: 80, text: "Polizei-Notruf vor-formuliert.", c: "text-blue-200" },
        { t: 100, text: "Lagebild in Echtzeit verfügbar.", c: "text-green-300" }
      ],
      metrics: { time: "3 Sek.", compliance: "VS-NfD Konform", effort: "Fokussiert" }
    }
  },
  logistics: {
    manual: {
      desc: "LKW-Stau, Frachtbriefkontrolle per Hand.",
      logs: [
        { t: 0, text: "3 LKWs vor dem Haupttor. Motoren laufen.", c: "text-slate-300" },
        { t: 25, text: "Fahrer 1 bringt Frachtbriefe. Unleserlich.", c: "text-yellow-400" },
        { t: 50, text: "Telefonat mit Warenannahme (Besetzt).", c: "text-slate-400" },
        { t: 75, text: "Manuelle Eintragung in die Fahrzeugliste.", c: "text-slate-400" },
        { t: 100, text: "Einfahrt nach 25 Min. Stau auf Landstraße.", c: "text-red-400" }
      ],
      metrics: { time: "25-30 Min.", compliance: "Lückenhaft", effort: "Sehr Hoch" }
    },
    auto: {
      desc: "Digitaler Slot-Check & LPR.",
      logs: [
        { t: 0, text: "LPR erkennt Kennzeichen 'MA-LOG 500'.", c: "text-blue-300" },
        { t: 30, text: "Sync mit SAP: Liefertermin bestätigt.", c: "text-green-400" },
        { t: 60, text: "Autom. Sicherheitsbelehrung auf Tablet quittiert.", c: "text-blue-200" },
        { t: 90, text: "Tor öffnet automatisch. Zeitstempel gesetzt.", c: "text-green-300" },
        { t: 100, text: "Slot-Status: 'In Entladung'. Warenannahme informiert.", c: "text-slate-400" }
      ],
      metrics: { time: "2 Min.", compliance: "Revisionssicher", effort: "Minimal" }
    }
  },
  infrastructure: {
    manual: {
      desc: "Defekte Beleuchtung, unbemerkte Schäden.",
      logs: [
        { t: 0, text: "Streifengang Nachtschicht beginnt.", c: "text-slate-300" },
        { t: 30, text: "Feststellung: Lampe 12 im Sektor C flackert.", c: "text-yellow-400" },
        { t: 60, text: "Notiz auf Block: 'Elektriker rufen'.", c: "text-slate-400" },
        { t: 90, text: "Zaunschaden durch Wild erst bei Tageslicht entdeckt.", c: "text-red-400" },
        { t: 100, text: "Schichtbericht enthält 3 handschriftliche Mängel.", c: "text-slate-500" }
      ],
      metrics: { time: "Var. (Std.)", compliance: "Reaktiv", effort: "Mittel" }
    },
    auto: {
      desc: "IoT-Überwachung & Predictive Maintenance.",
      logs: [
        { t: 0, text: "IoT-Sensor Lampe 12 meldet Spannungsabfall.", c: "text-blue-300" },
        { t: 30, text: "Autom. Ticket an Technik erstellt (Priorität 2).", c: "text-blue-200" },
        { t: 60, text: "Vibrationssensor Zaun Sektor B meldet Kontakt.", c: "text-yellow-400" },
        { t: 90, text: "Analyse: 'Kleine Tierbewegung'. Status Gelb.", c: "text-green-300" },
        { t: 100, text: "Infrastruktur-Dashboard: '98% Betriebsbereit'.", c: "text-slate-400" }
      ],
      metrics: { time: "Echtzeit", compliance: "Präventiv", effort: "Null" }
    }
  },
  sabotage: {
    manual: {
      desc: "Physische Beschädigung kritischer Kabel.",
      logs: [
        { t: 0, text: "Technik meldet Ausfall von Kamera 14.", c: "text-slate-300" },
        { t: 30, text: "Wachposten versucht Reset (erfolglos).", c: "text-slate-400" },
        { t: 60, text: "Streife wird losgeschickt zur Überprüfung.", c: "text-yellow-400" },
        { t: 90, text: "Feststellung: Kabel am Mast durchtrennt.", c: "text-red-400" },
        { t: 100, text: "Schaden gemeldet. Reparatur erst morgen möglich.", c: "text-slate-500" }
      ],
      metrics: { time: "45 Min.", compliance: "Schutzlücke", effort: "Hoch" }
    },
    auto: {
      desc: "Sofortige Detektion & Signalverlust-Analyse.",
      logs: [
        { t: 0, text: "Tamper-Alarm Kamera 14: Signalverlust erkannt.", c: "text-red-400" },
        { t: 25, text: "AI-Analyse: Nachbarkameras schwenken auf Sektor.", c: "text-blue-300" },
        { t: 50, text: "Objekterkennung: 'Person mit Werkzeug'.", c: "text-red-500 font-bold" },
        { t: 75, text: "Autom. Lichtsteuerung: Sektor taghell beleuchtet.", c: "text-green-400" },
        { t: 100, text: "Täter flüchtet; Live-Video an Polizei gesendet.", c: "text-green-300" }
      ],
      metrics: { time: "5 Sek.", compliance: "Geringes Risiko", effort: "Automatisiert" }
    }
  },
  insider: {
    manual: {
      desc: "Missbrauch von Zutrittsberechtigungen.",
      logs: [
        { t: 0, text: "Reinigungspersonal betritt VS-Bereich.", c: "text-slate-300" },
        { t: 35, text: "Wachdienst bemerkt keine Unregelmäßigkeit.", c: "text-slate-400" },
        { t: 70, text: "Mitarbeiter öffnet unbefugt Aktenschrank.", c: "text-yellow-400" },
        { t: 100, text: "Vorfall bleibt unentdeckt bis zum Audit.", c: "text-red-500" }
      ],
      metrics: { time: "Wochen", compliance: "Kritisch", effort: "Null (Blind)" }
    },
    auto: {
      desc: "Verhaltensanalyse & Access-Anomaly.",
      logs: [
        { t: 0, text: "Zutritt VS-Bereich (Badge #4412).", c: "text-blue-300" },
        { t: 30, text: "AI-Check: Reinigungsplan vs. aktuelle Uhrzeit.", c: "text-blue-200" },
        { t: 60, text: "Anomaly: 'Unerwartete Aufenthaltsdauer'.", c: "text-yellow-400" },
        { t: 90, text: "Video-Analytics: 'Manipulationsversuch an Schrank'.", c: "text-red-400 font-bold" },
        { t: 100, text: "Remote-Lockdown; Wachdienst informiert.", c: "text-green-400" }
      ],
      metrics: { time: "2 Min.", compliance: "100% Sicher", effort: "Gering" }
    }
  },
  data_exfiltration: {
    manual: {
      desc: "Abfluss von VS-Daten über Wechselmedien.",
      logs: [
        { t: 0, text: "Mitarbeiter arbeitet an VS-Rechner.", c: "text-slate-300" },
        { t: 40, text: "Unbemerktes Anschließen eines USB-Sticks.", c: "text-slate-400" },
        { t: 80, text: "Kopiervorgang von 'Einsatzplan_2025.pdf'.", c: "text-yellow-400" },
        { t: 100, text: "Datendiebstahl vollendet. Keine Spur.", c: "text-red-500" }
      ],
      metrics: { time: "Nie", compliance: "Kompromittiert", effort: "Hoch (Forensik)" }
    },
    auto: {
      desc: "DLP & Endpoint Monitoring (KI-gestützt).",
      logs: [
        { t: 0, text: "USB-Mount Sektor B (Rechner 09) erkannt.", c: "text-blue-300" },
        { t: 30, text: "DLP: 'Unautorisiertes Medium blockiert'.", c: "text-blue-400 font-bold" },
        { t: 60, text: "Analyse: Versuchter Zugriff auf VS-NfD Dateien.", c: "text-yellow-400" },
        { t: 90, text: "Benutzersperrung & Incident Ticket erstellt.", c: "text-green-400" },
        { t: 100, text: "IT-Forensik Bericht autom. erstellt.", c: "text-green-300" }
      ],
      metrics: { time: "Echtzeit", compliance: "Vollständig", effort: "Minimal" }
    }
  }
};