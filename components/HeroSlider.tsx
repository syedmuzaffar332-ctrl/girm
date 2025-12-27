
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1519494026892-80bb125640fb?auto=format&fit=crop&q=80&w=1920',
    title: 'GIRM Hospitals: Healing Hands, Caring Hearts',
    subtitle: 'Access world-class medical excellence with over 15+ years of specialized surgical expertise.'
  },
  {
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1920',
    title: 'Advanced Diagnostics & Pro-Care',
    subtitle: 'Equipped with Asia\'s most advanced robotic surgery systems and diagnostic suites.'
  },
  {
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1920',
    title: 'Touch of Apollo, Heart of GIRM',
    subtitle: 'Redefining healthcare standards through clinical innovation and compassionate patient care.'
  }
];

interface HeroSliderProps {
  onEnroll: () => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ onEnroll }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[550px] w-full overflow-hidden bg-apollo-navy">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-apollo-navy/80 via-apollo-navy/40 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center z-20 px-4 md:px-20 text-left">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg uppercase">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={onEnroll}
                  className="w-full sm:w-auto bg-apollo-red text-white px-10 py-4 rounded font-black text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-apollo-red transition-all shadow-2xl"
                >
                  Book Appointment
                </button>
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-apollo-blue text-white px-10 py-4 rounded font-black text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-apollo-blue transition-all border border-white/20"
                >
                  View Specialists
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded bg-white/10 text-white hover:bg-apollo-red transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded bg-white/10 text-white hover:bg-apollo-red transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all ${
              index === currentSlide ? 'bg-apollo-red w-8' : 'bg-white/40 w-4'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
