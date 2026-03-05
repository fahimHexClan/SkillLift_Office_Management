import { cn } from '@/lib/utils';

interface Props {
  status: 'half' | 'full';
}

export default function PaymentBadge({ status }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide',
      status === 'half'
        ? 'bg-orange-100 text-orange-700 border border-orange-200'
        : 'bg-green-100 text-green-700 border border-green-200'
    )}>
      {status}
    </span>
  );
}