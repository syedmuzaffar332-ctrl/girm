
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
  Terminal
} from 'lucide-react';
import { SERVICES, DOCTORS } from '../constants';

// --- Audio Encoding & Decoding Helpers ---

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
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ pageContext = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  // Browser SpeechRecognition for 'Open Assistant' command when idle
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const servicesInfo = SERVICES.map(s => `- ${s.title}: ${s.description}`).join('\n');
  const doctorsInfo = DOCTORS.map(d => `- ${d.name} (${d.specialty}): ${d.description}`).join('\n');

  const getSystemInstruction = () => `
You are the GIRM Hospital Virtual Receptionist. You are professional, helpful, and empathetic.
Your job is to answer questions about GIRM Hospital.

CURRENT VIEW CONTEXT:
${pageContext}

HOSPITAL SERVICES:
${servicesInfo}

DOCTORS:
${doctorsInfo}

ENROLLMENT PROCESS:
Patients can enroll by clicking "Enroll Now" on the website.

VOICE COMMANDS YOU MUST RECOGNIZE:
- "show logs" or "open logs": Respond by confirming you are opening the logs.
- "hide logs" or "close logs": Respond by confirming you are hiding the logs.
- "close assistant" or "stop assistant": Respond by saying goodbye and the session will end.

GUIDELINES:
- Be concise and aware of the user's current view described in CURRENT VIEW CONTEXT.
- Use a friendly, reassuring tone.
`;

  const processVoiceCommand = useCallback((text: string) => {
    const normalized = text.toLowerCase().trim();
    
    if (normalized.includes('show logs') || normalized.includes('open logs')) {
      setLastCommand('Opening logs...');
      setShowLogs(true);
      setTimeout(() => setLastCommand(null), 2000);
      return true;
    }
    if (normalized.includes('hide logs') || normalized.includes('close logs')) {
      setLastCommand('Hiding logs...');
      setShowLogs(false);
      setTimeout(() => setLastCommand(null), 2000);
      return true;
    }
    if (normalized.includes('close assistant') || normalized.includes('stop assistant') || normalized.includes('goodbye assistant')) {
      setLastCommand('Closing assistant...');
      setTimeout(() => {
        stopAssistant();
        setLastCommand(null);
      }, 1500);
      return true;
    }
    return false;
  }, []);

  const startAssistant = async () => {
    if (isActive) return;
    
    setStatus('connecting');
    setIsActive(true);
    setIsOpen(true);
    setLogs(prev => [...prev, { role: 'system', text: 'Connecting to Gemini Voice Engine...' }]);

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
            setLogs(prev => [...prev, { role: 'system', text: 'Voice session established.' }]);
            const source = audioContextInRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: any) => {
            // Handle Transcription
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentInputTranscription.current += text;
              // Real-time command detection
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

            // Handle Audio
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
          onerror: (e) => {
            console.error('Gemini Live API Error:', e);
            stopAssistant();
          },
          onclose: () => stopAssistant()
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error('Failed to initialize Voice Assistant:', err);
      stopAssistant();
    }
  };

  const stopAssistant = () => {
    setIsActive(false);
    setStatus('idle');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextInRef.current) {
      audioContextInRef.current.close();
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      audioContextOutRef.current.close();
      audioContextOutRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    sessionRef.current?.then((s: any) => s.close());
    sessionRef.current = null;
    setLogs(prev => [...prev, { role: 'system', text: 'Session ended.' }]);
  };

  const toggleAssistant = () => {
    if (isActive) stopAssistant();
    else startAssistant();
  };

  // Setup passive listener for 'Open Assistant'
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !isActive) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
          .toLowerCase();

        if (transcript.includes('open assistant') || transcript.includes('start assistant')) {
          startAssistant();
          recognition.stop();
        }
      };

      recognition.onerror = () => {
        // Silently handle errors or restart
      };

      recognition.onend = () => {
        if (!isActive) recognition.start();
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isActive]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          else toggleAssistant();
        }}
        className={`fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isActive ? 'bg-apollo-red' : 'bg-apollo-blue'
        }`}
        aria-label="Toggle Voice Assistant"
      >
        {isActive ? (
          <Mic className="text-white w-7 h-7 animate-pulse" />
        ) : (
          <MessageSquare className="text-white w-7 h-7" />
        )}
      </button>

      {/* Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[60] w-[380px] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[600px] animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-apollo-blue p-6 text-white flex justify-between items-center shrink-0 border-b-4 border-apollo-red">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded">
                <HeartPulse className="w-5 h-5 text-apollo-red" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tighter">GIRM Voice Care</h3>
                <p className="text-[9px] text-white/60 uppercase tracking-widest font-bold">Smart Medical Concierge</p>
              </div>
            </div>
            <button 
              onClick={() => { stopAssistant(); setIsOpen(false); }} 
              className="hover:bg-apollo-red p-2 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-grow overflow-hidden flex flex-col">
            {showLogs ? (
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-apollo-grey" ref={scrollRef}>
                {logs.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs italic">
                    Consultation logs will appear here.
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : log.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded text-[11px] leading-relaxed shadow-sm ${
                        log.role === 'user' 
                          ? 'bg-apollo-blue text-white font-bold' 
                          : log.role === 'system'
                          ? 'bg-slate-200 text-slate-500 font-bold italic border-none text-[8px] uppercase tracking-wider'
                          : 'bg-white text-slate-700 border border-slate-100 font-medium'
                      }`}>
                        {log.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="relative mb-10 h-24 w-24 flex items-center justify-center">
                  {status === 'speaking' ? (
                    <div className="flex items-center space-x-1.5 h-12">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-1.5 bg-apollo-red rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s`, height: '100%' }} />
                      ))}
                    </div>
                  ) : status === 'listening' ? (
                    <div className="w-20 h-20 rounded-full bg-apollo-grey border-4 border-apollo-blue flex items-center justify-center animate-pulse">
                      <Mic className="w-8 h-8 text-apollo-blue" />
                    </div>
                  ) : (
                    <Bot className="w-16 h-16 text-slate-200" />
                  )}
                </div>
                <h4 className="text-apollo-blue font-black text-xl mb-2 uppercase tracking-tighter">
                  {status === 'idle' ? 'AI Health Desk' : status.toUpperCase()}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mx-auto">
                  {status === 'idle' ? 'Say "Open Assistant" to begin your voice consultation.' : 'How can our medical team assist you today?'}
                </p>
              </div>
            )}
          </div>

          <div className="p-5 bg-apollo-grey border-t border-slate-100 flex flex-col space-y-4 shrink-0">
            <button
              onClick={toggleAssistant}
              className={`w-full py-4 rounded font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl ${
                isActive 
                  ? 'bg-apollo-red text-white shadow-apollo-red/20' 
                  : 'bg-apollo-blue text-white shadow-apollo-blue/20'
              }`}
            >
              {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isActive ? 'Disconnect' : 'Start Voice Connect'}</span>
            </button>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className="text-[10px] font-black uppercase text-apollo-blue tracking-widest text-center hover:text-apollo-red transition-colors"
            >
              {showLogs ? 'Back to Desk' : 'View Clinical Transcript'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
