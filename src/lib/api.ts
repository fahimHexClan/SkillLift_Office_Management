import axios from 'axios';
import type { StudentProfile, SearchType } from '@/types';

// ─── HTTP clients (kept for any direct server-side use) ────────────────────────

const TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN ?? '';

// www.skilllift.lk — main search + courses
const wwwClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_WWW, // https://www.skilllift.lk
  headers: { access_token: TOKEN },
});

// admin.skilllift.lk — payment link
const adminClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_ADMIN, // https://admin.skilllift.lk
  headers: { access_token: TOKEN },
});

// admin.skilllift.lk — student delete (separate domain)
const adminSkillliftClient = axios.create({
  baseURL: 'https://admin.skilllift.lk',
  headers: { access_token: TOKEN },
});

// ─── API 1: Student Search → /api/proxy/student-search ───────────────────────
// Proxied to avoid browser CORS restrictions.

// Maps UI SearchType labels to the proxy's searchType field keys
const SEARCH_TYPE_KEY: Record<string, string> = {
  'SR Number':     'srNumber',
  'Pay ID':        'payId',
  'Email':         'email',
  'Mobile Number': 'mobile',
  'NIC':           'nic',
};

export async function searchStudent(
  type: SearchType,
  value: string
): Promise<StudentProfile> {
  const searchType = SEARCH_TYPE_KEY[type] ?? 'srNumber';
  const { data } = await axios.post('/api/proxy/student-search', { searchType, searchValue: value }).catch((err) => {
    const raw = err?.response?.data?.error ?? err?.response?.data?.raw ?? err.message;
    const detail = typeof raw === 'string' ? raw : JSON.stringify(raw);
    throw new Error(detail);
  });
  console.log('[mapStudentProfile] raw API data:', JSON.stringify(data).slice(0, 500));
  return mapStudentProfile(data, value);
}

// ─── API 2: Delete Student → /api/proxy/delete-student ───────────────────────

export async function deleteStudent(payId: string): Promise<void> {
  await axios.get(`/api/proxy/delete-student?pay_id=${encodeURIComponent(payId)}`);
}

// ─── API 3: CCO Transfer → /api/proxy/transfer-student ───────────────────────

export interface CcoTransferParams {
  studentId:   string;
  sponsorId:   string;
  placementId: string;
  node:        string;
}

export async function transferStudent(params: CcoTransferParams): Promise<void> {
  await axios.post('/api/proxy/transfer-student', params);
}

// ─── API 4: Courses List → /api/proxy/courses ────────────────────────────────

export async function getCoursesList(): Promise<string[]> {
  const { data } = await axios.get('/api/proxy/courses');

  const list: unknown[] =
    Array.isArray(data)       ? data       :
    Array.isArray(data?.data) ? data.data  :
    [];

  return list.map((c) =>
    typeof c === 'string'
      ? c
      : String((c as Record<string, unknown>).name ?? (c as Record<string, unknown>).course_name ?? c)
  ).filter(Boolean);
}

// ─── API 5: Payment Link ──────────────────────────────────────────────────────
// Still direct (admin.skilllift.lk — same-origin from server when needed).

export async function getPaymentLink(payId: string): Promise<string> {
  const { data } = await adminClient.post(
    `/api/payment/link?pay_id=${encodeURIComponent(payId)}`
  );
  return String(data?.link ?? data?.url ?? data?.payment_link ?? '');
}

// ─── Response mapper ──────────────────────────────────────────────────────────
// Converts the raw /api/user response to our typed StudentProfile.

