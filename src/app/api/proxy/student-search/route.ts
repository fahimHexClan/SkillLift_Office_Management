import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
      user_id = user_id.replace(/^SR/i, '');
    } else if (searchType === 'mobile') {
      user_id = user_id.replace(/^0/, '');
    }

    const upstreamType = TYPE_MAP[searchType] ?? 'userId';

    // FIX 1: native FormData use பண்றோம் (form-data package தேவையில்லை)
    const form = new FormData();
    form.append('user_id', user_id);
    form.append('type', upstreamType);

    // FIX 2: console logs-ல் NEXT_PUBLIC_ACCESS_TOKEN → ACCESS_TOKEN
    console.log('=== STUDENT SEARCH REQUEST ===');
    console.log('→ user_id:', user_id);
    console.log('→ type:   ', upstreamType);
    console.log('Token length:', process.env.ACCESS_TOKEN?.length);
    console.log('Token starts with:', process.env.ACCESS_TOKEN?.substring(0, 10));

    // FIX 3: axios headers-ல் form.getHeaders() remove பண்ணோம்
    //        (native FormData = axios automatically Content-Type set பண்ணும்)
    //        ACCESS_TOKEN use பண்றோம் (NEXT_PUBLIC_ இல்லை)
    const response = await axios.post(
      'https://admin.skilllift.lk/api/user/',
      form,
      {
        headers: {
          'access_token': process.env.ACCESS_TOKEN,
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