
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
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
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  description: string;
}
