import crypto from 'crypto';
import path from 'path';
import os from 'os';

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
// Seed from file/tmp only once per process lifetime; after any write, memory is authoritative.
let initialized = false;

const SEED_FILE = path.join(process.cwd(), 'data', 'invites.json');
const TMP_FILE  = path.join(os.tmpdir(), 'skilift-invites.json');

function tryReadFile(filePath: string): Invite[] | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch { /* ignore */ }
  return null;
}

function tryWriteFile(filePath: string, data: Invite[]) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch { /* ignore */ }
}

function read(): Invite[] {
  if (!initialized) {
    // Prefer /tmp (writable; has latest mutations on this instance), then committed seed file.
    const data = tryReadFile(TMP_FILE) ?? tryReadFile(SEED_FILE) ?? [];
    memoryStore = data;
    initialized = true;
  }
  return memoryStore;
}

function write(data: Invite[]) {
  initialized = true;
  memoryStore = data;
  tryWriteFile(TMP_FILE, data);   // always writable (Vercel /tmp or OS temp dir)
  tryWriteFile(SEED_FILE, data);  // works locally; silently fails on Vercel (read-only)
}

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
