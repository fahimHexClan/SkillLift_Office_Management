import path from 'path';
import os from 'os';

export interface UserRoleRecord {
  email: string;
  role: 'admin' | 'teacher' | 'staff';
  assignedAt: string;
  assignedBy: string;
}

let memoryStore: UserRoleRecord[] = [];
// Seed from file/tmp only once per process lifetime; after any write, memory is authoritative.
let initialized = false;

const SEED_FILE = path.join(process.cwd(), 'data', 'user-roles.json');
const TMP_FILE  = path.join(os.tmpdir(), 'skilift-user-roles.json');

function tryReadFile(filePath: string): UserRoleRecord[] | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch { /* ignore */ }
  return null;
}

function tryWriteFile(filePath: string, data: UserRoleRecord[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* ignore */ }
}

function read(): UserRoleRecord[] {
  if (!initialized) {
    // Prefer /tmp (writable; has latest mutations on this instance), then committed seed file.
    const data = tryReadFile(TMP_FILE) ?? tryReadFile(SEED_FILE) ?? [];
    memoryStore = data;
    initialized = true;
  }
  return memoryStore;
}

function write(data: UserRoleRecord[]) {
  initialized = true;
  memoryStore = data;
  tryWriteFile(TMP_FILE, data);   // always writable (Vercel /tmp or OS temp dir)
  tryWriteFile(SEED_FILE, data);  // works locally; silently fails on Vercel (read-only)
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
