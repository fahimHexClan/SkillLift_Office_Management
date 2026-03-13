import { Redis } from '@upstash/redis';

export interface UserRoleRecord {
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  assignedAt: string;
  assignedBy: string;
}

const redis = Redis.fromEnv();

async function read(): Promise<UserRoleRecord[]> {
  return (await redis.get<UserRoleRecord[]>('user-roles')) ?? [];
}

async function write(data: UserRoleRecord[]) {
  await redis.set('user-roles', data);
}

export async function getUserRole(email: string): Promise<UserRoleRecord | null> {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && email.toLowerCase() === adminEmail) {
    return { email: email.toLowerCase(), role: 'admin', assignedAt: '', assignedBy: 'system' };
  }
  const users = await read();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function setUserRole(email: string, role: UserRoleRecord['role'], assignedBy: string) {
  const users = await read();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  const record: UserRoleRecord = { email: email.toLowerCase(), role, assignedAt: new Date().toISOString(), assignedBy };
  if (idx !== -1) { users[idx] = record; } else { users.push(record); }
  await write(users);
}

export async function removeUserRole(email: string) {
  const users = await read();
  await write(users.filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
}

export async function getAllUsers(): Promise<UserRoleRecord[]> { return read(); }
