import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getInvite, markInviteUsed } from '@/lib/invites';
import { setUserRole } from '@/lib/userRoles';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { token } = await req.json();
  const invite = await getInvite(token);

  if (!invite) {
    return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 });
  }
  if (invite.usedBy) {
    return NextResponse.json({ error: 'This invite has already been used' }, { status: 400 });
  }
  if (new Date() > new Date(invite.expiresAt)) {
    return NextResponse.json({ error: 'This invite link has expired' }, { status: 400 });
  }

  await setUserRole(session.user.email, invite.role, invite.createdBy);
  await markInviteUsed(token, session.user.email);

  return NextResponse.json({ success: true, role: invite.role });
}
