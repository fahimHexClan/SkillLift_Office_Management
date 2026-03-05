import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '----';
  try {
    const date = new Date(dateStr);
    return date.toISOString().replace('T', ' ').substring(0, 19);
  } catch {
    return dateStr;
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}