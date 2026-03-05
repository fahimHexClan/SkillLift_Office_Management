export interface Student {
  id: number;
  srNumber: string;
  payId: string;
  name: string;
  marketplace: string;
  medium: string;
  contact: string;
  nic: string;
  email: string;
  group: string;
  dob: string;
  gender: string;
  photo?: string;
  paymentStatus: 'half' | 'full';
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

export type SearchType = 'SR Number' | 'Pay ID';