
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import { AboutSection, ServicesSection, DoctorsSection, ContactSection, BedAvailabilitySection, BlogSection, FeedbackSection } from './components/Sections';
import EnrollmentForm from './components/EnrollmentForm';
import AuthForms from './components/AuthForms';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import VideoAnalyzer from './components/VideoAnalyzer';
import TeleConsultRoom from './components/TeleConsultRoom';
import { PatientDashboard, AdminPanel } from './components/Dashboards';
import { User } from './types';
import { SERVICES, DOCTORS } from './constants';
import * as Icons from 'lucide-react';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '/');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '/');
      if (!window.location.hash.includes('#')) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    const savedUser = localStorage.getItem('girm_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('girm_current_user', JSON.stringify(user));
    if (user.role === 'admin') {
      handleNavigate('/admin');
    } else {
      handleNavigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('girm_current_user');
    handleNavigate('/');
  };

  const pageContext = useMemo(() => {
    const hashOnly = currentPath.startsWith('#/') ? currentPath : '#/';
    
    if (hashOnly.includes('/enroll')) return "Patient enrollment and appointment booking page.";
    if (hashOnly === '#/dashboard') return "Patient personal portal for records and appointments.";
    if (hashOnly === '#/admin') return "Hospital administration command center.";
    if (hashOnly === '#/video-analysis') return "Clinical video intelligence tool using Gemini Pro for surgical footage analysis.";
    if (hashOnly.includes('/tele-consult')) return "Real-time secure video consultation with a medical specialist.";
    
    const servicesList = SERVICES.map(s => s.title).join(', ');
    return `Homepage of GIRM Hospital. Services: ${servicesList}. Specialists available across departments.`;
  }, [currentPath]);

  const renderContent = () => {
    const rawPath = currentPath.startsWith('#') ? currentPath.slice(1) : currentPath;
    const pathParts = rawPath.split('/').filter(Boolean);
    const baseRoute = pathParts[0] || '';

    if (baseRoute === 'login') return <AuthForms mode="login" onAuthSuccess={handleLogin} />;
    if (baseRoute === 'signup') return <AuthForms mode="signup" onAuthSuccess={handleLogin} />;
    if (baseRoute === 'forgot') return <AuthForms mode="forgot" onAuthSuccess={handleLogin} />;
    
    if (baseRoute === 'dashboard' && user) {
      return <PatientDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
    
    if (baseRoute === 'admin' && user?.role === 'admin') {
      return <AdminPanel user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }

    if (baseRoute === 'enroll') {
      const initialDoctorId = pathParts[1] ? parseInt(pathParts[1], 10) : undefined;
      return (
        <div className="py-20 bg-slate-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <EnrollmentForm 
              user={user} 
              initialDoctorId={initialDoctorId}
              onSuccess={() => handleNavigate('/dashboard')} 
            />
          </div>
        </div>
      );
    }

    if (baseRoute === 'tele-consult') {
      const appId = pathParts[1];
      if (!appId) return <div className="p-20 text-center">Invalid consultation link.</div>;
      return <TeleConsultRoom appointmentId={appId} onEnd={() => handleNavigate('/dashboard')} />;
    }

    if (baseRoute === 'visual-lab') return <div className="py-20 bg-slate-50 min-h-screen"><ImageGenerator /></div>;
    if (baseRoute === 'video-lab') return <div className="py-20 bg-slate-50 min-h-screen"><VideoGenerator /></div>;
    if (baseRoute === 'video-analysis') return <div className="py-20 bg-slate-50 min-h-screen"><VideoAnalyzer /></div>;

    return (
      <main>
        <HeroSlider onEnroll={() => handleNavigate('/enroll')} />
        <AboutSection />
        <ServicesSection />
        <BedAvailabilitySection />
        <DoctorsSection />
        <FeedbackSection />
        <BlogSection />
        <ContactSection />
      </main>
    );
  };

  const isDashboard = currentPath.includes('dashboard') || currentPath.includes('admin') || currentPath.includes('tele-consult');

  return (
    <div className="flex flex-col min-h-screen">
      {(!currentPath.includes('tele-consult') && !isDashboard) && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
          currentPath={currentPath}
        />
      )}
      <div className="flex-grow">
        {renderContent()}
      </div>
      {!currentPath.includes('tele-consult') && (
        <VoiceAssistant pageContext={pageContext} onNavigate={handleNavigate} />
      )}
      {(!currentPath.includes('tele-consult') && !isDashboard) && <Footer />}
      
      {!currentPath.includes('tele-consult') && (
        <>
          <a href="tel:1066" className="fixed bottom-32 left-8 z-[50] bg-apollo-red text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center space-x-2">
             <div className="w-10 h-10 flex items-center justify-center animate-pulse"><Icons.PhoneCall className="w-6 h-6" /></div>
             <span className="pr-4 font-black text-xs uppercase tracking-widest hidden md:block">Emergency: 1066</span>
          </a>
          <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="fixed bottom-52 left-8 z-[50] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all">
             <Icons.MessageCircle className="w-6 h-6" />
          </a>
        </>
      )}
    </div>
  );
};

export default App;