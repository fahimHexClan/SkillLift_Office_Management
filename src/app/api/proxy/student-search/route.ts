import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TYPE_MAP: Record<string, string> = {
  srNumber:  'userId',
  sr_number: 'userId',
  payId:     'payid',
  pay_id:    'payid',
  mobile:    'mobile',
  email:     'email',
  nic:       'nic',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchType, searchValue } = body as { searchType: string; searchValue: string };

    console.log('searchType received:', searchType);
    console.log('searchValue received:', searchValue);
    console.log('TYPE_MAP result:', TYPE_MAP[searchType]);

    let user_id = String(searchValue).trim();
    if (searchType === 'srNumber') {
      user_id = user_id.replace(/^SR/i, '');
    } else if (searchType === 'mobile') {
      user_id = user_id.replace(/^0/, '');
    }
    // payId and all others: send value as-is

    const upstreamType = TYPE_MAP[searchType] ?? 'userId';

    console.log('Final user_id:', user_id);
    console.log('Final type sent to API:', upstreamType);

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('type', upstreamType);

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

    // Unwrap upstream error to a plain string so api.ts receives it cleanly.
    // Upstream may return { "error": "No user details were found." } or a plain string.
    const upstreamData = err?.response?.data as Record<string, unknown> | string | undefined;
    const errorMsg: string =
      typeof upstreamData === 'string'
        ? upstreamData
        : typeof upstreamData?.error === 'string'
          ? upstreamData.error
          : err?.message ?? 'Unknown error';

    return NextResponse.json(
      { error: errorMsg, status: err?.response?.status },
      { status: err?.response?.status || 500 }
    );
  }
}