import { Copy } from 'lucide-react';
import { Student } from '@/types';
import PaymentBadge from './PaymentBadge';

interface Props {
  student: Student;
}

export default function StudentCard({ student }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(student.srNumber);
  };

  return (
    <div className="flex items-start gap-3 flex-1">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
        {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
          {student.name}
        </p>
        <p className="text-xs text-gray-500">{student.srNumber}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <PaymentBadge status={student.paymentStatus} />
          <span className="text-xs text-gray-600 truncate">
            {student.marketplace}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Copy SR Number"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}