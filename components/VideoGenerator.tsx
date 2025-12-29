
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, 
  Sparkles, 
  Download, 
  Loader2, 
  AlertCircle, 
  Monitor, 
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Play,
  HeartPulse
} from 'lucide-react';

type AspectRatio = '16:9' | '9:16';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
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

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setLoadingStep('Initializing medical rendering engine...');

    try {
      if (!hasKey) {
        await handleOpenKeyDialog();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setLoadingStep('Transmitting parameters to Veo 3.1 infrastructure...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A professional, cinematic medical visualization: ${prompt}. High-quality clinical lighting, sterile environment, modern medical aesthetic.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio
        }
      });

      setLoadingStep('Veo is processing high-fidelity medical motion data...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setLoadingStep('Rendering clinical environment... This typically takes 2-4 minutes.');
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setLoadingStep('Finalizing clinical walkthrough...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("Clinical rendering failed - No URI returned.");
      }

    } catch (err: any) {
      console.error("Video generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("Clinical Authorization Failed. Please select a valid Paid Project Key.");
      } else {
        setError(err.message || "Rendering failed. Ensure API credits are available.");
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-6 py-2 rounded-full mb-6 border border-slate-200">
          <Sparkles className="w-4 h-4 text-apollo-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Veo Medical Visualization</span>
        </div>
        <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Advanced Video Lab</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Generate cinematic clinical walkthroughs and medical procedures using the state-of-the-art Veo 3.1 generative engine.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-2xl border border-slate-100">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Procedural Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A cinematic tracking shot through a high-tech cardiology wing with staff in professional attire"
                  rows={4}
                  className="w-full bg-apollo-grey border border-slate-200 rounded p-4 text-sm font-bold text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cinematic Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-4 rounded text-[11px] font-black tracking-widest flex flex-col items-center justify-center space-y-2 border transition-all ${
                      aspectRatio === '16:9'
                        ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span>16:9 Landscape</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-4 rounded text-[11px] font-black tracking-widest flex flex-col items-center justify-center space-y-2 border transition-all ${
                      aspectRatio === '9:16'
                        ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>9:16 Portrait</span>
                  </button>
                </div>
              </div>

              {!hasKey && (
                <div className="p-5 bg-amber-50 rounded border border-amber-100 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 leading-tight font-bold uppercase tracking-tighter">
                      Veo infrastructure requires a Paid Tier API Key.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenKeyDialog}
                    className="w-full py-2.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Authenticate Account</span>
                  </button>
                </div>
              )}

              {hasKey && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-100 rounded">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-[9px] font-black text-green-700 uppercase tracking-[0.2em]">Motion Engine Online</span>
                </div>
              )}

              <button
                disabled={isLoading || !prompt.trim()}
                onClick={generateVideo}
                className="w-full bg-apollo-red text-white font-black py-5 rounded uppercase text-xs tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20 disabled:opacity-50 flex items-center justify-center space-x-3 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Render...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Commence Generation</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded font-bold text-[10px] uppercase tracking-wider border border-red-100 flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className={`bg-apollo-grey rounded relative overflow-hidden border-[12px] border-white shadow-2xl flex items-center justify-center ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[850px] mx-auto w-auto'}`}>
            {isLoading ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-apollo-grey rounded-full flex items-center justify-center mb-8 animate-pulse border-4 border-apollo-blue/20">
                  <HeartPulse className="w-12 h-12 text-apollo-red" />
                </div>
                <h4 className="text-xl font-black text-apollo-blue uppercase tracking-tighter mb-4">Rendering Visualization</h4>
                <p className="text-[11px] text-slate-500 max-w-sm font-bold uppercase tracking-widest leading-loose">{loadingStep}</p>
                <div className="mt-10 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-apollo-red animate-progress origin-left shadow-[0_0_10px_rgba(237,28,36,0.5)]" />
                </div>
              </div>
            ) : videoUrl ? (
              <div className="w-full h-full group">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  <a
                    href={videoUrl}
                    download={`girm-pro-walkthrough.mp4`}
                    className="bg-white px-6 py-3 rounded shadow-2xl hover:bg-apollo-red hover:text-white transition-all text-apollo-blue flex items-center space-x-3 font-black text-[10px] uppercase tracking-widest"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export MP4</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center p-20">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Video className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter leading-none">Veo Render Canvas</h3>
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mt-4 mx-auto max-w-[200px] leading-relaxed">
                  Awaiting medical motion parameters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.75); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 80s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoGenerator;
