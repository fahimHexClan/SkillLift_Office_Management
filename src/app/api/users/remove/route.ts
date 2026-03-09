import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { removeUserRole } from '@/lib/userRoles';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  // Prevent removing yourself
  if (email.toLowerCase() === session.user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot remove your own access' }, { status: 400 });
  }
  removeUserRole(email);
  return NextResponse.json({ success: true });
}
