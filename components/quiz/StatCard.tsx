import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, color = 'text-blue-400' }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
      </div>
    </div>
  );
}

