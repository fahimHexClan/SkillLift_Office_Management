import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { setUserRole, getUserRole } from '@/lib/userRoles';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !['admin', 'teacher', 'staff'].includes(role)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await setUserRole(email, role, session.user.email!);
  // Return the saved record to confirm the update took effect
  const saved = await getUserRole(email);
  return NextResponse.json({ success: true, user: saved });
}
