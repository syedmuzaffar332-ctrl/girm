
import React, { useState, useEffect } from 'react';
import { SERVICES, DOCTORS, BEDS, BLOGS, DEPARTMENTS } from '../constants';
import { db } from '../services/database';
import { Feedback, Doctor } from '../types';
import * as Icons from 'lucide-react';

export const AboutSection: React.FC = () => (
  <section id="about" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="border-[12px] border-apollo-grey rounded overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
              alt="Hospital Interior"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-apollo-red text-white p-8 rounded shadow-2xl hidden md:block">
            <span className="text-4xl font-black block leading-none">15+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 block">Years of Trust</span>
          </div>
        </div>
        <div>
          <div className="w-16 h-1.5 bg-apollo-red mb-6" />
          <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Our Commitment</span>
          <h2 className="text-4xl font-black text-apollo-blue mb-6 leading-tight uppercase tracking-tighter">Setting New Standards in Clinical Excellence</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            GIRM Hospital is committed to providing international quality healthcare that is both accessible and affordable. Our ecosystem brings together the brightest medical minds and the latest technology to ensure optimal patient outcomes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-apollo-grey border-l-4 border-apollo-blue">
              <h4 className="text-2xl font-black text-apollo-blue mb-1">500+</h4>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Hospital Beds</p>
            </div>
            <div className="p-6 bg-apollo-grey border-l-4 border-apollo-red">
              <h4 className="text-2xl font-black text-apollo-blue mb-1">120+</h4>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Specialists</p>
            </div>
          </div>
          <button className="mt-10 bg-apollo-blue text-white px-10 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-apollo-red transition-colors shadow-lg shadow-apollo-blue/20">
            Read More History
          </button>
        </div>
      </div>
    </div>
  </section>
);

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <section id="services" className="py-24 bg-apollo-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-20 h-1.5 bg-apollo-red mx-auto mb-6" />
          <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Medical Specialties</span>
          <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Centers of Excellence</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Providing comprehensive care across multi-disciplinary surgical and clinical departments.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Circle;
            return (
              <div 
                key={service.id} 
                className={`bg-white p-10 rounded-2xl shadow-sm transition-all duration-500 border-2 group cursor-pointer ${
                  selectedService === service.id ? 'border-apollo-blue ring-4 ring-apollo-blue/5 scale-[1.02]' : 'border-transparent hover:border-apollo-red hover:shadow-xl'
                }`}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                    selectedService === service.id ? 'bg-apollo-blue text-white shadow-lg' : 'bg-apollo-grey text-apollo-blue group-hover:bg-apollo-red group-hover:text-white'
                  }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <Icons.Plus className={`w-5 h-5 transition-transform duration-500 ${selectedService === service.id ? 'rotate-45 text-apollo-red' : 'text-slate-300'}`} />
                </div>
                <h3 className="text-xl font-black text-apollo-blue mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.description}</p>
                
                {selectedService === service.id && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black text-apollo-red uppercase tracking-widest">Core Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {service.specialties?.map((spec, i) => (
                        <span key={i} className="bg-apollo-grey text-[10px] font-bold text-apollo-blue px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-tighter">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-apollo-blue text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-apollo-red transition-all">
                      Enquire Department
                    </button>
                  </div>
                )}
                
                {selectedService !== service.id && (
                  <div className="text-apollo-red font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 group-hover:translate-x-2 transition-all">
                    <span>Explore Scope</span>
                    <Icons.ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const FeedbackSection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: DEPARTMENTS[0], comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFeedbacks(db.getFeedback());
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: formData.name,
      department: formData.department,
      rating: formData.rating,
      comment: formData.comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: true
    };
    await db.saveFeedback(newFeedback);
    setFeedbacks([newFeedback, ...feedbacks]);
    setFormData({ name: '', department: DEPARTMENTS[0], comment: '', rating: 5 });
    setShowForm(false);
    setIsSubmitting(false);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="w-16 h-1.5 bg-apollo-red mb-6" />
            <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Patient Voices</span>
            <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter leading-none">Recoveries & Real Stories</h2>
            <p className="text-slate-600 text-lg">Hear directly from the patients who entrusted their care to GIRM.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-apollo-blue text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-apollo-red transition-all shadow-xl"
          >
            {showForm ? 'Close Form' : 'Share Your Story'}
          </button>
        </div>

        {showForm && (
          <div className="mb-16 bg-apollo-grey p-10 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleFeedbackSubmit} className="max-w-4xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patient Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue font-bold focus:ring-2 focus:ring-apollo-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Department Attended</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue font-bold"
                  >
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Experience</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue font-bold focus:ring-2 focus:ring-apollo-blue"
                  placeholder="How was your recovery journey?"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setFormData({...formData, rating: star})}
                    >
                      <Icons.Star className={`w-6 h-6 ${formData.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={isSubmitting} className="bg-apollo-red text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center space-x-3">
                  {isSubmitting ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <Icons.Send className="w-4 h-4" />}
                  <span>Submit Story</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbacks.map((f) => (
            <div key={f.id} className="bg-apollo-grey p-10 rounded-3xl border border-transparent hover:border-slate-200 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} className={`w-3 h-3 ${i < f.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                  ))}
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{f.date}</span>
              </div>
              <p className="text-slate-600 text-sm italic leading-relaxed mb-8 flex-grow">"{f.comment}"</p>
              <div className="pt-6 border-t border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-apollo-blue shadow-sm border border-slate-100 font-black">
                  {f.patientName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-apollo-blue uppercase tracking-tight">{f.patientName}</h4>
                  <div className="flex items-center space-x-2 text-[9px] font-black text-apollo-red uppercase tracking-widest mt-1">
                    <Icons.CheckCircle className="w-3 h-3" />
                    <span>Verified: {f.department}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-apollo-blue text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start lg:px-8">
        <div className="relative">
          <div className="w-16 h-1.5 bg-apollo-red mb-8" />
          <h2 className="text-5xl font-black mb-10 uppercase tracking-tighter leading-none">Global Care Infrastructure</h2>
          
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-apollo-red transition-all group">
                 <Icons.Phone className="w-6 h-6 text-apollo-red mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="text-[10px] font-black uppercase text-apollo-red tracking-widest mb-2">Main Registry</h4>
                 <p className="font-bold text-lg">+1 (555) GIRM-DOC</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-apollo-red transition-all group">
                 <Icons.Mail className="w-6 h-6 text-apollo-red mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="text-[10px] font-black uppercase text-apollo-red tracking-widest mb-2">Medical Inquiries</h4>
                 <p className="font-bold text-lg">care@girmhospitals.com</p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase text-white/40 tracking-[0.3em] border-l-2 border-apollo-red pl-4">Departmental Directory</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                 {[
                   { name: 'Laboratory Services', ext: 'Ext 102' },
                   { name: 'Radiology Dept', ext: 'Ext 105' },
                   { name: 'Pharmacy 24/7', ext: 'Ext 109' },
                   { name: 'In-Patient Billing', ext: 'Ext 210' },
                   { name: 'Patient Relations', ext: 'Ext 500' },
                   { name: 'Media Relations', ext: 'Ext 888' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[11px] font-bold text-white/60">{item.name}</span>
                      <span className="text-[10px] font-black text-apollo-red">{item.ext}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-8 bg-apollo-red rounded-3xl flex items-center space-x-6 shadow-2xl">
               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-apollo-red">
                 <Icons.MapPin className="w-7 h-7" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter">Main Healthcare Hub</h4>
                  <p className="text-xs font-medium text-white/80 mt-1">123 Clinical Plaza, Sector 4, Medicity 10001</p>
               </div>
               <Icons.ExternalLink className="w-5 h-5 ml-auto text-white/40" />
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-3xl p-12 shadow-2xl relative overflow-hidden lg:mt-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-apollo-grey -translate-y-1/2 translate-x-1/2 rounded-full" />
          
          {submitted ? (
            <div className="py-20 text-center animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Icons.CheckCircle className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tighter">Transmission Successful</h3>
               <p className="text-slate-500 text-sm mt-4 font-medium max-w-xs mx-auto">Your inquiry has been logged into our Clinical CRM. A coordinator will contact you within 4 hours.</p>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-black text-apollo-blue mb-2 uppercase tracking-tighter">Patient Inquiry</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Direct communication with our care team</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Identity</label>
                    <input type="text" required placeholder="Johnathan Doe" className="w-full bg-apollo-grey border-b-2 border-slate-100 px-6 py-4 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold rounded-t-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Medium</label>
                    <input type="email" required placeholder="name@domain.com" className="w-full bg-apollo-grey border-b-2 border-slate-100 px-6 py-4 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold rounded-t-xl" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Department Targeted</label>
                  <select className="w-full bg-apollo-grey border-b-2 border-slate-100 px-6 py-4 text-apollo-blue font-bold rounded-t-xl appearance-none">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Describe Requirement</label>
                  <textarea required rows={5} placeholder="State your health concern or inquiry details..." className="w-full bg-apollo-grey border-b-2 border-slate-100 px-6 py-4 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold rounded-t-xl" />
                </div>

                <button className="w-full bg-apollo-red text-white font-black py-5 rounded-2xl uppercase text-sm tracking-[0.2em] hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20 flex items-center justify-center space-x-3 group">
                  <span>Send Message to GIRM Care</span>
                  <Icons.Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export const BedAvailabilitySection: React.FC = () => (
  <section className="py-24 bg-white border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-apollo-blue uppercase tracking-tighter">Real-time Bed Availability</h2>
        <p className="text-slate-500 mt-2">Transparent tracking for emergency and general admissions.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {BEDS.map((bed, idx) => (
          <div key={idx} className="bg-apollo-grey p-8 rounded-xl text-center border border-slate-200">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{bed.department}</h4>
            <div className="text-4xl font-black text-apollo-blue mb-2">{bed.total - bed.occupied}</div>
            <p className="text-[10px] font-bold text-apollo-red uppercase">Available Beds</p>
            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
               <div 
                className="h-full bg-apollo-blue" 
                style={{ width: `${(bed.occupied / bed.total) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const BlogSection: React.FC = () => (
  <section className="py-24 bg-apollo-grey">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-apollo-red font-black uppercase text-xs tracking-widest">Health Library</span>
            <h2 className="text-3xl font-black text-apollo-blue uppercase tracking-tighter mt-2">Medical Insights</h2>
          </div>
          <button className="text-apollo-blue font-black text-xs uppercase tracking-widest hover:text-apollo-red transition-colors">View All Posts</button>
       </div>
       <div className="grid md:grid-cols-2 gap-8">
          {BLOGS.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row border border-slate-100">
              <img src={blog.image} alt={blog.title} className="w-full md:w-48 h-48 object-cover" />
              <div className="p-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{blog.date}</span>
                <h3 className="text-xl font-black text-apollo-blue mt-2 mb-4 uppercase leading-tight">{blog.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full bg-apollo-blue/10 flex items-center justify-center text-apollo-blue">
                      <Icons.User className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-slate-600">{blog.author}</span>
                </div>
              </div>
            </div>
          ))}
       </div>
    </div>
  </section>
);

interface DoctorModalProps {
  doctor: Doctor;
  onClose: () => void;
}

const DoctorProfileModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-apollo-navy/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-10 p-3 bg-white/80 backdrop-blur text-apollo-blue rounded-full hover:bg-apollo-red hover:text-white transition-all shadow-lg"
        >
          <Icons.X className="w-6 h-6" />
        </button>

        <div className="overflow-y-auto custom-scrollbar">
          {/* Modal Header/Hero */}
          <div className="bg-apollo-blue p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
              <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left pt-4">
                <span className="bg-apollo-red text-white font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
                  {doctor.specialty}
                </span>
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">{doctor.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur">
                    <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-black text-sm">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur">
                    <Icons.Users className="w-4 h-4" />
                    <span className="font-black text-sm uppercase tracking-widest text-[11px]">{doctor.reviews} Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {/* Bio & Education */}
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xs font-black text-apollo-red uppercase tracking-[0.3em] flex items-center space-x-3">
                  <Icons.FileText className="w-4 h-4" />
                  <span>Full Clinical Biography</span>
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 text-lg leading-relaxed font-medium italic border-l-4 border-apollo-blue pl-6">
                    {doctor.fullBio || doctor.description}
                  </p>
                  <div className="mt-6 text-slate-500 text-sm leading-relaxed">
                    With over 15 years of surgical leadership, {doctor.name} has dedicated their career to clinical innovation. At GIRM Hospital, they lead several multi-disciplinary teams and contribute significantly to medical research in {doctor.specialty}.
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xs font-black text-apollo-red uppercase tracking-[0.3em] flex items-center space-x-3">
                  <Icons.Award className="w-4 h-4" />
                  <span>Academic Credits</span>
                </h3>
                <div className="space-y-3">
                  {doctor.education?.map((edu, i) => (
                    <div key={i} className="bg-apollo-grey p-4 rounded-xl border border-slate-100 flex items-start space-x-3">
                      <Icons.ChevronRight className="w-4 h-4 text-apollo-blue shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">{edu}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Precise Daily Consultation Timings Section */}
            <div className="bg-apollo-grey p-10 rounded-[32px] border border-slate-100">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-apollo-blue shadow-sm">
                      <Icons.Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest">In-Clinic Roster</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Confirmed Availability</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Accepting Patients Now</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Standard Hours</p>
                     <p className="text-lg font-black text-apollo-blue">{doctor.timings}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-2">OPD / Emergency</p>
                     <p className="text-sm font-bold text-apollo-red uppercase tracking-tight">Available on call 24/7</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tele-Health</p>
                        <p className="text-sm font-bold text-slate-700">Daily Slots Available</p>
                     </div>
                     <Icons.Video className="w-5 h-5 text-apollo-blue" />
                  </div>
               </div>
            </div>

            {/* Patient Reviews Section */}
            <div className="space-y-8">
               <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                  <h3 className="text-xs font-black text-apollo-red uppercase tracking-[0.3em] flex items-center space-x-3">
                    <Icons.MessageCircle className="w-4 h-4" />
                    <span>Verified Patient Reviews</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Icons.CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>Based on {doctor.reviews} Testimonials</span>
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                  {doctor.reviewsList?.map((rev, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative group hover:border-apollo-blue/30 transition-all">
                       <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 bg-apollo-grey rounded-xl flex items-center justify-center font-black text-apollo-blue border border-slate-100 shadow-sm">
                                {rev.patientName.charAt(0)}
                             </div>
                             <div>
                                <span className="text-xs font-black text-apollo-blue uppercase tracking-tight block">{rev.patientName}</span>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{rev.date}</span>
                             </div>
                          </div>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                             <Icons.Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                             <span className="text-xs font-black text-apollo-blue">{rev.rating}</span>
                          </div>
                       </div>
                       <p className="text-slate-500 text-sm italic leading-relaxed mb-4 font-medium">"{rev.comment}"</p>
                    </div>
                  ))}
                  
                  {/* Summary Rating Card */}
                  <div className="bg-apollo-blue text-white p-8 rounded-[32px] flex flex-col justify-center items-center text-center shadow-xl">
                    <div className="text-4xl font-black mb-2">{doctor.rating}</div>
                    <div className="flex space-x-1 mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Icons.Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                       ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Professional Excellence Score</p>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => { window.location.hash = `/enroll/${doctor.id}`; onClose(); }}
                className="bg-apollo-red text-white px-16 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-apollo-blue transition-all shadow-2xl shadow-apollo-red/20 flex items-center space-x-4 group"
              >
                <span>Book Instant Consultation</span>
                <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DoctorsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = activeFilter === 'All' 
    ? DOCTORS 
    : DOCTORS.filter(doc => doc.specialty.toLowerCase().includes(activeFilter.toLowerCase()));

  const filterOptions = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];

  return (
    <section id="doctors" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="w-16 h-1.5 bg-apollo-red mb-6" />
            <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Specialist Doctors</span>
            <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter leading-none">Our Expert Medical Team</h2>
            <p className="text-slate-600 text-lg">Consult with some of Asia's most distinguished medical professionals.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-apollo-red uppercase tracking-widest">Global Roster</p>
              <p className="text-xs font-bold text-apollo-blue">Available 24/7 for Emergency</p>
            </div>
            <button className="bg-apollo-blue text-white px-10 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-apollo-red transition-all shadow-xl">
              Find a Doctor
            </button>
          </div>
        </div>

        {/* SPECIALTY FILTER BAR */}
        <div className="mb-12 flex flex-wrap gap-3 items-center border-b border-slate-100 pb-8 overflow-x-auto no-scrollbar">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4 whitespace-nowrap">Filter by Department:</span>
           {filterOptions.map(f => (
             <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                activeFilter === f 
                  ? 'bg-apollo-blue text-white border-apollo-blue shadow-lg shadow-apollo-blue/20' 
                  : 'bg-apollo-grey text-slate-500 border-transparent hover:border-apollo-blue hover:text-apollo-blue'
              }`}
             >
               {f}
             </button>
           ))}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => {
            return (
              <div 
                key={doctor.id} 
                className="group bg-white rounded-[32px] p-8 border-2 border-slate-100 transition-all duration-500 shadow-sm flex flex-col h-fit relative overflow-hidden animate-in fade-in zoom-in-95 hover:border-apollo-blue/30 hover:shadow-xl hover:scale-[1.01]"
              >
                {/* Real-time Status Header */}
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-[0.15em]">Consulting Now</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-apollo-blue group-hover:text-white transition-colors text-slate-400">
                    <Icons.Video className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-4 relative z-10">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white shrink-0 group-hover:rotate-3 transition-transform duration-500">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-apollo-red/10 text-apollo-red font-black text-[9px] px-2 py-1 rounded uppercase tracking-widest">{doctor.specialty}</span>
                    </div>
                    <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tighter leading-none">{doctor.name}</h3>
                    
                    <div className="flex items-center space-x-3 mt-3 bg-apollo-grey/40 p-2 rounded-xl border border-slate-100/50">
                      <div className="flex items-center space-x-1">
                        <Icons.Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-black text-apollo-blue">{doctor.rating}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="flex items-center space-x-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Icons.Users className="w-3 h-3" />
                        <span>{doctor.reviews} Reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mb-6 mt-2">
                  <div className="bg-apollo-grey/50 rounded-2xl p-5 border-2 border-slate-100 group-hover:bg-apollo-blue/5 group-hover:border-apollo-blue/20 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3 pb-2 border-b border-slate-200/50">
                        <Icons.CalendarClock className="w-3.5 h-3.5 text-apollo-red" />
                        <h4 className="text-[10px] font-black uppercase text-apollo-blue tracking-widest">Availability</h4>
                    </div>
                    <div className="text-lg font-black text-apollo-blue tracking-tight leading-tight">
                      {doctor.timings}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <button 
                    onClick={() => window.location.hash = `/enroll/${doctor.id}`}
                    className="bg-apollo-blue text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-apollo-red transition-all shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Icons.Calendar className="w-3.5 h-3.5" />
                    <span>Book Visit</span>
                  </button>
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border border-slate-200 bg-apollo-grey text-apollo-blue hover:bg-apollo-blue hover:text-white flex items-center justify-center space-x-2 group/btn"
                  >
                    <Icons.UserCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>View Profile</span>
                  </button>
                </div>
                
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-apollo-grey rounded-full translate-y-1/2 translate-x-1/2 -z-0 opacity-30" />
              </div>
            );
          }) : (
            <div className="col-span-full py-20 text-center bg-apollo-grey rounded-[32px] border-2 border-dashed border-slate-200">
               <Icons.Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
               <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tighter">No Specialists Found</h3>
               <button onClick={() => setActiveFilter('All')} className="mt-6 text-apollo-red font-black text-xs uppercase tracking-widest hover:underline">View All Specialists</button>
            </div>
          )}
        </div>
      </div>

      {selectedDoctor && (
        <DoctorProfileModal 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </section>
  );
};
