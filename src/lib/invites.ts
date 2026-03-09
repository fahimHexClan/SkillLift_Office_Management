import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'invites.json');

export interface Invite {
  token: string;
  role: 'admin' | 'teacher' | 'staff';
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
}

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]', 'utf-8');
}

function read(): Invite[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function write(data: Invite[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function createInvite(role: Invite['role'], adminEmail: string): string {
  const token = crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const invites = read();
  invites.unshift({
    token,
    role,
    createdBy: adminEmail,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
  write(invites);
  return token;
}

export function getInvite(token: string): Invite | null {
  return read().find((i) => i.token === token) ?? null;
}

export function markInviteUsed(token: string, userEmail: string) {
  const invites = read();
  const idx = invites.findIndex((i) => i.token === token);
  if (idx !== -1) {
    invites[idx].usedBy = userEmail;
    invites[idx].usedAt = new Date().toISOString();
    write(invites);
  }
}

export function deleteInvite(token: string) {
  write(read().filter((i) => i.token !== token));
}

export function getAllInvites(): Invite[] {
  return read();
}

export function getInviteStatus(invite: Invite): 'pending' | 'used' | 'expired' {
  if (invite.usedBy) return 'used';
  if (new Date() > new Date(invite.expiresAt)) return 'expired';
  return 'pending';
}
