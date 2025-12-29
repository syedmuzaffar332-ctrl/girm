
import React, { useState, useMemo } from 'react';
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
  Star
} from 'lucide-react';

interface EnrollmentFormProps {
  user: User | null;
  onSuccess: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // Fix: Explicitly type gender to avoid literal type inference from 'as const' which caused type mismatch in onClick handler
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    gender: 'male' as Enrollment['gender'],
    department: DEPARTMENTS[0],
    doctorId: undefined as number | undefined,
    timeSlot: '',
    message: ''
  });

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => 
      doc.specialty.toLowerCase().includes(formData.department.toLowerCase()) ||
      formData.department === 'General Medicine'
    );
  }, [formData.department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
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
      }, 2500);
    } catch (error) {
      alert('Error submitting appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = DOCTORS.find(d => d.id === formData.doctorId);

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-2xl p-12 border border-slate-100">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-14 h-14" />
        </div>
        <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Booking Confirmed</h2>
        <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
          Your appointment has been scheduled successfully. You will receive a confirmation SMS shortly.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl w-full max-w-sm border border-slate-200 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Doctor</span>
            <span className="text-xs font-bold text-apollo-blue">{selectedDoctor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Time Slot</span>
            <span className="text-xs font-bold text-apollo-blue">{formData.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Department</span>
            <span className="text-xs font-bold text-apollo-blue">{formData.department}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 transition-all duration-500 ${
              step >= i ? 'bg-apollo-blue text-white shadow-lg shadow-apollo-blue/20' : 'bg-white text-slate-300 border-2 border-slate-100'
            }`}>
              {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
            </div>
            <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${step >= i ? 'text-apollo-blue' : 'text-slate-300'}`}>
              {i === 1 ? 'Patient Info' : i === 2 ? 'Select Expert' : 'Schedule'}
            </span>
            {i < 3 && (
              <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${step > i ? 'bg-apollo-blue' : 'bg-slate-100'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-apollo-grey rounded-xl text-apollo-blue">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tight">Patient Identification</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Please provide valid identity details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Legal Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date of Birth</label>
                  <input
                    required
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gender</label>
                <div className="flex space-x-4">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                        formData.gender === g 
                          ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-apollo-grey rounded-xl text-apollo-blue">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tight">Expert Selection</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Choose a specialist for your consultation</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Clinical Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value, doctorId: undefined })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold appearance-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Available Specialists</label>
                <div className="grid gap-4">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setFormData({ ...formData, doctorId: doc.id })}
                        className={`flex items-center p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                          formData.doctorId === doc.id 
                            ? 'bg-apollo-blue/5 border-apollo-blue' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-6 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`text-lg font-black uppercase tracking-tight ${formData.doctorId === doc.id ? 'text-apollo-blue' : 'text-slate-800'}`}>
                                {doc.name}
                              </h4>
                              <p className="text-[10px] font-black text-apollo-red uppercase tracking-widest">{doc.specialty}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-[10px] font-black text-slate-400">{doc.rating}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{doc.timings}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 transition-all ${
                          formData.doctorId === doc.id ? 'bg-apollo-blue border-apollo-blue' : 'border-slate-200'
                        }`}>
                          {formData.doctorId === doc.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching specialists found in this department</p>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, department: 'General Medicine'})}
                        className="mt-4 text-apollo-blue font-black text-[10px] uppercase underline underline-offset-4"
                      >
                        Check General Medicine
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Symptoms / Reason for Visit</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue focus:outline-none focus:ring-2 focus:ring-apollo-blue transition-all font-bold"
                  placeholder="e.g., Persistent chest pain, fever, follow-up..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-apollo-grey rounded-xl text-apollo-blue">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tight">Finalizing Schedule</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pick a convenient time for your consultation</p>
                </div>
              </div>

              {selectedDoctor && (
                <div className="p-6 bg-apollo-grey rounded-2xl border border-slate-100 flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-apollo-blue uppercase leading-none">{selectedDoctor.name}</h4>
                    <p className="text-[10px] font-black text-apollo-red uppercase tracking-widest mt-2">{selectedDoctor.specialty}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{selectedDoctor.timings}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available Time Slots</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                        formData.timeSlot === slot 
                          ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-apollo-blue'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex space-x-4">
                  <CalendarIcon className="w-5 h-5 text-apollo-blue shrink-0" />
                  <p className="text-xs text-apollo-blue font-medium leading-relaxed">
                    <strong>Note:</strong> Appointments are subject to doctor availability. Emergency cases are prioritized. Please arrive 15 minutes before your scheduled slot.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-2 text-apollo-blue font-black uppercase text-[10px] tracking-widest hover:text-apollo-red transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            <button
              disabled={loading || (step === 2 && !formData.doctorId) || (step === 3 && !formData.timeSlot)}
              type="submit"
              className="bg-apollo-red text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-2xl shadow-apollo-red/20 disabled:opacity-50 flex items-center justify-center space-x-3 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{step === 3 ? 'Confirm Booking' : 'Next Step'}</span>
                  {step < 3 && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
