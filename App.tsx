
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import { AboutSection, ServicesSection, DoctorsSection, ContactSection } from './components/Sections';
import EnrollmentForm from './components/EnrollmentForm';
import AuthForms from './components/AuthForms';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import { User } from './types';
import { SERVICES, DOCTORS } from './constants';

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
    handleNavigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('girm_current_user');
    handleNavigate('/');
  };

  const pageContext = useMemo(() => {
    const hashOnly = currentPath.startsWith('#/') ? currentPath : '#/';
    
    if (hashOnly === '#/enroll') {
      return "The user is currently on the Patient Enrollment page. This section contains a form for patients to register their details (name, email, phone, DOB, gender) and select a hospital department (like Cardiology or Pediatrics) for an appointment.";
    }
    if (hashOnly === '#/visual-lab') {
      return "The user is in the Visual Lab. This is an AI-powered image generation studio where medical visuals can be generated using prompts in 1K, 2K, or 4K resolutions.";
    }
    if (hashOnly === '#/video-lab') {
      return "The user is in the Video Lab. This section allows users to generate professional, cinematic medical videos using the Veo 3 engine. Users can specify aspect ratios like 16:9 or 9:16.";
    }
    if (hashOnly === '#/login' || hashOnly === '#/signup') {
      return "The user is on the authentication page, either logging in or creating a new account for the patient portal.";
    }
    
    // Default/Home context
    const servicesList = SERVICES.map(s => s.title).join(', ');
    const doctorsList = DOCTORS.map(d => d.name).join(', ');
    return `The user is on the Homepage of GIRM Hospital. They can see information about 'Setting New Standards in Medical Excellence', 'Beds Capacity (500+)', 'Specialist Doctors (120+)'. 
    Visible services include: ${servicesList}. 
    Visible doctors include: ${doctorsList}. 
    There is also a 'Contact Us' section with location details at Healthcare Plaza and phone number +1 (555) 123-4567.`;
  }, [currentPath]);

  const renderContent = () => {
    const hashOnly = currentPath.startsWith('#/') ? currentPath : '#/';

    if (hashOnly === '#/login') return <AuthForms mode="login" onAuthSuccess={handleLogin} />;
    if (hashOnly === '#/signup') return <AuthForms mode="signup" onAuthSuccess={handleLogin} />;
    if (hashOnly === '#/forgot') return <AuthForms mode="forgot" onAuthSuccess={handleLogin} />;
    if (hashOnly === '#/enroll') return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          <EnrollmentForm user={user} onSuccess={() => handleNavigate('/')} />
        </div>
      </div>
    );
    if (hashOnly === '#/visual-lab') return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <ImageGenerator />
      </div>
    );
    if (hashOnly === '#/video-lab') return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <VideoGenerator />
      </div>
    );

    return (
      <main>
        <HeroSlider onEnroll={() => handleNavigate('/enroll')} />
        <AboutSection />
        <ServicesSection />
        <DoctorsSection />
        <ContactSection />
      </main>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={handleNavigate}
        currentPath={currentPath}
      />
      <div className="flex-grow">
        {renderContent()}
      </div>
      <VoiceAssistant pageContext={pageContext} />
      <Footer />
    </div>
  );
};

export default App;
