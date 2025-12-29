
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  Mic, 
  MicOff, 
  X, 
  MessageSquare, 
  Loader2, 
  HeartPulse, 
  Activity, 
  User,
  Bot,
  Terminal,
  SendHorizontal,
  AlertCircle,
  PhoneCall,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { SERVICES, DOCTORS, BEDS } from '../constants';

// --- Audio Helpers ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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

function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface LogEntry {
  role: 'user' | 'assistant' | 'system';
  text: string;
}

interface VoiceAssistantProps {
  pageContext?: string;
  onNavigate?: (path: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ pageContext = "", onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        setHasKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getSystemInstruction = () => {
    const servicesInfo = SERVICES.map(s => `- ${s.title}: ${s.description}`).join('\n');
    const doctorsInfo = DOCTORS.map(d => `- ${d.name} (${d.specialty}): ${d.description}. Available: ${d.timings}`).join('\n');
    const bedsInfo = BEDS.map(b => `- ${b.department}: ${b.total - b.occupied} available.`).join('\n');

    return `
You are the GIRM Hospital Lead AI Receptionist. You are friendly, professional, and very helpful.
Your goal is to welcome users and guide them through our hospital services.

### PERSONA:
- Use very simple words.
- Give short and clear replies.
- Be polite. Say "Welcome to GIRM Hospital" often.
- If you don't know something, say: "Please contact our hospital staff directly for that."
- In case of an emergency, say: "PLEASE CALL OUR EMERGENCY NUMBER 1066 IMMEDIATELY."

### PROMOTION:
- Proactively mention our "Centers of Excellence" like Cardiology and Robotics.
- If a user asks for a doctor, suggest: "We have world-class experts like Dr. Ananya Sharma. Would you like to book an appointment?"

### KEY DATA:
- **Emergency**: Call 1066 (24/7).
- **Address**: Main Road, Healthcare City. (GIRM Hospital Plaza).
- **OPD Timings**: 9 AM to 6 PM (Mon-Sat).
- **Visiting Hours**: 4 PM to 7 PM daily.
- **Appointments**: User must click the "Book Now" button or go to the "Enroll" page.
- **Reports**: Download from the "Patient Portal" after logging in.
- **Fees**: Consultation starts at $50. Online payment is available in the dashboard.
- **Bed Status**: 
${bedsInfo}

### DEPARTMENTS:
${servicesInfo}

### DOCTORS:
${doctorsInfo}

### COMMANDS:
- "go to home"
- "go to services"
- "go to login"
- "go to enroll" (for appointments)
- "go to dashboard" (for reports)

### RULES:
- Never diagnose. Always say: "I recommend consulting our specialists."
- Be brief. No long paragraphs.
- If user sounds in pain, trigger the emergency alert.

CURRENT PAGE: ${pageContext}
`;
  };

  const processVoiceCommand = useCallback((text: string) => {
    const normalized = text.toLowerCase().trim();
    
    // Emergency Detection
    const emergencyKeywords = ['pain', 'bleeding', 'accident', 'dying', 'emergency', 'help', 'heart attack'];
    if (emergencyKeywords.some(k => normalized.includes(k))) {
      setIsEmergency(true);
      setLastCommand('EMERGENCY MODE ACTIVATED');
      setTimeout(() => setIsEmergency(false), 10000);
    }

    if (onNavigate) {
      if (normalized.includes('go to home')) { onNavigate('/'); return true; }
      if (normalized.includes('go to services')) { onNavigate('/#services'); return true; }
      if (normalized.includes('go to enroll') || normalized.includes('appointment')) { onNavigate('/enroll'); return true; }
      if (normalized.includes('go to login')) { onNavigate('/login'); return true; }
      if (normalized.includes('go to dashboard') || normalized.includes('portal')) { onNavigate('/dashboard'); return true; }
      if (normalized.includes('go to reports')) { onNavigate('/dashboard'); return true; }
    }
    
    return false;
  }, [onNavigate]);

  const startAssistant = async () => {
    if (isActive) return sessionRef.current;
    if (!hasKey) { await handleOpenKeyDialog(); }

    setStatus('connecting');
    setIsActive(true);
    setLogs(prev => [...prev, { role: 'system', text: 'Connecting to GIRM Front Desk...' }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: getSystemInstruction(),
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setLogs(prev => [...prev, { role: 'system', text: 'Receptionist is online.' }]);
            const source = audioContextInRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: any) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentInputTranscription.current += text;
              processVoiceCommand(text);
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              if (currentInputTranscription.current) {
                setLogs(prev => [...prev, { role: 'user', text: currentInputTranscription.current }]);
                currentInputTranscription.current = '';
              }
              if (currentOutputTranscription.current) {
                setLogs(prev => [...prev, { role: 'assistant', text: currentOutputTranscription.current }]);
                currentOutputTranscription.current = '';
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }
          },
          onerror: (e) => { console.error('AI Error:', e); stopAssistant(); },
          onclose: () => stopAssistant()
        }
      });
      sessionRef.current = sessionPromise;
      return sessionPromise;
    } catch (err) {
      console.error('Init error:', err);
      stopAssistant();
    }
  };

  const stopAssistant = () => {
    setIsActive(false);
    setStatus('idle');
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioContextInRef.current) { audioContextInRef.current.close(); audioContextInRef.current = null; }
    if (audioContextOutRef.current) { audioContextOutRef.current.close(); audioContextOutRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    sessionRef.current?.then((s: any) => s.close());
    sessionRef.current = null;
  };

  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    if (!hasKey) { await handleOpenKeyDialog(); }

    setInputValue('');
    setLogs(prev => [...prev, { role: 'user', text: text }]);
    setIsOpen(true);
    setShowLogs(true);
    if (processVoiceCommand(text)) return;

    let session = isActive ? await sessionRef.current : await startAssistant();
    if (session) session.sendRealtimeInput({ text: text });
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[60] flex items-center space-x-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-white rounded-full shadow-2xl border border-slate-200 p-1.5 transition-all focus-within:ring-2 focus-within:ring-apollo-blue group">
          <form onSubmit={handleTextSubmit} className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="How can I help you today?"
              className="bg-transparent border-none outline-none px-6 py-2 text-sm text-apollo-blue font-medium w-0 group-hover:w-64 focus:w-64 transition-all duration-500 placeholder:text-slate-400"
            />
            {inputValue.trim() && (
              <button type="submit" className="p-2 bg-apollo-blue text-white rounded-full hover:bg-apollo-red transition-colors mr-1">
                <SendHorizontal className="w-4 h-4" />
              </button>
            )}
          </form>
          <button
            onClick={() => { setIsOpen(true); startAssistant(); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive ? 'bg-apollo-red animate-pulse' : 'bg-apollo-blue'
            } shadow-lg text-white hover:scale-110`}
          >
            {isActive ? <Mic className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[60] w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[650px] animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-6 text-white flex justify-between items-center shrink-0 border-b-4 ${isEmergency ? 'bg-red-600 border-red-800' : 'bg-apollo-blue border-apollo-red'}`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded">
                {isEmergency ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <Bot className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tighter">
                   {isEmergency ? 'Emergency Help' : 'GIRM Front Desk'}
                </h3>
                <p className="text-[9px] text-white/60 uppercase tracking-widest font-bold">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-2 rounded transition-colors"><X className="w-5 h-5" /></button>
          </div>

          {isEmergency && (
            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center space-x-3">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <p className="text-[11px] font-black text-red-800 uppercase tracking-tight">Call 1066 Now for Help!</p>
            </div>
          )}

          <div className="flex-grow overflow-hidden flex flex-col bg-slate-50">
            {showLogs ? (
              <div className="flex-grow overflow-y-auto p-5 space-y-4" ref={scrollRef}>
                {logs.map((log, i) => (
                  <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : log.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded shadow-sm text-[12px] leading-relaxed ${
                      log.role === 'user' ? 'bg-apollo-blue text-white rounded-tr-none' : 
                      log.role === 'system' ? 'bg-slate-200 text-slate-500 font-black italic text-[9px] uppercase tracking-wider py-1.5 px-4 rounded-full' : 
                      'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}>
                      {log.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-10 text-center bg-white relative">
                <div className="relative mb-8 h-24 w-24 flex items-center justify-center">
                  {status === 'speaking' ? (
                    <div className="flex items-center space-x-1.5 h-12">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full animate-bounce ${isEmergency ? 'bg-red-600' : 'bg-apollo-red'}`} style={{ animationDelay: `${i * 0.1}s`, height: '100%' }} />
                      ))}
                    </div>
                  ) : status === 'listening' ? (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-apollo-blue/10 animate-ping" />
                      <div className="w-20 h-20 rounded-full bg-apollo-grey border-4 border-apollo-blue flex items-center justify-center relative z-10">
                        <Mic className="w-8 h-8 text-apollo-blue" />
                      </div>
                    </div>
                  ) : (
                    <Bot className="w-16 h-16 text-slate-100" />
                  )}
                </div>
                <h4 className="text-apollo-blue font-black text-xl mb-2 uppercase tracking-tighter">
                  {status === 'idle' ? 'Hello! I am your Receptionist' : status.toUpperCase()}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[250px] mx-auto font-medium">
                  {status === 'idle' ? 'Welcome to GIRM Hospital! Ask me about doctors, appointments, or emergency care.' : 'One moment, I am checking that for you...'}
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-2">
                   {['Emergency Call', 'Book Doctor', 'Bed Status', 'Our Location'].map(hint => (
                     <button key={hint} onClick={() => { setInputValue(hint); handleTextSubmit(); }} className="text-[10px] bg-slate-50 hover:bg-apollo-blue hover:text-white px-3 py-2 rounded font-black uppercase tracking-wider transition-all border border-slate-100">
                       {hint}
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-apollo-grey border-t border-slate-200 flex flex-col space-y-4 shrink-0">
            <button
              onClick={() => { isActive ? stopAssistant() : startAssistant(); }}
              className={`w-full py-4 rounded font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl ${
                isActive ? 'bg-apollo-red text-white' : 'bg-apollo-blue text-white'
              }`}
            >
              {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isActive ? 'Stop Listening' : 'Talk to Receptionist'}</span>
            </button>
            <button onClick={() => setShowLogs(!showLogs)} className="text-[10px] font-black uppercase text-apollo-blue tracking-widest text-center hover:text-apollo-red transition-colors">
              {showLogs ? 'Back to Desk' : 'Show Chat History'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
