import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'user-roles.json');

export interface UserRoleRecord {
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  assignedAt: string;
  assignedBy: string;
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

function read(): UserRoleRecord[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function write(data: UserRoleRecord[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getUserRole(email: string): UserRoleRecord | null {
  // Check env-var bootstrap admin first
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && email.toLowerCase() === adminEmail) {
    return { email: email.toLowerCase(), role: 'admin', assignedAt: '', assignedBy: 'system' };
  }
  return read().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function setUserRole(
  email: string,
  role: UserRoleRecord['role'],
  assignedBy: string
) {
  const users = read();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  const record: UserRoleRecord = {
    email: email.toLowerCase(),
    role,
    assignedAt: new Date().toISOString(),
    assignedBy,
  };
  if (idx !== -1) {
    users[idx] = record;
  } else {
    users.push(record);
  }
  write(users);
}

export function removeUserRole(email: string) {
  write(read().filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
}

export function getAllUsers(): UserRoleRecord[] {
  return read();
}
