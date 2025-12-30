
import { Service, Doctor, BedStatus, BlogPost } from './types';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Cardiology',
    description: 'Advanced heart care with cutting-edge diagnostic technology.',
    icon: 'Heart',
    specialties: ['TAVR Procedures', 'Complex Angioplasty', 'Arrhythmia Management', 'Heart Failure Clinic'],
    longDescription: 'Our Cardiology department is equipped with state-of-the-art cath labs and non-invasive diagnostic tools.'
  },
  {
    id: 2,
    title: 'Neurology',
    description: 'Expert treatment for neurological disorders and brain health.',
    icon: 'Activity',
    specialties: ['Stroke Management', 'Epilepsy Care', 'Deep Brain Stimulation', 'Sleep Medicine'],
    longDescription: 'Specialized in treating stroke, epilepsy, and complex neuro-surgical procedures.'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Dedicated healthcare for children from birth to adolescence.',
    icon: 'Stethoscope',
    specialties: ['Neonatology', 'Pediatric Surgery', 'Immunology', 'Child Psychiatry'],
    longDescription: 'A child-friendly environment with specialists in neonatal care and pediatric surgery.'
  },
  {
    id: 4,
    title: 'Oncology',
    description: 'Comprehensive cancer care with precision medicine.',
    icon: 'Microscope',
    specialties: ['Immunotherapy', 'Bone Marrow Transplant', 'Targeted Therapy', 'Radiation Oncology'],
    longDescription: 'Integrated cancer care with advanced radiation therapy and specialized tumor boards.'
  },
  {
    id: 5,
    title: 'Orthopedics',
    description: 'Expert management of bone, joint and muscular conditions.',
    icon: 'Dna',
    specialties: ['Robotic Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Trauma Care'],
    longDescription: 'Leading experts in robotic-assisted hip and knee replacement for faster recovery.'
  },
  {
    id: 6,
    title: 'Emergency Care',
    description: '24/7 critical care and emergency response unit.',
    icon: 'ShieldAlert',
    specialties: ['Trauma Center', 'Cardiac Emergency', 'Pediatric ICU', 'Stroke Protocol'],
    longDescription: 'Equipped with ACLS ambulances and trauma specialists available around the clock.'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    specialty: 'Chief Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536785?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'A compassionate cardiologist specializing in non-invasive cardiac imaging and complex angioplasty.',
    rating: 4.9,
    reviews: 124,
    timings: 'Mon - Fri, 10:00 AM - 4:00 PM',
    education: ['MD Cardiology - Harvard Medical School', 'Fellowship in Interventional Cardiology - Cleveland Clinic', 'MBBS - AIIMS Delhi'],
    fullBio: 'Dr. Ananya Sharma has over 18 years of experience in managing complex heart conditions. She pioneered several non-invasive techniques at GIRM Hospital and is a frequent speaker at international cardiology summits. Her patient-first approach has made her one of the most sought-after cardiologists in the region.',
    reviewsList: [
      { id: 'r1', patientName: 'John D.', rating: 5, comment: 'Dr. Sharma saved my life. Her expertise in TAVR is unmatched.', date: '2024-10-15' },
      { id: 'r2', patientName: 'Maria S.', rating: 4.8, comment: 'Very professional and explained the procedure clearly.', date: '2024-09-28' }
    ]
  },
  {
    id: 2,
    name: 'Dr. Rajesh Varma',
    specialty: 'Pediatric Specialist',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Expert in neonatal care, childhood infectious diseases, and pediatric nutrition.',
    rating: 4.8,
    reviews: 89,
    timings: 'Tue - Sat, 09:00 AM - 02:00 PM',
    education: ['MD Pediatrics - Johns Hopkins University', 'Specialization in Neonatology - Stanford Medicine', 'MBBS - KMC Manipal'],
    fullBio: 'Dr. Rajesh Varma is passionate about child health and development. With 12 years of clinical practice, he has successfully treated thousands of children, focusing on preventive care and early intervention. He is also a consultant for our Advanced Neonatal ICU.',
    reviewsList: [
      { id: 'r3', patientName: 'Emily W.', rating: 5, comment: 'Best pediatrician! My kids love him and he is always patient.', date: '2024-11-02' },
      { id: 'r4', patientName: 'David K.', rating: 4.5, comment: 'Highly knowledgeable in infant nutrition.', date: '2024-08-12' }
    ]
  },
  {
    id: 3,
    name: 'Dr. Priya Iyer',
    specialty: 'Neurology Lead',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400&h=500',
    description: 'Specializes in clinical neurophysiology, stroke management, and advanced neurosurgery.',
    rating: 5.0,
    reviews: 56,
    timings: 'Mon - Thu, 11:00 AM - 05:00 PM',
    education: ['PhD Neurosurgery - Oxford University', 'MD Neurology - University of Tokyo', 'MBBS - CMC Vellore'],
    fullBio: 'Dr. Priya Iyer is a globally recognized neurosurgeon known for her precision in minimally invasive brain surgeries. She leads our Stroke Protocol team and is actively involved in clinical trials for neuro-regenerative therapies.',
    reviewsList: [
      { id: 'r5', patientName: 'Robert L.', rating: 5, comment: 'Incredible surgeon. Her attention to detail is remarkable.', date: '2024-11-10' },
      { id: 'r6', patientName: 'Susan M.', rating: 5, comment: 'Exceptional care for my mother during her stroke recovery.', date: '2024-10-05' }
    ]
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
  'Emergency',
  'Oncology'
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
