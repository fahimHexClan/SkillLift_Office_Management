import { useState } from 'react';
import { ZoomClass, ZoomClassForm } from '@/types';

// Mock data — API ready ஆனதும் replace பண்ணலாம்
const mockClasses: ZoomClass[] = [
  {
    id: 1,
    className: 'Crypto Trading Masterclass',
    zoomId: '123 456 7890',
    zoomLink: 'https://zoom.us/j/1234567890',
    teacherName: 'R.M.H. Chanaka Bandara',
    startTime: '09:00',
    date: '2026-03-10',
    isActive: true,
  },
  {
    id: 2,
    className: 'Forex Fundamentals',
    zoomId: '987 654 3210',
    zoomLink: 'https://zoom.us/j/9876543210',
    teacherName: 'K.A. Priyantha Silva',
    startTime: '14:00',
    date: '2026-03-12',
    isActive: true,
  },
  {
    id: 3,
    className: 'Stock Market Basics',
    zoomId: '456 789 0123',
    zoomLink: 'https://zoom.us/j/4567890123',
    teacherName: 'S.M. Jayawardena',
    startTime: '10:30',
    date: '2026-03-08',
    isActive: false,
  },
  {
    id: 4,
    className: 'Advanced Technical Analysis',
    zoomId: '321 654 9870',
    zoomLink: 'https://zoom.us/j/3216549870',
    teacherName: 'R.M.H. Chanaka Bandara',
    startTime: '16:00',
    date: '2026-03-15',
    isActive: true,
  },
  {
    id: 5,
    className: 'Options Trading Workshop',
    zoomId: '654 321 0987',
    zoomLink: 'https://zoom.us/j/6543210987',
    teacherName: 'K.A. Priyantha Silva',
    startTime: '11:00',
    date: '2026-03-05',
    isActive: false,
  },
];

let nextId = mockClasses.length + 1;

export function useZoomClasses() {
  const [classes, setClasses] = useState<ZoomClass[]>(mockClasses);
  const [isLoading, setIsLoading] = useState(false);

  const create = async (form: ZoomClassForm) => {
    setIsLoading(true);
    // Simulate API call
    // TODO: await apiClient.post('/api/zoom-classes', form);
    await new Promise((r) => setTimeout(r, 500));
    setClasses((prev) => [...prev, { ...form, id: nextId++ }]);
    setIsLoading(false);
  };

  const update = async (id: number, form: ZoomClassForm) => {
    setIsLoading(true);
    // TODO: await apiClient.put(`/api/zoom-classes/${id}`, form);
    await new Promise((r) => setTimeout(r, 500));
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...form, id } : c)));
    setIsLoading(false);
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    // TODO: await apiClient.delete(`/api/zoom-classes/${id}`);
    await new Promise((r) => setTimeout(r, 400));
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setIsLoading(false);
  };

  return { classes, isLoading, create, update, remove };
}
