
import { Service, Doctor, BedStatus, BlogPost } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Cardiology',
    description: 'Advanced heart care with cutting-edge diagnostic technology.',
    icon: 'Heart',
    longDescription: 'Our Cardiology department is equipped with state-of-the-art cath labs and non-invasive diagnostic tools, providing comprehensive care for all cardiac conditions.'
  },
  {
    id: 2,
    title: 'Neurology',
    description: 'Expert treatment for neurological disorders and brain health.',
    icon: 'Activity',
    longDescription: 'Specialized in treating stroke, epilepsy, and complex neuro-surgical procedures with robotic assistance.'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Dedicated healthcare for children from birth to adolescence.',
    icon: 'Stethoscope',
    longDescription: 'A child-friendly environment with specialists in neonatal care, pediatric surgery, and vaccinations.'
  },
  {
    id: 4,
    title: 'Diagnostics',
    description: 'Precise laboratory and imaging services for accurate results.',
    icon: 'Microscope',
    longDescription: 'High-end 3T MRI, CT Scans, and fully automated biochemistry labs.'
  },
  {
    id: 5,
    title: 'General Surgery',
    description: 'Safe and minimally invasive surgical procedures.',
    icon: 'Thermometer',
    longDescription: 'Laparoscopic and laser surgery options for faster recovery and minimal scarring.'
  },
  {
    id: 6,
    title: 'Emergency Care',
    description: '24/7 critical care and emergency response unit.',
    icon: 'ClipboardCheck',
    longDescription: 'Equipped with ACLS ambulances and trauma specialists available around the clock.'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    specialty: 'Chief Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'A compassionate cardiologist consulting patients with heart conditions using advanced non-invasive techniques.',
    rating: 4.9,
    reviews: 124,
    timings: 'Mon - Fri, 10:00 AM - 4:00 PM'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Varma',
    specialty: 'Pediatric Specialist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Expert in neonatal care and childhood infectious diseases.',
    rating: 4.8,
    reviews: 89,
    timings: 'Tue - Sat, 9:00 AM - 2:00 PM'
  },
  {
    id: 3,
    name: 'Dr. Priya Iyer',
    specialty: 'Neurology Lead',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Specializes in clinical research and advanced neurosurgery.',
    rating: 5.0,
    reviews: 56,
    timings: 'Mon - Thu, 11:00 AM - 5:00 PM'
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

export const BEDS: BedStatus[] = [
  { department: 'ICU', total: 50, occupied: 42 },
  { department: 'General Ward', total: 200, occupied: 145 },
  { department: 'Private Suite', total: 30, occupied: 12 },
  { department: 'Emergency', total: 20, occupied: 18 }
];

export const BLOGS: BlogPost[] = [
  {
    id: 1,
    title: 'Living with Hypertension',
    excerpt: 'Simple lifestyle changes that can help manage your blood pressure effectively.',
    author: 'Dr. Ananya Sharma',
    date: 'Oct 12, 2024',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    title: 'The Future of Robotic Surgery',
    excerpt: 'How robotics is making complex surgeries safer and more precise than ever.',
    author: 'GIRM Research Team',
    date: 'Oct 05, 2024',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'
  }
];

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];
