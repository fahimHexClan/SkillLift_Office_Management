import path from 'path';

export interface UserRoleRecord {
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  assignedAt: string;
  assignedBy: string;
}

let memoryStore: UserRoleRecord[] = [];
// Once true, memoryStore is authoritative and we no longer re-read from file.
// This prevents stale file data from overwriting in-memory changes on Vercel
// where writeFileSync silently fails (read-only filesystem).
let initialized = false;

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
  if (!initialized) {
    const fromFile = tryReadFromFile();
    if (fromFile.length > 0) memoryStore = fromFile;
    initialized = true;
  }
  return memoryStore;
}

function write(data: UserRoleRecord[]) {
  initialized = true;
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
