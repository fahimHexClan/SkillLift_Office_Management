import { NextResponse } from 'next/server';

const TOKEN    = process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '';
const BASE_URL = 'https://admin.skilllift.lk';

export async function GET() {
  try {
    const upstream = await fetch(`${BASE_URL}/api/courses_list`, {
      headers: { access_token: TOKEN },
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Proxy error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
