import { useState } from 'react';
import { StudentProfile, SearchType } from '@/types';

// Mock data — API ready ஆனதும் replace பண்ணலாம்
const mockProfile: StudentProfile = {
  student: {
    id: 1,
    srNumber: 'SR526701',
    payId: '201824',
    name: 'Pushpakumara Karunarathna',
    marketplace: 'Crypto Trading Guide',
    medium: 'Sinhala',
    contact: '788945818',
    nic: '921622503v',
    email: 'onademeathima@gmail.com',
    group: 'AVENGERS',
    dob: '1992-06-10',
    gender: 'Male',
    paymentStatus: 'half',
  },
  counselor: {
    id: 1,
    name: 'R.M.H. Chanaka Bandara',
    ccId: 'CC0466849',
    agentNumber: '488851',
    isActive: true,
  },
  accounts: [
    { id: 1, accountId: 'SR526701', isActive: true },
    { id: 2, accountId: 'SR526702', isActive: false },
    { id: 3, accountId: 'SR526703', isActive: false },
  ],
  orders: [
    {
      id: 1,
      description: 'Crypto Trading Guide - Half Payment',
      paidAt: '2026-02-10 00:00:03',
    },
  ],
  activation: {
    joinedAt: '2026-02-09 20:54:50',
    activationAt: '2026-02-10 00:00:00',
    halfPayAt: '2026-02-10 00:00:00',
    fullPayAt: null,
  },
};

export function useStudentSearch() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const search = async (value: string, type: SearchType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call — 800ms delay
      await new Promise((res) => setTimeout(res, 800));

      // TODO: Replace with real API call
      // if (type === 'SR Number') {
      //   const data = await searchBySRNumber(value);
      //   setProfile(mapApiResponse(data));
      // } else {
      //   const data = await searchByPayId(value);
      //   setProfile(mapApiResponse(data));
      // }

      setProfile(mockProfile);

      // Update search history (max 3)
      setSearchHistory((prev) => {
        const filtered = prev.filter((h) => h !== value);
        return [value, ...filtered].slice(0, 3);
      });
    } catch (err) {
      setError('Student not found. Please check the search value.');
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, searchHistory, search };
}