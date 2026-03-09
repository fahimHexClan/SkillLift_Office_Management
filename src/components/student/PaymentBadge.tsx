import { cn } from '@/lib/utils';

interface Props {
  status: 'half' | 'full' | 'pending';
}

export default function PaymentBadge({ status }: Props) {
  const styles =
    status === 'full'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : status === 'half'
        ? 'bg-orange-100 text-orange-700 border border-orange-200'
        : 'bg-gray-100 text-gray-500 border border-gray-200';

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide',
      styles,
    )}>
      {status}
    </span>
  );
}