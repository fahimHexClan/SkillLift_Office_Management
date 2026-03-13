import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createInvite } from '@/lib/invites';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { role } = await req.json();
  if (!['admin', 'teacher', 'staff'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const token = await createInvite(role as 'admin' | 'teacher' | 'staff', session.user.email!);
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const inviteUrl = `${base}/invite?token=${token}`;

  return NextResponse.json({ token, inviteUrl });
}
