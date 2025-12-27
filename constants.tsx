
import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  Activity, 
  Thermometer, 
  Microscope, 
  ClipboardCheck 
} from 'lucide-react';
import { Service, Doctor } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Cardiology',
    description: 'Advanced heart care with cutting-edge diagnostic technology.',
    icon: 'Heart'
  },
  {
    id: 2,
    title: 'Neurology',
    description: 'Expert treatment for neurological disorders and brain health.',
    icon: 'Activity'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Dedicated healthcare for children from birth to adolescence.',
    icon: 'Stethoscope'
  },
  {
    id: 4,
    title: 'Diagnostics',
    description: 'Precise laboratory and imaging services for accurate results.',
    icon: 'Microscope'
  },
  {
    id: 5,
    title: 'General Surgery',
    description: 'Safe and minimally invasive surgical procedures.',
    icon: 'Thermometer'
  },
  {
    id: 6,
    title: 'Emergency Care',
    description: '24/7 critical care and emergency response unit.',
    icon: 'ClipboardCheck'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    specialty: 'Chief Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'A compassionate Indian female cardiologist consulting patients with heart conditions using advanced non-invasive techniques.'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Varma',
    specialty: 'Pediatric Specialist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'A professional Indian male doctor in a lab coat, specializing in child health and neonatal emergency procedures.'
  },
  {
    id: 3,
    name: 'Dr. Priya Iyer',
    specialty: 'Neurology Lead',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Expert neurosurgeon focusing on clinical research and brain health with a focus on patient-centric recovery.'
  }
];

export const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Gastroenterology',
  'Emergency'
];
