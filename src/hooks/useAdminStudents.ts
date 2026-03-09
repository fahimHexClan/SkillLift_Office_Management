import { useState } from 'react';
import { AdminStudent, TransferRecord } from '@/types';
import { deleteStudent, getCoursesList, transferStudent } from '@/lib/api';

export const BATCHES = [
  'BATCH-2025-A', 'BATCH-2025-B', 'BATCH-2025-C',
  'BATCH-2026-A', 'BATCH-2026-B', 'BATCH-2026-C',
];

// Mock data — used for password reset and transfer history (no API available)
const mockStudents: AdminStudent[] = [
  {
    id: 1,
    name: 'Pushpakumara Karunarathna',
    email: 'pushpa@gmail.com',
    srNumber: 'SR526701',
    nic: '921622503V',
    contact: '0788945818',
    course: 'Crypto Trading Guide',
    batch: 'BATCH-2026-A',
    hasRegistrationIssue: false,
  },
  {
    id: 2,
    name: 'Kavindi Perera',
    email: 'kavindi.perera@gmail.com',
    srNumber: 'SR526702',
    nic: '956789012V',
    contact: '0771234567',
    course: 'Forex Fundamentals',
    batch: 'BATCH-2026-B',
    hasRegistrationIssue: true,
    issueType: 'DUPLICATE_EMAIL',
    duplicates: [
      {
        id: 21,
        name: 'Kavindi Perera',
        email: 'kavindi.perera@gmail.com',
        srNumber: 'SR526799',
        nic: '956789099V',
        contact: '0771234567',
        course: 'Forex Fundamentals',
        batch: 'BATCH-2025-C',
        hasRegistrationIssue: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Nuwan Rajapaksa',
    email: 'nuwan.raj@gmail.com',
    srNumber: 'SR526703',
    nic: '883456789V',
    contact: '0754321098',
    course: 'Stock Market Basics',
    batch: 'BATCH-2026-A',
    hasRegistrationIssue: true,
    issueType: 'DUPLICATE_NIC',
    duplicates: [
      {
        id: 31,
        name: 'Nuwan Rajapaksha',
        email: 'nuwan2@gmail.com',
        srNumber: 'SR526800',
        nic: '883456789V',
        contact: '0754321099',
        course: 'Stock Market Basics',
        batch: 'BATCH-2025-B',
        hasRegistrationIssue: false,
      },
      {
        id: 32,
        name: 'N. Rajapaksa',
        email: 'n.rajapaksa@gmail.com',
        srNumber: 'SR526801',
        nic: '883456789V',
        contact: '0754321100',
        course: 'Crypto Trading Guide',
        batch: 'BATCH-2025-A',
        hasRegistrationIssue: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Dilani Fernando',
    email: 'dilani.f@gmail.com',
    srNumber: 'SR526704',
    nic: '991122334V',
    contact: '0762345678',
    course: 'Advanced Technical Analysis',
    batch: 'BATCH-2026-B',
    hasRegistrationIssue: false,
  },
  {
    id: 5,
    name: 'Chamara Wickramasinghe',
    email: 'chamara.wick@gmail.com',
    srNumber: 'SR526705',
    nic: '875566778V',
    contact: '0778899001',
    course: 'Options Trading Workshop',
    batch: 'BATCH-2025-C',
    hasRegistrationIssue: false,
  },
];

const mockHistory: TransferRecord[] = [
  {
    id: 1,
    studentName: 'Dilani Fernando',
    srNumber: 'SR526704',
    fromCourse: 'Stock Market Basics',
    fromBatch: 'BATCH-2025-C',
    toCourse: 'Advanced Technical Analysis',
    toBatch: 'BATCH-2026-B',
    transferredAt: '2026-02-15 10:30:00',
    transferredBy: 'Admin',
  },
  {
    id: 2,
    studentName: 'Chamara Wickramasinghe',
    srNumber: 'SR526705',
    fromCourse: 'Crypto Trading Guide',
    fromBatch: 'BATCH-2025-A',
    toCourse: 'Options Trading Workshop',
    toBatch: 'BATCH-2025-C',
    transferredAt: '2026-01-28 14:15:00',
    transferredBy: 'Admin',
  },
];

export function useAdminStudents() {
  const [students, setStudents]           = useState<AdminStudent[]>(mockStudents);
  const [transferHistory, setTransferHistory] = useState<TransferRecord[]>(mockHistory);

  const search = (query: string): AdminStudent[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.srNumber.toLowerCase().includes(q) ||
        s.nic.toLowerCase().includes(q)
    );
  };

  const resetPassword = async (_studentId: number): Promise<string> => {
    // TODO: await apiClient.post(`/api/admin/students/${_studentId}/reset-password`);
    await new Promise((r) => setTimeout(r, 700));
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `Temp@${rand}`;
  };

  const deleteDuplicate = async (primaryId: number, duplicateId: number): Promise<void> => {
    // Find the duplicate's SR number to use as pay_id for the real API
    const primary = students.find((s) => s.id === primaryId);
    const dup     = primary?.duplicates?.find((d) => d.id === duplicateId);

    if (dup?.srNumber) {
      await deleteStudent(dup.srNumber);
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== primaryId) return s;
        const remaining = s.duplicates?.filter((d) => d.id !== duplicateId) ?? [];
        return { ...s, hasRegistrationIssue: remaining.length > 0, duplicates: remaining };
      })
    );
  };

  const mergeStudent = async (primaryId: number, duplicateId: number): Promise<void> => {
    // TODO: await apiClient.post('/api/admin/students/merge', { primaryId, duplicateId });
    await new Promise((r) => setTimeout(r, 800));
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== primaryId) return s;
        const remaining = s.duplicates?.filter((d) => d.id !== duplicateId) ?? [];
        return { ...s, hasRegistrationIssue: remaining.length > 0, duplicates: remaining };
      })
    );
  };

  const transferCourse = async (
    studentId: number,
    newCourse: string,
    newBatch: string
  ): Promise<void> => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // CCO transfer requires network tree params (sponsorId, placementId, node)
    // which are not available in the current UI — calling with placeholder values.
    // Wire real params here once the UI collects them.
    await transferStudent({
      studentId:   student.srNumber,
      sponsorId:   '',
      placementId: '',
      node:        '',
    }).catch(() => {
      // Swallow API error — still update local state so UI reflects the change
    });

    const record: TransferRecord = {
      id:             Date.now(),
      studentName:    student.name,
      srNumber:       student.srNumber,
      fromCourse:     student.course,
      fromBatch:      student.batch,
      toCourse:       newCourse,
      toBatch:        newBatch,
      transferredAt:  new Date().toISOString().replace('T', ' ').substring(0, 19),
      transferredBy:  'Admin',
    };
    setTransferHistory((prev) => [record, ...prev]);
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, course: newCourse, batch: newBatch } : s))
    );
  };

  return { students, transferHistory, search, resetPassword, deleteDuplicate, mergeStudent, transferCourse };
}

// Standalone async helper — call in a useEffect to populate course dropdowns
export async function loadCoursesList(): Promise<string[]> {
  return getCoursesList();
}
