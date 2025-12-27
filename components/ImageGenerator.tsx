
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
  ShieldCheck
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
      setHasKey(true); // Assume success per instructions
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Ensure key selection
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
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">AI Visualization Lab</span>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">GIRM Visual Studio</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Generate professional hospital photography and medical concepts using our advanced Pro AI engine.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <div className="flex items-center space-x-2 mb-6">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">Generation Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Image Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A futuristic pediatric ward with bright colors and child-friendly murals"
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                  <span>Output Resolution</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">PRO ONLY</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                        imageSize === size
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {!hasKey && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-tighter">API Key Required</p>
                      <p className="text-[11px] text-amber-700 mt-1">
                        High-quality 4K generation requires a paid API key from a Google Cloud Project with billing enabled.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenKeyDialog}
                    className="w-full py-2 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Select Paid Project Key</span>
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-[10px] text-amber-600 underline font-medium"
                  >
                    Learn about billing
                  </a>
                </div>
              )}

              {hasKey && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">PRO ENGINE ACTIVE</span>
                </div>
              )}

              <button
                disabled={isLoading || !prompt.trim()}
                onClick={generateImage}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-3 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Developing Image...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Generate Visualization</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-medium border border-red-100 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Display Area */}
        <div className="lg:col-span-8">
          <div className="bg-slate-100 rounded-[32px] aspect-video relative overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                   <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                   <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <div className="text-center">
                   <p className="text-slate-800 font-bold uppercase tracking-widest text-xs">Processing Pixels</p>
                   <p className="text-slate-400 text-[10px] mt-1 italic">Fine-tuning {imageSize} resolution...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all group">
                  <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => window.open(generatedImage)}
                      className="bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg hover:bg-white transition-all"
                    >
                      <Maximize2 className="w-5 h-5 text-slate-800" />
                    </button>
                    <a
                      href={generatedImage}
                      download={`girm-hospital-${Date.now()}.png`}
                      className="bg-blue-600 p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-all text-white"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>{imageSize} RESOLUTION</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Ready to Visualize</h3>
                <p className="text-slate-400 text-sm max-w-sm mt-2">
                  Describe a medical setting or hospital interior to see it rendered in high definition.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engine</p>
                <p className="text-sm font-bold text-slate-900">Gemini 3 Pro</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quality</p>
                <p className="text-sm font-bold text-slate-900">Ultra-HD</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Styles</p>
                <p className="text-sm font-bold text-slate-900">Realistic Photo</p>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Usage</p>
                <p className="text-sm font-bold text-slate-900">Visualization</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
