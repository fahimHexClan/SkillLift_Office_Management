import { NextRequest, NextResponse } from 'next/server';

const TOKEN    = process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '';
const BASE_URL = 'http://www.skilllift.lk';

export async function POST(req: NextRequest) {
  try {
    const { studentId, sponsorId, placementId, node } =
      await req.json() as {
        studentId: string;
        sponsorId: string;
        placementId: string;
        node: string;
      };

    const formData = new FormData();
    formData.append('studentId',   studentId);
    formData.append('sponsorId',   sponsorId);
    formData.append('placementId', placementId);
    formData.append('node',        node);

    const upstream = await fetch(`${BASE_URL}/api/user/titan_cco_transfer`, {
      method:  'POST',
      headers: { access_token: TOKEN },
      body:    formData,
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Proxy error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
