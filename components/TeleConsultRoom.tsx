
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  Settings, 
  Maximize2, 
  MessageSquare, 
  ClipboardList, 
  Activity, 
  User,
  Heart,
  ShieldCheck,
  Clock,
  MoreVertical,
  X
} from 'lucide-react';
import { Enrollment, Doctor } from '../types';
import { DOCTORS } from '../constants';

interface TeleConsultRoomProps {
  appointmentId: string;
  onEnd: () => void;
}

const TeleConsultRoom: React.FC<TeleConsultRoomProps> = ({ appointmentId, onEnd }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simulated Doctor Connection
  const [isDoctorConnected, setIsDoctorConnected] = useState(false);
  const appointment = useRef<Enrollment | undefined>(undefined);
  const doctor = useRef<Doctor | undefined>(undefined);

  useEffect(() => {
    // Find appointment and doctor
    const enrollments = JSON.parse(localStorage.getItem('girm_hospital_enrollments') || '[]');
    appointment.current = enrollments.find((e: Enrollment) => e.id === appointmentId);
    if (appointment.current) {
      doctor.current = DOCTORS.find(d => d.id === appointment.current?.doctorId);
    }

    // Initialize Camera
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    // Simulation: Doctor connects after 3 seconds
    const timer = setTimeout(() => setIsDoctorConnected(true), 3000);
    const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [appointmentId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (window.confirm("End medical consultation?")) {
      onEnd();
    }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => t.enabled = isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-apollo-navy flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Clinical HUD Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md relative z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Clinical Session ID: {appointmentId.toUpperCase()}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center space-x-3 text-white/60">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <button className="text-white/40 hover:text-white"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-grow flex relative">
        {/* Main Consultation Area */}
        <div className="flex-grow relative bg-slate-900 flex items-center justify-center">
          {isDoctorConnected ? (
            <div className="w-full h-full relative">
              {/* Doctor Placeholder / Video */}
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center overflow-hidden">
                 <img 
                   src={doctor.current?.image} 
                   className="w-full h-full object-cover opacity-50 blur-xl scale-110" 
                   alt=""
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-apollo-navy via-transparent to-black/40" />
                 <div className="relative text-center">
                    <div className="w-48 h-48 rounded-full border-8 border-white/10 overflow-hidden mx-auto mb-8 shadow-2xl relative">
                       <img src={doctor.current?.image} className="w-full h-full object-cover" alt="" />
                       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">LIVE</div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{doctor.current?.name}</h2>
                    <p className="text-apollo-red font-black text-xs uppercase tracking-[0.3em]">{doctor.current?.specialty}</p>
                 </div>
              </div>
              
              {/* Remote Vital Data Overlay */}
              <div className="absolute top-10 left-10 space-y-4">
                 <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center space-x-4 w-48 shadow-2xl">
                    <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                    <div>
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Heart Rate</p>
                       <p className="text-xl font-black text-white">72 <span className="text-[10px] text-white/60">BPM</span></p>
                    </div>
                 </div>
                 <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center space-x-4 w-48 shadow-2xl">
                    <Activity className="w-6 h-6 text-blue-500" />
                    <div>
                       <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Connection</p>
                       <p className="text-xl font-black text-white">98 <span className="text-[10px] text-white/60">MS</span></p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-10 animate-in zoom-in-95">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-white/10 border-t-apollo-red rounded-full animate-spin" />
                  <User className="absolute inset-0 m-auto w-8 h-8 text-white/20" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Establishing Secure Link</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Waiting for {doctor.current?.name || 'Doctor'} to join</p>
               </div>
            </div>
          )}

          {/* Patient Self Preview */}
          <div className="absolute bottom-10 right-10 w-80 aspect-video rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-black group transition-all hover:scale-105 hover:border-white/40">
             {isVideoOff ? (
               <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <User className="w-12 h-12 text-white/10" />
               </div>
             ) : (
               <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
             )}
             <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                Patient Preview
             </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        {showNotes && (
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest flex items-center space-x-3">
                   <ClipboardList className="w-4 h-4 text-apollo-red" />
                   <span>Clinical Notes</span>
                </h3>
                <button onClick={() => setShowNotes(false)}><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             <div className="flex-grow p-6 space-y-8 overflow-y-auto">
                <div className="bg-apollo-grey p-5 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Diagnosis Draft</p>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"Doctor is currently observing symptoms. Patient reports mild fatigue and slight chest tightness..."</p>
                </div>
                
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chat Stream</p>
                   <div className="bg-blue-50 p-4 rounded-xl text-xs font-medium text-blue-800">
                      Doctor: "I've reviewed your recent ECG. Let's discuss the results."
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl text-xs font-medium text-slate-600 text-right">
                      Patient: "Sure doctor, I am ready."
                   </div>
                </div>
             </div>
             <div className="p-6 border-t border-slate-100">
                <div className="relative">
                   <input type="text" placeholder="Send a message..." className="w-full bg-apollo-grey border-none rounded-xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-apollo-blue" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="h-28 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-center space-x-8 px-10 relative z-50">
         <button 
           onClick={toggleMute}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </button>
         
         <button 
           onClick={toggleVideo}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
         </button>

         <button 
           onClick={handleEndCall}
           className="w-20 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30"
         >
           <PhoneOff className="w-7 h-7" />
         </button>

         <div className="h-10 w-px bg-white/10" />

         <button 
           onClick={() => setShowNotes(!showNotes)}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showNotes ? 'bg-apollo-blue text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
         >
           <ClipboardList className="w-6 h-6" />
         </button>
         
         <button className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
           <MoreVertical className="w-6 h-6" />
         </button>
      </div>

      <style>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
};

export default TeleConsultRoom;