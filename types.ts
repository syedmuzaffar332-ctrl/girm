
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
  timeSlot?: string;
  paymentStatus: 'pending' | 'paid';
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  longDescription?: string;
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
