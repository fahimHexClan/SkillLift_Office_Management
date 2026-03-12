import path from 'path';

export interface UserRoleRecord {
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  assignedAt: string;
  assignedBy: string;
}

let memoryStore: UserRoleRecord[] = [];

function tryReadFromFile(): UserRoleRecord[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'data', 'user-roles.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch { /* Vercel: read-only fs, use memory */ }
  return [];
}

function tryWriteToFile(data: UserRoleRecord[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'user-roles.json'), JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* Vercel: silently use memory */ }
}

function read(): UserRoleRecord[] {
  const fromFile = tryReadFromFile();
  if (fromFile.length > 0) { memoryStore = fromFile; return fromFile; }
  return memoryStore;
}

function write(data: UserRoleRecord[]) {
  memoryStore = data;
  tryWriteToFile(data);
}

export function getUserRole(email: string): UserRoleRecord | null {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && email.toLowerCase() === adminEmail) {
    return { email: email.toLowerCase(), role: 'admin', assignedAt: '', assignedBy: 'system' };
  }
  return read().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function setUserRole(email: string, role: UserRoleRecord['role'], assignedBy: string) {
  const users = read();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  const record: UserRoleRecord = { email: email.toLowerCase(), role, assignedAt: new Date().toISOString(), assignedBy };
  if (idx !== -1) { users[idx] = record; } else { users.push(record); }
  write(users);
}

export function removeUserRole(email: string) {
  write(read().filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
}

export function getAllUsers(): UserRoleRecord[] { return read(); }