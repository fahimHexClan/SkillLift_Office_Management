import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

const TYPE_MAP: Record<string, string> = {
  srNumber:  'userId',
  sr_number: 'userId',
  payId:     'payId',
  pay_id:    'payId',
  email:     'email',
  mobile:    'mobile',
  nic:       'nic',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchType, searchValue } = body as { searchType: string; searchValue: string };

    let user_id = String(searchValue).trim();
    if (searchType === 'srNumber' || searchType === 'sr_number') {
      user_id = user_id.replace(/^SR/i, '');   // SR527364 → 527364
    } else if (searchType === 'mobile') {
      user_id = user_id.replace(/^0/, '');      // 0769428747 → 769428747
    }

    const upstreamType = TYPE_MAP[searchType] ?? 'userId';

    // Build multipart form-data exactly like Postman
    const form = new FormData();
    form.append('user_id', user_id);
    form.append('type', upstreamType);

    console.log('=== STUDENT SEARCH REQUEST ===');
    console.log('→ user_id:', user_id);
    console.log('→ type:   ', upstreamType);
    console.log('Token length:', process.env.NEXT_PUBLIC_ACCESS_TOKEN?.length);
    console.log('Token starts with:', process.env.NEXT_PUBLIC_ACCESS_TOKEN?.substring(0, 10));
    console.log('Headers:', {
      'access_token': process.env.NEXT_PUBLIC_ACCESS_TOKEN?.substring(0, 15) + '...',
      ...form.getHeaders(),
    });

    const response = await axios.post(
      'https://admin.skilllift.lk/api/user/',   // trailing slash avoids 301 redirect that drops POST body
      form,
      {
        headers: {
          'access_token': process.env.NEXT_PUBLIC_ACCESS_TOKEN,
          ...form.getHeaders(),
        },
        timeout: 10000,
      }
    );

    console.log('=== API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data keys:', Object.keys(response.data));

    return NextResponse.json(response.data);

  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: unknown }; message?: string };

    console.error('=== PROXY ERROR ===');
    console.error('Status:', err?.response?.status);
    console.error('Response:', err?.response?.data);
    console.error('Message:', err?.message);

    return NextResponse.json(
      {
        error: err?.response?.data || err?.message,
        status: err?.response?.status,
      },
      { status: err?.response?.status || 500 }
    );
  }
}
