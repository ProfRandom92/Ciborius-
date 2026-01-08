
import { GoogleGenAI, Modality, Type } from "@google/genai";

export interface AIResponse {
  text: string;
  sources?: { title: string; uri: string; snippet?: string; type?: 'web' | 'maps' }[];
}

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getSecurityAdvice(
    query: string, 
    mode: 'fast' | 'precise' | 'thinking',
    options?: { useMaps?: boolean; latLng?: { latitude: number; longitude: number } }
  ): Promise<AIResponse> {
    try {
      const ai = this.getAI();
      let modelName = 'gemini-3-flash-preview';
      let config: any = { temperature: 0.5, tools: [] };

      if (mode === 'thinking') {
        modelName = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 32768 };
      } else if (mode === 'precise') {
        modelName = 'gemini-3-pro-preview';
        config.tools.push({ googleSearch: {} });
      }

      if (options?.useMaps) {
        modelName = 'gemini-2.5-flash';
        config.tools.push({ googleMaps: {} });
        if (options.latLng) {
          config.toolConfig = {
            retrievalConfig: {
              latLng: options.latLng
            }
          };
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: `SYSTEM INSTRUCTION: Du bist Alexander Kölnberger (Mitarbeiter #2666), Experte für Security Ops bei Ciborius im Bereich Bundeswehr-Liegenschaften. 
        DEIN STIL: Professionell, präzise, faktenorientiert. Du nutzt Begriffe wie 'VS-NfD', 'Zutrittskontrolle', 'Perimeterschutz' und 'Digital Asset Protection'. 
        USER ANFRAGE: ${query}`,
        config,
      });

      const text = response.text || "Ich konnte leider keine Analyse für diese Anfrage erstellen.";
      let sources: any[] = [];
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || 'Verifizierte Quelle',
              uri: chunk.web.uri,
              snippet: chunk.web.snippet,
              type: 'web'
            });
          }
          if (chunk.maps) {
            sources.push({
              title: chunk.maps.title || 'Google Maps Location',
              uri: chunk.maps.uri,
              type: 'maps'
            });
          }
        });
      }

      return { text, sources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { text: "Fehler bei der Kommunikation mit dem Intelligence Hub.", sources: [] };
    }
  }

  async analyzeMedia(fileData: string, mimeType: string, prompt: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: fileData.split(',')[1], mimeType } },
              { text: `Analysiere dieses Medium im Kontext von Sicherheit und Liegenschaftsschutz: ${prompt}` }
            ]
          }
        ]
      });
      return response.text || "Keine Analyseergebnisse.";
    } catch (error) {
      console.error("Media Analysis Error:", error);
      return "Kritischer Fehler bei der Medienanalyse.";
    }
  }

  async transcribeAudio(audioBase64: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
              { text: "Transkribiere dieses Audio präzise in Textform. Nur das Transkript ausgeben." }
            ]
          }
        ]
      });
      return response.text || "Transkription fehlgeschlagen.";
    } catch (error) {
      console.error("Transcription Error:", error);
      return "Audio-Verarbeitungsfehler.";
    }
  }

  async generateSpeech(text: string): Promise<ArrayBuffer> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lies dies professionell und klar vor: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Keine Audiodaten generiert.");

    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const buffer = await this.decodeAudioData(bytes, ctx, 24000, 1);
    return buffer;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<any> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  async generateDailyReport(scenarioName: string, mode: string, logs: any[], metrics: any): Promise<string> {
    const logsText = logs.map(l => `[T+${l.t}] - ${l.text}`).join('\n');
    const metricsText = `REAKTIONSZEIT: ${metrics.time} | COMPLIANCE: ${metrics.compliance} | RESSOURCEN: ${metrics.effort}`;
    
    const prompt = `ERSTELLE EINEN MILITÄRISCH-FORMALEN LAGEBERICHT (VS-NFD FORMAT) BASIEREND AUF:
    OBJEKT: Bundeswehr-Liegenschaft (Ref: Schwetzingen)
    SZENARIO: ${scenarioName}
    STEUERUNG: ${mode === 'auto' ? 'KI-GESTÜTZT (DIGITAL OPS)' : 'MANUELL (VORGABEGEMÄSS)'}
    PERFORMANCE: ${metricsText}
    EREIGNIS-CHRONIK: ${logsText}
    # 1. EXECUTIV-ZUSAMMENFASSUNG
    # 2. CHRONOLOGIE
    # 3. QUANTITATIVE BEWERTUNG
    # 4. HANDLUNGSEMPFEHLUNG`;

    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.3 },
      });
      return response.text || "Lagebericht konnte nicht generiert werden.";
    } catch (error) {
      console.error("Report Generation Error:", error);
      return "Kritischer Fehler bei der Protokollgenerierung.";
    }
  }
}

export const geminiService = new GeminiService();
