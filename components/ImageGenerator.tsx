
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
  HeartPulse,
  History,
  Grid
} from 'lucide-react';

type ImageSize = '1K' | '2K' | '4K';

const PRESET_STYLES = [
  { id: 'none', name: 'General', prompt: '' },
  { id: 'mri', name: 'Diagnostic MRI', prompt: 'In the style of a high-contrast diagnostic MRI scan, medical imaging aesthetic' },
  { id: '3d', name: 'Anatomy 3D', prompt: 'Highly detailed 3D anatomical visualization, clean medical background, cinematic lighting' },
  { id: 'micro', name: 'Microscopic', prompt: 'Microscopic medical photography, cellular detail, scientific lighting' },
  { id: 'robo', name: 'Robotic Tech', prompt: 'Futuristic robotic surgery equipment, blue ambient lighting, clinical aesthetic' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(PRESET_STYLES[0]);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
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
      const fullPrompt = `${selectedStyle.prompt} ${prompt}. High-quality, professional medical hospital aesthetic, sterile, realistic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: fullPrompt }],
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
            const finalImage = `data:image/png;base64,${base64Data}`;
            setGeneratedImage(finalImage);
            setGallery(prev => [finalImage, ...prev].slice(0, 8));
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) throw new Error("Scientific rendering failed - Check parameters.");
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Rendering failed. Please verify API credits.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-6 py-2 rounded-full mb-6 border border-slate-200">
          <Sparkles className="w-4 h-4 text-apollo-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnostic Visualization Studio</span>
        </div>
        <h2 className="text-5xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Clinical Imagery Lab</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Create anatomical visualizations and diagnostic concepts for medical education and hospital asset management.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-100">
              <Settings2 className="w-5 h-5 text-apollo-red" />
              <h3 className="font-black text-apollo-blue uppercase text-sm tracking-tight">Render Config</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Procedural Style</label>
                <div className="grid grid-cols-2 gap-2">
                   {PRESET_STYLES.map(style => (
                     <button 
                       key={style.id}
                       onClick={() => setSelectedStyle(style)}
                       className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight border transition-all ${
                         selectedStyle.id === style.id ? 'bg-apollo-blue text-white border-apollo-blue' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-apollo-blue'
                       }`}
                     >
                       {style.name}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Cross-section of a heart showing robotic valve replacement"
                  rows={4}
                  className="w-full bg-apollo-grey border border-slate-200 rounded-2xl p-4 text-sm font-bold text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                  <span>Target Precision</span>
                  <span className="text-[8px] bg-apollo-red text-white px-2 py-0.5 rounded font-black">PRO-GRADE</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-3 rounded-xl text-[11px] font-black tracking-widest transition-all border ${
                        imageSize === size
                          ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {!hasKey && (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 font-bold uppercase leading-tight tracking-tighter">
                      Paid API Credentials required for 4K rendering.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenKeyDialog}
                    className="w-full py-2.5 bg-amber-100 text-amber-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-colors"
                  >
                    Authenticate
                  </button>
                </div>
              )}

              <button
                disabled={isLoading || !prompt.trim()}
                onClick={generateImage}
                className="w-full bg-apollo-red text-white font-black py-5 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20 disabled:opacity-50 flex items-center justify-center space-x-3 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Scan...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Develop Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-5 rounded-2xl font-bold text-[10px] uppercase tracking-wider border border-red-100 flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-apollo-grey rounded-3xl shadow-inner aspect-video relative overflow-hidden border-[16px] border-white shadow-2xl flex items-center justify-center group">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                   <div className="w-24 h-24 border-4 border-slate-200 border-t-apollo-blue rounded-full animate-spin" />
                   <HeartPulse className="absolute inset-0 m-auto w-10 h-10 text-apollo-red animate-pulse" />
                </div>
                <div className="text-center">
                   <p className="text-apollo-blue font-black uppercase tracking-[0.3em] text-[10px]">Processing Volumetric Data</p>
                   <p className="text-slate-400 text-[9px] mt-2 italic font-medium">Fine-tuning anatomical depth...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover animate-in fade-in duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all">
                  <div className="absolute top-8 right-8 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="bg-white p-3 rounded-xl shadow-xl hover:bg-apollo-blue hover:text-white transition-all"><Maximize2 className="w-5 h-5" /></button>
                    <a href={generatedImage} download="girm-scan.png" className="bg-apollo-red p-3 rounded-xl shadow-xl hover:bg-apollo-blue transition-all text-white"><Download className="w-5 h-5" /></a>
                  </div>
                  <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all">
                    <div className="bg-apollo-blue/90 backdrop-blur-md px-6 py-3 rounded-xl text-white text-[10px] font-black tracking-[0.2em] flex items-center space-x-3 border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-apollo-red animate-pulse" />
                      <span>{imageSize} DIAGNOSTIC ASSET</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-20">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <ImageIcon className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Clinical Canvas</h3>
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mt-4">Awaiting Input Parameters</p>
              </div>
            )}
          </div>
          
          {gallery.length > 0 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <div className="flex items-center space-x-3 mb-6">
                  <History className="w-5 h-5 text-apollo-blue" />
                  <h4 className="text-xs font-black text-apollo-blue uppercase tracking-widest">Session Vault</h4>
               </div>
               <div className="grid grid-cols-4 gap-4">
                  {gallery.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setGeneratedImage(img)}
                      className="aspect-video rounded-xl overflow-hidden border-2 border-slate-50 hover:border-apollo-blue transition-all cursor-pointer shadow-sm group"
                    >
                       <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
