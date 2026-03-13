import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { authOptions } from '@/lib/auth';

const QUOTE_FILE = path.join(process.cwd(), 'data', 'daily-quote.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(QUOTE_FILE, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read quote' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { quote, author } = body;

  if (!quote?.trim() || !author?.trim()) {
    return NextResponse.json({ error: 'quote and author are required' }, { status: 400 });
  }

  const updated = {
    quote: quote.trim(),
    author: author.trim(),
    updatedBy: session.user.email ?? session.user.name ?? 'admin',
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(QUOTE_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
