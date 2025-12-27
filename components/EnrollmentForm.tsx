
import React, { useState } from 'react';
import { DEPARTMENTS } from '../constants';
import { Enrollment, User } from '../types';
import { db } from '../services/database';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface EnrollmentFormProps {
  user: User | null;
  onSuccess: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    gender: 'male' as const,
    department: DEPARTMENTS[0],
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const enrollment: Enrollment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user?.id,
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await db.saveEnrollment(enrollment);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      alert('Error submitting enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded shadow-2xl p-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-apollo-blue mb-2 uppercase tracking-tighter">Appointment Requested</h2>
        <p className="text-slate-600 font-medium">Your request has been prioritized. Our center of excellence will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded p-8 md:p-12 shadow-2xl border-t-8 border-apollo-blue">
      <div className="mb-10">
        <div className="w-12 h-1 bg-apollo-red mb-4" />
        <h2 className="text-3xl font-black text-apollo-blue mb-2 uppercase tracking-tighter">Registration & Appointment</h2>
        <p className="text-slate-500 font-medium">Please provide accurate details to ensure seamless hospital registration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patient Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
              placeholder="Full Legal Name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
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
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preferred Specialty</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Symptoms or Medical History</label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all font-bold"
            placeholder="Describe your current condition..."
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-apollo-red text-white font-black py-4 rounded uppercase text-xs tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span>Submit Registration</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
