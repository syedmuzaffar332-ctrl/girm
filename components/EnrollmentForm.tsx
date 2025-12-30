
import React, { useState, useMemo, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../constants';
import { Enrollment, User, Doctor } from '../types';
import { db } from '../services/database';
import { 
  Loader2, 
  CheckCircle2, 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Clock, 
  Stethoscope, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Star,
  Info,
  ShieldCheck,
  Award,
  Video,
  MapPin
} from 'lucide-react';

interface EnrollmentFormProps {
  user: User | null;
  initialDoctorId?: number;
  onSuccess: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ user, initialDoctorId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    gender: 'male' as Enrollment['gender'],
    department: DEPARTMENTS[0],
    doctorId: undefined as number | undefined,
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '',
    consultationType: 'in-person' as Enrollment['consultationType'],
    message: ''
  });

  // Handle deep-linked doctor selection
  useEffect(() => {
    if (initialDoctorId) {
      const doc = DOCTORS.find(d => d.id === initialDoctorId);
      if (doc) {
        setFormData(prev => ({
          ...prev,
          doctorId: doc.id,
          department: DEPARTMENTS.find(d => doc.specialty.includes(d)) || DEPARTMENTS[0]
        }));
        if (user) {
          setStep(3);
        } else {
          setStep(1);
        }
      }
    }
  }, [initialDoctorId, user]);

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => 
      doc.specialty.toLowerCase().includes(formData.department.toLowerCase()) ||
      formData.department === 'General Medicine'
    );
  }, [formData.department]);

  const selectedDoctor = useMemo(() => 
    DOCTORS.find(d => d.id === formData.doctorId), 
    [formData.doctorId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    try {
      const enrollment: Enrollment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id,
        ...formData,
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await db.saveEnrollment(enrollment);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 4000);
    } catch (error) {
      alert('Error submitting appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-green-500/30 scale-110 relative z-10">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter leading-none relative z-10">Appointment Verified</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto font-medium relative z-10">
          Your clinical visit has been authorized. Access details in your <span className="text-apollo-blue font-bold">Patient Portal</span>.
        </p>
        <div className="bg-apollo-grey p-8 rounded-[32px] w-full max-w-md border-2 border-green-200 text-left space-y-4 shadow-xl relative z-10 scale-105">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Officer</span>
            <span className="text-sm font-black text-apollo-blue">{selectedDoctor?.name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mode</span>
            <span className="text-sm font-black text-apollo-red uppercase">{formData.consultationType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Registry ID</span>
            <span className="text-sm font-mono font-black text-apollo-navy">GIRM-{Math.floor(1000 + Math.random() * 9000)}</span>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Identity', icon: UserIcon },
    { id: 2, label: 'Specialist', icon: Stethoscope },
    { id: 3, label: 'Timeline', icon: CalendarIcon },
    { id: 4, label: 'Mode', icon: Video },
    { id: 5, label: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-apollo-blue uppercase tracking-tighter mb-2">Registry Enrollment</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Digital Health Architecture</p>
      </div>

      <div className="flex items-center justify-between mb-16 px-4 md:px-10">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center relative">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                step >= s.id ? 'bg-apollo-blue text-white shadow-apollo-blue/20' : 'bg-white text-slate-300 border-2 border-slate-100'
              }`}>
                <s.icon className={`w-6 h-6 ${step === s.id ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-black uppercase tracking-widest ${step >= s.id ? 'text-apollo-blue' : 'text-slate-300'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-grow h-1 mx-4 rounded-full transition-all duration-700 ${step > s.id ? 'bg-apollo-blue' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-apollo-grey rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50" />
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
              <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tight">Patient Identity</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-apollo-grey border-none rounded-2xl px-6 py-5 text-apollo-blue font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Email</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-apollo-grey border-none rounded-2xl px-6 py-5 text-apollo-blue font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Phone</label>
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-apollo-grey border-none rounded-2xl px-6 py-5 text-apollo-blue font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">DOB</label>
                  <input required type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-apollo-grey border-none rounded-2xl px-6 py-5 text-apollo-blue font-bold" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
              <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tight">Specialist Roster</h3>
              <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value, doctorId: undefined })} className="w-full bg-apollo-grey border-none rounded-2xl px-6 py-5 text-apollo-blue font-bold">
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
              <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredDoctors.map(doc => (
                  <div key={doc.id} onClick={() => setFormData({ ...formData, doctorId: doc.id })} className={`flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${formData.doctorId === doc.id ? 'bg-apollo-blue text-white border-apollo-blue' : 'bg-white border-slate-100 hover:border-apollo-blue/20'}`}>
                    <img src={doc.image} className="w-16 h-16 rounded-2xl object-cover border-4 border-white" />
                    <div className="ml-6">
                      <p className="font-black uppercase tracking-tight">{doc.name}</p>
                      <p className={`text-[9px] font-bold uppercase ${formData.doctorId === doc.id ? 'text-white/60' : 'text-apollo-red'}`}>{doc.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
              <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tight">Registry Timeline</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <input type="date" min={new Date().toISOString().split('T')[0]} value={formData.appointmentDate} onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })} className="w-full bg-apollo-grey rounded-2xl px-6 py-5 text-apollo-blue font-black" />
                <div className="grid grid-cols-2 gap-3">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => setFormData({ ...formData, timeSlot: slot })} className={`py-4 rounded-xl text-[10px] font-black uppercase border ${formData.timeSlot === slot ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg' : 'bg-white text-slate-500 border-slate-200'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
              <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tight">Consultation Mode</h3>
              <p className="text-sm font-medium text-slate-500">Choose how you wish to meet your specialist.</p>
              <div className="grid grid-cols-2 gap-6">
                <button type="button" onClick={() => setFormData({...formData, consultationType: 'in-person'})} className={`p-8 rounded-[32px] border-4 transition-all flex flex-col items-center space-y-6 ${formData.consultationType === 'in-person' ? 'bg-apollo-blue text-white border-apollo-navy shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400 grayscale'}`}>
                  <MapPin className="w-12 h-12" />
                  <div className="text-center">
                    <p className="font-black uppercase tracking-widest text-xs">Clinical Visit</p>
                    <p className={`text-[10px] mt-2 font-bold uppercase ${formData.consultationType === 'in-person' ? 'text-white/60' : ''}`}>In-Hospital Consultation</p>
                  </div>
                </button>
                <button type="button" onClick={() => setFormData({...formData, consultationType: 'telemedicine'})} className={`p-8 rounded-[32px] border-4 transition-all flex flex-col items-center space-y-6 ${formData.consultationType === 'telemedicine' ? 'bg-apollo-red text-white border-red-800 shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400 grayscale'}`}>
                  <Video className="w-12 h-12" />
                  <div className="text-center">
                    <p className="font-black uppercase tracking-widest text-xs">Tele-Health</p>
                    <p className={`text-[10px] mt-2 font-bold uppercase ${formData.consultationType === 'telemedicine' ? 'text-white/60' : ''}`}>Secure Video Consultation</p>
                  </div>
                </button>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-4">
                <Info className="w-6 h-6 text-blue-600 shrink-0" />
                <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tighter">
                  {formData.consultationType === 'telemedicine' 
                    ? "Tele-health links are activated 15 minutes before the scheduled time in your patient portal."
                    : "Please arrive at the hospital front desk 20 minutes prior to your appointment for registration."}
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
              <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tight">Summary Verification</h3>
              <div className="bg-apollo-grey p-10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant</span>
                  <span className="font-black text-apollo-blue uppercase">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                  <span className="font-black text-apollo-red uppercase">{formData.consultationType} Visit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                  <span className="font-black text-apollo-navy uppercase">{formData.appointmentDate} @ {formData.timeSlot}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-12 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => step > 1 && setStep(step - 1)} className={`text-apollo-blue font-black uppercase text-[10px] tracking-widest ${step === 1 ? 'opacity-0' : ''}`}>Back</button>
            <button disabled={loading} type="submit" className="bg-apollo-red text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-apollo-blue transition-all shadow-xl">
              {loading ? <Loader2 className="animate-spin" /> : step === 5 ? 'Authorize Appointment' : 'Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;