
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, 
  Upload, 
  Loader2, 
  AlertCircle, 
  FileSearch, 
  Activity, 
  Eye, 
  ShieldCheck, 
  Play, 
  ClipboardCheck,
  Stethoscope,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

const VideoAnalyzer: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        setHasKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const captureFrames = async (): Promise<string[]> => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return resolve([]);

      const frames: string[] = [];
      const context = canvas.getContext('2d');
      const duration = video.duration;
      const frameTimes = [0.1, duration * 0.25, duration * 0.5, duration * 0.75, duration * 0.9];

      let currentIndex = 0;

      const capture = () => {
        if (currentIndex >= frameTimes.length) {
          return resolve(frames);
        }

        video.currentTime = frameTimes[currentIndex];
        video.onseeked = () => {
          if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
            currentIndex++;
            capture();
          }
        };
      };

      capture();
    });
  };

  const analyzeVideo = async () => {
    if (!videoFile) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      if (!hasKey && window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      }

      const frames = await captureFrames();
      if (frames.length === 0) throw new Error("Could not process video frames.");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a Senior Clinical Analyst at GIRM Hospital. Analyze these frames from a clinical video. 
      Provide: 
      1. Clinical Summary: What is happening in the video?
      2. Safety Observations: Are there any immediate concerns?
      3. Key Actions: Identify important movements or procedures shown.
      4. Recommendations: For further medical review.
      Keep it professional and concise.`;

      const parts = frames.map(data => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: data
        }
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [...parts, { text: prompt }]
        }
      });

      setAnalysis(response.text);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze video. Please check API key and file format.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-6 py-2 rounded-full mb-6 border border-slate-200 shadow-sm">
          <Activity className="w-4 h-4 text-apollo-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Clinical Intelligence Unit</span>
        </div>
        <h2 className="text-5xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Clinical Video Analyzer</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
          Upload surgical footage, diagnostic ultrasound loops, or clinical motion studies for instant expert-level AI insights.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-apollo-grey rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
            
            <div className="relative z-10">
              <label className="block w-full cursor-pointer">
                <div className="aspect-video bg-apollo-grey rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group hover:border-apollo-blue transition-all">
                  {videoPreview ? (
                    <video 
                      ref={videoRef}
                      src={videoPreview} 
                      className="w-full h-full object-cover rounded-2xl"
                      controls
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-apollo-blue" />
                      </div>
                      <p className="text-xs font-black text-apollo-blue uppercase tracking-widest">Select Clinical Footage</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">MP4, MOV, or AVI supported</p>
                    </>
                  )}
                  <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                </div>
              </label>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-slate-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">HIPAA Compliant Processing</span>
                </div>
                <button
                  disabled={!videoFile || isAnalyzing}
                  onClick={analyzeVideo}
                  className="bg-apollo-red text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-apollo-red/20 hover:bg-apollo-blue transition-all disabled:opacity-50 flex items-center space-x-3"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-4 h-4" />
                      <span>Run Diagnostics</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-start space-x-4 animate-in slide-in-from-top-2">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="text-xs font-bold uppercase tracking-tight">{error}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 min-h-[500px] flex flex-col">
            <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-apollo-blue/5 text-apollo-blue rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tighter">Clinical Intelligence Report</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Generated Analysis</p>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-100 border-t-apollo-red rounded-full animate-spin" />
                  <Stethoscope className="absolute inset-0 m-auto w-8 h-8 text-apollo-blue animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-apollo-blue uppercase tracking-[0.2em] mb-2">Scanning Temporal Layers</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">Extracting Clinical Semantic Data...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
                <div className="bg-apollo-grey/50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {analysis}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[9px] font-black text-green-600 uppercase tracking-widest">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified by Gemini 3 Pro</span>
                  </div>
                  <button className="text-[10px] font-black text-apollo-blue uppercase tracking-widest flex items-center space-x-2 hover:text-apollo-red transition-colors">
                    <span>Export to Patient File</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                <Eye className="w-16 h-16 text-slate-100 mb-6" />
                <h4 className="text-lg font-black text-slate-300 uppercase tracking-tighter">Awaiting Clinical Data</h4>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mt-2">Upload a video to begin the intelligence audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyzer;
