import { PixelIcon, type PixelIconName } from '@/components/PixelIcon';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: PixelIconName;
  color?: string;
}

export function StatCard({ label, value, icon, color = 'text-accent' }: StatCardProps) {
  return (
    <div className="bg-surface border-[3px] border-border shadow-hard p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 ${color}`}>
          <PixelIcon name={icon} className="w-8 h-8" />
        </div>
        <div className="text-3xl font-display font-bold text-text-primary mb-1">{value}</div>
        <div className="text-sm text-text-secondary font-medium uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}
