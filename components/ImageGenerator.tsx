
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ImageIcon, 
  Sparkles, 
  Download, 
  Loader2, 
  AlertCircle, 
  Settings2,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  HeartPulse
} from 'lucide-react';

type ImageSize = '1K' | '2K' | '4K';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

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

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (!hasKey) {
        await handleOpenKeyDialog();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: `A high-quality, professional medical photograph for a hospital website. Subject: ${prompt}. Ensure it looks realistic, modern, and clean.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: imageSize
          }
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64Data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated in the response.");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key verification failed. Please re-select your key.");
      } else {
        setError(err.message || "Failed to generate image. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-6 py-2 rounded-full mb-6 border border-slate-200">
          <Sparkles className="w-4 h-4 text-apollo-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visual Medical Studio</span>
        </div>
        <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Clinical Imagery Lab</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Create photorealistic medical concepts and hospital visualizations using GIRM's advanced generative infrastructure.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
              <Settings2 className="w-5 h-5 text-apollo-red" />
              <h3 className="font-black text-apollo-blue uppercase text-sm tracking-tight">Studio Controls</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scientific Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Ultra-modern surgery room with blue ambient lighting and robotic arms"
                  rows={4}
                  className="w-full bg-apollo-grey border border-slate-200 rounded p-4 text-sm font-bold text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                  <span>Target Resolution</span>
                  <span className="text-[8px] bg-apollo-red text-white px-2 py-0.5 rounded font-black">ULTRA-HD</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-3 rounded text-[11px] font-black tracking-widest transition-all border ${
                        imageSize === size
                          ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {!hasKey && (
                <div className="p-5 bg-amber-50 rounded border border-amber-100 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-tighter">Paid API Access Required</p>
                      <p className="text-[11px] text-amber-700 mt-2 font-medium leading-relaxed">
                        Pro image generation requires a billing-enabled Google Cloud API Key.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenKeyDialog}
                    className="w-full py-2.5 bg-amber-100 text-amber-800 rounded text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Authorize Key</span>
                  </button>
                </div>
              )}

              {hasKey && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-100 rounded">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-[9px] font-black text-green-700 uppercase tracking-[0.2em]">Clinical Engine Authenticated</span>
                </div>
              )}

              <button
                disabled={isLoading || !prompt.trim()}
                onClick={generateImage}
                className="w-full bg-apollo-red text-white font-black py-4 rounded uppercase text-xs tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20 disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span>Develop Visualization</span>
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
          <div className="bg-apollo-grey rounded shadow-inner aspect-video relative overflow-hidden border-[12px] border-white shadow-2xl flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                   <div className="w-20 h-20 border-4 border-slate-200 border-t-apollo-blue rounded-full animate-spin" />
                   {/* Fix: Added HeartPulse to imports */}
                   <HeartPulse className="absolute inset-0 m-auto w-8 h-8 text-apollo-red animate-pulse" />
                </div>
                <div className="text-center">
                   <p className="text-apollo-blue font-black uppercase tracking-[0.3em] text-[10px]">Processing Neuro-Network</p>
                   <p className="text-slate-400 text-[9px] mt-2 italic font-medium">Fine-tuning high-definition medical detail...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all group">
                  <div className="absolute top-8 right-8 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                    <button 
                      onClick={() => window.open(generatedImage)}
                      className="bg-white p-3 rounded shadow-xl hover:bg-apollo-blue hover:text-white transition-all"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <a
                      href={generatedImage}
                      download={`girm-medical-image.png`}
                      className="bg-apollo-red p-3 rounded shadow-xl hover:bg-apollo-blue transition-all text-white"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all transform -translate-y-4 group-hover:translate-y-0">
                    <div className="bg-apollo-blue/90 backdrop-blur-md px-6 py-3 rounded text-white text-[10px] font-black tracking-[0.2em] flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-apollo-red animate-pulse" />
                      <span>{imageSize} SCIENTIFIC RENDER</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-white rounded shadow-sm flex items-center justify-center mx-auto mb-8">
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter">Visualization Canvas</h3>
                <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.2em] mt-3">
                  Awaiting input parameters
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { label: 'Engine', val: 'Gemini 3 Pro' },
               { label: 'Network', val: 'Visual-HD' },
               { label: 'Style', val: 'Clinical Photo' },
               { label: 'Output', val: 'PNG 32-bit' }
             ].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded border border-slate-100 text-center shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-xs font-black text-apollo-blue uppercase tracking-tight">{stat.val}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
