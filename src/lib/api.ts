import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const wwwClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_WWW,
  headers: {
    'access_token': process.env.NEXT_PUBLIC_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

// Search by SR Number (hash)
export const searchBySRNumber = async (srNumber: string) => {
  const hash = simpleHash(srNumber);
  const res = await apiClient.get(
    `/api/v1/cco-dashboard/accounts/no-auth/by-hash?hash=${hash}`
  );
  return res.data;
};

// Search by Pay ID
export const searchByPayId = async (payId: string) => {
  const formData = new FormData();
  formData.append('pay_id', payId);
  const res = await wwwClient.post('/api/accounts/', formData);
  return res.data;
};

// Get payment link
export const getPaymentLink = async (payId: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_ADMIN}/api/payment/link?pay_id=${payId}`,
    {},
    {
      headers: {
        access_token: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
      },
    }
  );
  return res.data;
};

// Simple hash function for SR Number
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export { wwwClient, apiClient };