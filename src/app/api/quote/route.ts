import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface DailyQuote {
  quote: string;
  author: string;
  updatedBy: string;
  updatedAt: string;
}

// In-memory store — persists for the lifetime of the server process
let currentQuote: DailyQuote = {
  quote: 'The secret of getting ahead is getting started.',
  author: 'Mark Twain',
  updatedBy: 'system',
  updatedAt: '2026-03-13T00:00:00.000Z',
};

export async function GET() {
  return NextResponse.json(currentQuote);
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

  currentQuote = {
    quote: quote.trim(),
    author: author.trim(),
    updatedBy: session.user.email ?? session.user.name ?? 'admin',
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(currentQuote);
}
