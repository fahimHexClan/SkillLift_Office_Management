import { Counselor } from '@/types';

interface Props {
  counselor: Counselor;
}

export default function CounselorCard({ counselor }: Props) {
  return (
    <div className="flex items-start gap-3 flex-1">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
        {counselor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
          {counselor.name}
        </p>
        <p className="text-xs text-gray-500">{counselor.ccId}</p>
        <div className="flex items-center gap-2">
          {counselor.isActive && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
              Active
            </span>
          )}
          <span className="text-xs text-gray-500">{counselor.agentNumber}</span>
        </div>
      </div>
    </div>
  );
}