import crypto from 'crypto';
import path from 'path';

export interface Invite {
  token: string;
  role: 'admin' | 'teacher' | 'staff';
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
}

let memoryStore: Invite[] = [];

function tryReadFromFile(): Invite[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const filePath = path.join(process.cwd(), 'data', 'invites.json');
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch { /* Vercel: read-only fs */ }
  return [];
}

function tryWriteToFile(data: Invite[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'invites.json'), JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* Vercel: use memory */ }
}

function read(): Invite[] {
  const fromFile = tryReadFromFile();
  if (fromFile.length > 0) { memoryStore = fromFile; return fromFile; }
  return memoryStore;
}

function write(data: Invite[]) { memoryStore = data; tryWriteToFile(data); }

export function createInvite(role: Invite['role'], adminEmail: string): string {
  const token = crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const invites = read();
  invites.unshift({ token, role, createdBy: adminEmail, createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() });
  write(invites);
  return token;
}

export function getInvite(token: string): Invite | null {
  return read().find((i) => i.token === token) ?? null;
}

export function markInviteUsed(token: string, userEmail: string) {
  const invites = read();
  const idx = invites.findIndex((i) => i.token === token);
  if (idx !== -1) { invites[idx].usedBy = userEmail; invites[idx].usedAt = new Date().toISOString(); write(invites); }
}

export function deleteInvite(token: string) { write(read().filter((i) => i.token !== token)); }
export function getAllInvites(): Invite[] { return read(); }

export function getInviteStatus(invite: Invite): 'pending' | 'used' | 'expired' {
  if (invite.usedBy) return 'used';
  if (new Date() > new Date(invite.expiresAt)) return 'expired';
  return 'pending';
}