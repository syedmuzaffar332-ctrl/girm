
import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse, UserCircle, Sparkles, Video, PhoneCall, MapPin, Globe, Key, CheckCircle, AlertCircle, LayoutDashboard, VideoIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        setHasKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Image Lab', path: '/visual-lab', icon: <Sparkles className="w-3 h-3 text-apollo-blue" /> },
    { name: 'Video Insights', path: '/video-analysis', icon: <VideoIcon className="w-3 h-3 text-apollo-red" /> },
    { name: 'Video Lab', path: '/video-lab', icon: <Video className="w-3 h-3 text-apollo-red" /> },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-apollo-blue text-white py-2 px-4 sm:px-6 lg:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-apollo-red" />
              <span>Emergency: 1066</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-apollo-red" />
              <span>Find a Hospital</span>
            </div>
            <button 
              onClick={handleOpenKeyDialog}
              className="flex items-center space-x-2 hover:text-apollo-red transition-colors group border-l border-white/10 pl-4"
            >
              <Key className={`w-3.5 h-3.5 ${hasKey ? 'text-green-400' : 'text-apollo-red animate-pulse'}`} />
              <span>API Status: {hasKey ? 'Active' : 'Configure'}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-apollo-red">
               <Globe className="w-3.5 h-3.5" />
               <span>Language</span>
            </div>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="hover:text-apollo-red transition-colors">Billing Docs</a>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleLinkClick('/')}>
              <div className="bg-apollo-red p-2 rounded">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-apollo-blue tracking-tighter leading-none">GIRM</span>
                <span className="text-[10px] font-bold text-apollo-red uppercase tracking-[0.2em] leading-none mt-1">Hospitals</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-[13px] font-bold uppercase tracking-tight transition-colors flex items-center space-x-1.5 ${
                    currentPath === link.path || currentPath === `#${link.path}` ? 'text-apollo-red underline underline-offset-8 decoration-2' : 'text-apollo-blue hover:text-apollo-red'
                  }`}
                >
                  {link.icon && link.icon}
                  <span>{link.name}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLinkClick(user.role === 'admin' ? '/admin' : '/dashboard')}
                    className="flex items-center space-x-2 text-apollo-blue hover:text-apollo-red transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-xs font-black uppercase">Portal</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-[11px] font-bold uppercase text-slate-500 hover:text-apollo-red transition-colors"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => handleLinkClick('/enroll')}
                    className="bg-apollo-red text-white px-6 py-2.5 rounded text-[12px] font-black uppercase tracking-widest hover:bg-apollo-blue transition-all shadow-lg shadow-apollo-red/20"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleLinkClick('/login')} className="text-[11px] font-bold uppercase text-apollo-blue hover:text-apollo-red px-4">Login</button>
                  <button onClick={() => handleLinkClick('/enroll')} className="bg-apollo-red text-white px-6 py-2.5 rounded text-[12px] font-black uppercase tracking-widest hover:bg-apollo-blue transition-all shadow-lg shadow-apollo-red/20">Book Appointment</button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-apollo-blue p-2">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => handleLinkClick(link.path)} className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm font-bold uppercase text-apollo-blue hover:bg-apollo-grey hover:text-apollo-red rounded">
              {link.icon && link.icon}
              <span>{link.name}</span>
            </button>
          ))}
          <div className="pt-4 flex flex-col space-y-2 px-4 border-t border-slate-100">
             {user && (
               <button onClick={() => handleLinkClick('/dashboard')} className="w-full bg-apollo-blue text-white py-4 rounded font-black uppercase text-sm tracking-widest mb-2 flex items-center justify-center space-x-2">
                 <LayoutDashboard className="w-4 h-4" />
                 <span>Patient Portal</span>
               </button>
             )}
             <button onClick={handleOpenKeyDialog} className="w-full bg-apollo-grey text-apollo-blue py-4 rounded font-black uppercase text-sm tracking-widest mb-2">Configure AI Key</button>
             <button onClick={() => handleLinkClick('/enroll')} className="w-full bg-apollo-red text-white py-4 rounded font-black uppercase text-sm tracking-widest">Book Appointment</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
