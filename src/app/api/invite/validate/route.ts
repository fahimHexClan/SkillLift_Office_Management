import { NextResponse } from 'next/server';
import { getInvite } from '@/lib/invites';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ status: 'invalid' });
  }

  const invite = await getInvite(token);
  if (!invite) return NextResponse.json({ status: 'invalid' });
  if (invite.usedBy) return NextResponse.json({ status: 'used', role: invite.role });
  if (new Date() > new Date(invite.expiresAt)) {
    return NextResponse.json({ status: 'expired', role: invite.role });
  }

  return NextResponse.json({ status: 'valid', role: invite.role });
}
