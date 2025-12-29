
import React from 'react';
import { SERVICES, DOCTORS, BEDS, BLOGS } from '../constants';
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

export const ServicesSection: React.FC = () => (
  <section id="services" className="py-24 bg-apollo-grey">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="w-20 h-1.5 bg-apollo-red mx-auto mb-6" />
        <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Medical Specialties</span>
        <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter">Centers of Excellence</h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Explore our range of comprehensive medical and surgical specialties tailored to your health needs.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {SERVICES.map((service) => {
          const IconComponent = (Icons as any)[service.icon] || Icons.Circle;
          return (
            <div key={service.id} className="bg-white p-10 rounded shadow-sm hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-apollo-red group">
              <div className="w-16 h-16 bg-apollo-grey text-apollo-blue rounded flex items-center justify-center mb-8 group-hover:bg-apollo-blue group-hover:text-white transition-all">
                <IconComponent className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-apollo-blue mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{service.description}</p>
              <button className="text-apollo-red font-black text-[11px] uppercase tracking-widest flex items-center space-x-2 hover:translate-x-2 transition-all">
                <span>Learn More</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

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

export const DoctorsSection: React.FC = () => (
  <section id="doctors" className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="max-w-xl">
          <div className="w-16 h-1.5 bg-apollo-red mb-6" />
          <span className="text-apollo-blue font-black tracking-[0.2em] uppercase text-xs mb-4 block">Specialist Doctors</span>
          <h2 className="text-4xl font-black text-apollo-blue mb-4 uppercase tracking-tighter leading-none">Our Expert Medical Team</h2>
          <p className="text-slate-600 text-lg">Consult with some of Asia's most distinguished medical professionals.</p>
        </div>
        <button className="bg-apollo-blue text-white px-10 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-apollo-red transition-all shadow-xl">
          Find a Doctor
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {DOCTORS.map((doctor) => (
          <div key={doctor.id} className="group bg-apollo-grey rounded p-4 border border-transparent hover:border-slate-200 transition-all">
            <div className="aspect-[1/1] rounded overflow-hidden mb-6 shadow-md border-4 border-white">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="px-2">
              <span className="text-apollo-red font-black text-[10px] uppercase tracking-[0.2em] mb-2 block">{doctor.specialty}</span>
              <h3 className="text-2xl font-black text-apollo-blue mb-4 uppercase tracking-tighter leading-none">{doctor.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{doctor.description}</p>
              <div className="flex items-center space-x-2 mb-6">
                <Icons.Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black text-apollo-blue">{doctor.rating}</span>
                <span className="text-xs text-slate-400">({doctor.reviews} Reviews)</span>
              </div>
              <button className="w-full bg-white border border-apollo-blue text-apollo-blue py-3 rounded text-[11px] font-black uppercase tracking-widest hover:bg-apollo-blue hover:text-white transition-all">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ContactSection: React.FC = () => (
  <section id="contact" className="py-24 bg-apollo-blue text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <div className="w-16 h-1.5 bg-apollo-red mb-6" />
          <span className="text-white/60 font-black tracking-[0.2em] uppercase text-xs mb-4 block">Connect with us</span>
          <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter leading-none">Reach Out for Personalized Care</h2>
          <div className="space-y-10">
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                <Icons.MapPin className="w-6 h-6 text-apollo-red" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-apollo-red">Corporate Address</h4>
                <p className="text-white font-bold leading-relaxed">123 Healthcare Plaza, Medicity Area,<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                <Icons.Phone className="w-6 h-6 text-apollo-red" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-apollo-red">24/7 Helpline</h4>
                <p className="text-white font-bold text-xl">+1 (555) 123-4567</p>
                <p className="text-white/60 text-xs uppercase font-bold mt-1">International: +1 (555) 987-6543</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded p-10 shadow-2xl">
          <h3 className="text-2xl font-black text-apollo-blue mb-8 uppercase tracking-tighter">Inquiry Form</h3>
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">First Name</label>
                <input type="text" className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Last Name</label>
                <input type="text" className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
              <input type="email" className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Message</label>
              <textarea rows={4} className="w-full bg-apollo-grey border-b-2 border-slate-200 px-4 py-3 text-apollo-blue focus:outline-none focus:border-apollo-red transition-all font-bold" />
            </div>
            <button className="w-full bg-apollo-red text-white font-black py-4 rounded uppercase text-xs tracking-widest hover:bg-apollo-blue transition-all shadow-xl shadow-apollo-red/20">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);
