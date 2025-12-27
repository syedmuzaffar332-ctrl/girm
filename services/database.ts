
import { User, Enrollment } from '../types';

const USERS_KEY = 'girm_hospital_users';
const ENROLLMENTS_KEY = 'girm_hospital_enrollments';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUser: async (user: User): Promise<void> => {
    await delay(800);
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUserPassword: async (email: string, newPassword: string): Promise<boolean> => {
    await delay(1000);
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) return false;
    
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  findUserByEmail: (email: string): User | undefined => {
    return db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Enrollments
  getEnrollments: (): Enrollment[] => {
    const data = localStorage.getItem(ENROLLMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEnrollment: async (enrollment: Enrollment): Promise<void> => {
    await delay(1000);
    const enrollments = db.getEnrollments();
    enrollments.push(enrollment);
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  }
};