function mapStudentProfile(raw: unknown, searchValue: string): StudentProfile {
  // Unwrap common envelope patterns: { data: {...} }, { result: {...} }, etc.
  const unwrapped =
    (raw as Record<string, unknown>)?.data ??
    (raw as Record<string, unknown>)?.result ??
    (raw as Record<string, unknown>)?.user ??
    raw;

  const primary = (Array.isArray(unwrapped) ? unwrapped[0] : unwrapped) as Record<string, unknown> | undefined;

  if (!primary || typeof primary !== 'object') {
    throw new Error('Student not found');
  }

  // Helper: return first non-empty string value from a list of possible keys
  const get = (...keys: string[]): string => {
    for (const k of keys) {
      const v = primary[k];
      if (v !== null && v !== undefined && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return '';
  };

  // Name: prefer firstname + lastname, fall back to full name fields
  const firstName = get('firstname', 'first_name');
  const lastName  = get('lastname', 'last_name');
  const fullName  = firstName && lastName
    ? `${firstName} ${lastName}`
    : get('name', 'full_name', 'student_name', 'username');

  // Activation / payment dates (new field names first, then legacy)
  const halfPayAt   = get('half_act_date', 'half_payment_date', 'half_pay_date', 'half_pay_at')   || null;
  const fullPayAt   = get('full_act_date', 'full_payment_date', 'full_pay_date', 'full_pay_at')   || null;
  const joinedAt    = get('join_date', 'joined_date', 'joined_at', 'created_at')                  || null;
  const activatedAt = get('activation_date', 'activated_at', 'activation_at')                     || null;

  // Payment status
  const rawStatus = get('payment_status', 'status', 'paymentStatus').toLowerCase();
  let paymentStatus: 'half' | 'full' | 'pending' = 'pending';
  if (fullPayAt || rawStatus.includes('full')) {
    paymentStatus = 'full';
  } else if (halfPayAt || rawStatus.includes('half')) {
    paymentStatus = 'half';
  }

  // Accounts array
  const rawAccounts = primary.accounts;
  const accounts: { id: number; accountId: string; isActive: boolean }[] =
    Array.isArray(rawAccounts) && rawAccounts.length > 0
      ? rawAccounts.map((a, idx) => {
          const acc = a as Record<string, unknown>;
          const getFrom = (...keys: string[]) => {
            for (const k of keys) {
              const v = acc[k];
              if (v !== null && v !== undefined && String(v).trim() !== '') return String(v).trim();
            }
            return '';
          };
          return {
            id:        idx + 1,
            accountId: getFrom('username', 'sr_number', 'account_id', 'userid', 'pay_id'),
            isActive:
              acc.activation === '1' || acc.is_active === '1' ||
              acc.is_active === true || acc.is_active === 1 ||
              acc.status === 'active' || acc.isActive === true,
          };
        })
      : [{
          id:        1,
          accountId: get('username', 'sr_number', 'payid', 'pay_id') || searchValue,
          isActive:  true,
        }];

  // Orders array
  const rawOrders = (primary.orders ?? primary.payments ?? primary.order_history ?? []) as unknown[];
  const orders = Array.isArray(rawOrders)
    ? rawOrders.map((o, idx) => {
        const ord = o as Record<string, unknown>;
        return {
          id:          idx + 1,
          description: String(ord.product_name ?? ord.course_name ?? ord.description ?? ord.title ?? 'Payment'),
          paidAt:      String(ord.create_date ?? ord.paid_at ?? ord.paidAt ?? ord.created_at ?? ord.date ?? ''),
          amount:      String(ord.total ?? ord.amount ?? ord.price ?? ''),
          paymentMode: String(ord.payment_mode ?? ord.payment_type ?? ord.paymentMode ?? ''),
          subscription: String(ord.subscription ?? ord.payment_status ?? ord.sub_type ?? ''),
        };
      })
    : [];

  // Sponsor / counselor object
  const sponsor = (
    primary.sponsor     ??
    primary.coordinator ??
    primary.counselor   ??
    primary.cco         ??
    {}
  ) as Record<string, unknown>;

  const counselorName  = String(sponsor.fullname ?? sponsor.name ?? primary.sponsor_name ?? primary.coordinator_name ?? '');
  const counselorCcId  = String(sponsor.cc_id ?? sponsor.ccId ?? primary.cc_id ?? primary.coordinator_cc_id ?? '');
  const counselorAgent = String(sponsor.agent_number ?? sponsor.agentNumber ?? primary.agent_number ?? primary.sponsor_id ?? '');

  return {
    student: {
      id:            Number(primary.id ?? primary.user_id ?? 1),
      srNumber:      get('username', 'sr_number', 'srNumber', 'sr', 'userid'),
      payId:         get('payid', 'pay_id', 'payId', 'payment_id'),
      name:          fullName,
      marketplace:   get('marketplace', 'subscription', 'platform', 'source', 'course', 'product'),
      medium:        get('medium', 'class_format', 'language', 'lang', 'mode'),
      contact:       get('mobile', 'contact', 'phone', 'contact_number', 'contactNumber'),
      nic:           get('nic', 'national_id', 'id_number'),
      email:         get('email', 'email_address'),
      group:         get('team', 'group', 'group_name'),
      dob:           get('dob', 'date_of_birth', 'birthday', 'birth_date'),
      gender:        get('gender', 'sex'),
      classFormat:   get('class_format', 'classFormat'),
      classType:     get('class_type', 'classType'),
      createdAt:     get('join_date', 'joined_date', 'joined_at', 'created_at', 'create_date', 'created_date', 'registration_date'),
      paymentStatus,
    },
    counselor: {
      id:          Number(sponsor.id ?? 0),
      name:        counselorName,
      ccId:        counselorCcId,
      agentNumber: counselorAgent,
      isActive:    !!counselorName,
    },
    accounts,
    orders,
    activation: {
      joinedAt,
      activationAt: activatedAt,
      halfPayAt,
      fullPayAt,
    },
  };
}

// Re-export clients (used by other parts of the app)
export { wwwClient, adminClient as apiClient, adminSkillliftClient };
