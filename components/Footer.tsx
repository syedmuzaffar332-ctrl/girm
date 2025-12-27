
import React from 'react';
import { HeartPulse, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-apollo-navy pt-20 pb-10 border-t-8 border-apollo-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <div className="bg-apollo-red p-2 rounded">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter leading-none">GIRM</span>
                <span className="text-[10px] font-bold text-apollo-red uppercase tracking-[0.2em] leading-none mt-1">Hospitals</span>
              </div>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed text-sm font-medium">
              A healthcare ecosystem dedicated to clinical excellence, research, and patient-first innovation across the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-white/40 hover:bg-apollo-red hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-white/40 hover:bg-apollo-red hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-white/40 hover:bg-apollo-red hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Find a Doctor</a></li>
              <li><a href="#about" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Health Library</a></li>
              <li><a href="#services" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Patient Portal</a></li>
              <li><a href="#doctors" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Clinical Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Cancer Care</a></li>
              <li><a href="#" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Robotic Surgery</a></li>
              <li><a href="#" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Tele-Health</a></li>
              <li><a href="#" className="text-white/60 text-sm font-bold hover:text-apollo-red transition-colors">Emergency Care</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Health Insights</h4>
            <p className="text-white/60 text-sm mb-6 font-medium">Get medical news and healthy living tips delivered to your inbox.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-white focus:outline-none focus:border-apollo-red font-bold text-sm"
              />
              <button className="absolute right-0 top-1.5 p-2 bg-apollo-red text-white rounded hover:bg-white hover:text-apollo-red transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 text-center">
          <p className="text-white/20 text-[11px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} GIRM Healthcare Ltd. Accredited by JCI and NABH.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
