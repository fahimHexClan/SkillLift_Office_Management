import { CalendarDays } from 'lucide-react';

export default function HallBookingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
        <CalendarDays size={36} className="text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-700">Hall Bookings</h2>
      <p className="text-gray-400 text-sm">Coming soon...</p>
    </div>
  );
}