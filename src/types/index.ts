export interface Student {
  id: number;
  srNumber: string;
  payId: string;
  name: string;
  marketplace: string;
  medium: string;
  classFormat: string;
  classType: string;
  contact: string;
  nic: string;
  email: string;
  group: string;
  dob: string;
  gender: string;
  createdAt: string;
  photo?: string;
  paymentStatus: 'half' | 'full' | 'pending';
  placementId?: string;
}

export interface Counselor {
  id: number;
  name: string;
  ccId: string;
  agentNumber: string;
  photo?: string;
  isActive: boolean;
}

export interface Account {
  id: number;
  accountId: string;
  isActive: boolean;
}

export interface Order {
  id: number;
  description: string;
  paidAt: string;
  amount: string;
  paymentMode: string;
  subscription: string;
}

export interface ActivationDetails {
  joinedAt: string | null;
  activationAt: string | null;
  halfPayAt: string | null;
  fullPayAt: string | null;
}

export interface StudentProfile {
  student: Student;
  counselor: Counselor;
  accounts: Account[];
  orders: Order[];
  activation: ActivationDetails;
}

export type SearchType = 'SR Number' | 'Pay ID' | 'Mobile Number' | 'Email' | 'NIC';

export type UserRole = 'Admin' | 'Teacher' | 'Staff';

export interface ZoomClass {
  id: number;
  className: string;
  zoomId: string;
  zoomLink: string;
  teacherName: string;
  startTime: string;
  date: string;
  isActive: boolean;
}

export interface AdminStudent {
  id: number;
  name: string;
  email: string;
  srNumber: string;
  nic: string;
  contact: string;
  course: string;
  batch: string;
  hasRegistrationIssue: boolean;
  issueType?: 'DUPLICATE_EMAIL' | 'DUPLICATE_NIC' | 'DUPLICATE_SR';
  duplicates?: AdminStudent[];
}

export interface TransferRecord {
  id: number;
  studentName: string;
  srNumber: string;
  fromCourse: string;
  fromBatch: string;
  toCourse: string;
  toBatch: string;
  transferredAt: string;
  transferredBy: string;
}

export interface ZoomClassForm {
  className: string;
  zoomId: string;
  zoomLink: string;
  teacherName: string;
  startTime: string;
  date: string;
  isActive: boolean;
}