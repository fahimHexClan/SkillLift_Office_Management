import crypto from 'crypto';
import { Redis } from '@upstash/redis';

export interface Invite {
  token: string;
  role: 'admin' | 'teacher' | 'staff';
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  expiresAt: string;
}

const redis = Redis.fromEnv();

async function read(): Promise<Invite[]> {
  return (await redis.get<Invite[]>('invites')) ?? [];
}

async function write(data: Invite[]) {
  await redis.set('invites', data);
}

export async function createInvite(role: Invite['role'], adminEmail: string): Promise<string> {
  const token = crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const invites = await read();
  invites.unshift({ token, role, createdBy: adminEmail, createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() });
  await write(invites);
  return token;
}

export async function getInvite(token: string): Promise<Invite | null> {
  const invites = await read();
  return invites.find((i) => i.token === token) ?? null;
}

export async function markInviteUsed(token: string, userEmail: string) {
  const invites = await read();
  const idx = invites.findIndex((i) => i.token === token);
  if (idx !== -1) { invites[idx].usedBy = userEmail; invites[idx].usedAt = new Date().toISOString(); await write(invites); }
}

export async function deleteInvite(token: string) {
  const invites = await read();
  await write(invites.filter((i) => i.token !== token));
}

export async function getAllInvites(): Promise<Invite[]> { return read(); }

export function getInviteStatus(invite: Invite): 'pending' | 'used' | 'expired' {
  if (invite.usedBy) return 'used';
  if (new Date() > new Date(invite.expiresAt)) return 'expired';
  return 'pending';
}
