'use client';

import { createContext, useContext, useState } from 'react';
import type { UserRole } from '@/types';

// TODO: Replace MOCK_ROLE with real role from API / NextAuth session
const MOCK_ROLE: UserRole = 'Admin';

interface RoleContextValue {
  role: UserRole;
  setRole: (r: UserRole) => void;
  canManage: boolean;
  isAdmin: boolean;
}

const UserRoleContext = createContext<RoleContextValue>({
  role: MOCK_ROLE,
  setRole: () => {},
  canManage: true,
  isAdmin: true,
});

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(MOCK_ROLE);
  const canManage = role === 'Admin' || role === 'Teacher';
  const isAdmin = role === 'Admin';
  return (
    <UserRoleContext.Provider value={{ role, setRole, canManage, isAdmin }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
