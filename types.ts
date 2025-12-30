
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'admin';
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  department: string;
  doctorId?: number;
  appointmentDate: string;
  timeSlot?: string;
  consultationType: 'in-person' | 'telemedicine';
  paymentStatus: 'pending' | 'paid';
  message: string;
  clinicalNotes?: string;
  doctorDiagnosis?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId?: string;
  patientName: string;
  department: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  longDescription?: string;
  specialties?: string[];
}

export interface DoctorReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  timings: string;
  education?: string[];
  fullBio?: string;
  reviewsList?: DoctorReview[];
}

export interface LabReport {
  id: string;
  userId: string;
  testName: string;
  date: string;
  fileUrl: string;
  status: 'available' | 'processing';
}

export interface BedStatus {
  department: string;
  total: number;
  occupied: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}