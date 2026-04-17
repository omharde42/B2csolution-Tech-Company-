import { useState } from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

export type RangePreset = 'today' | '7d' | '30d' | 'all' | 'custom';

export interface AdminDateRange {
  preset: RangePreset;
  from: Date | null;
  to: Date | null;
}

interface Props {
  value: AdminDateRange;
  onChange: (r: AdminDateRange) => void;
}

const presets: { key: RangePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: 'all', label: 'All' },
];

export const computeRange = (preset: RangePreset): { from: Date | null; to: Date | null } => {
  const now = new Date();
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  if (preset === 'today') {
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }
  if (preset === '7d') {
    const start = new Date(now); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }
  if (preset === '30d') {
    const start = new Date(now); start.setDate(start.getDate() - 29); start.setHours(0, 0, 0, 0);
    return { from: start, to: end };
  }
  return { from: null, to: null };
};

const AdminDateFilter = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    value.from && value.to ? { from: value.from, to: value.to } : undefined
  );

  const handlePreset = (key: RangePreset) => {
    const { from, to } = computeRange(key);
    onChange({ preset: key, from, to });
  };

  const handleCustomApply = () => {
    if (range?.from && range?.to) {
      const to = new Date(range.to); to.setHours(23, 59, 59, 999);
      const from = new Date(range.from); from.setHours(0, 0, 0, 0);
      onChange({ preset: 'custom', from, to });
      setOpen(false);
    }
  };

  const labelText =
    value.preset === 'custom' && value.from && value.to
      ? `${format(value.from, 'MMM d')} – ${format(value.to, 'MMM d, yyyy')}`
      : value.preset === 'all'
      ? 'All time'
      : presets.find(p => p.key === value.preset)?.label ?? '';

  return (
    <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Filter size={14} className="text-primary" />
          <span className="font-medium">Filter:</span>
          <span className="text-foreground font-semibold">{labelText}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:ml-auto">
          {presets.map(p => (
            <button
              key={p.key}
              onClick={() => handlePreset(p.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                value.preset === p.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-foreground hover:border-primary/40 hover:bg-secondary/70'
              )}
            >
              {p.label}
            </button>
          ))}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all',
                  value.preset === 'custom'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-foreground hover:border-primary/40 hover:bg-secondary/70'
                )}
              >
                <CalendarIcon size={12} /> Custom
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border" align="end">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                className={cn('p-3 pointer-events-auto')}
              />
              <div className="flex justify-end gap-2 p-3 border-t border-border">
                <button
                  onClick={() => { setRange(undefined); setOpen(false); }}
                  className="rounded-md px-3 py-1.5 text-xs bg-secondary border border-border text-foreground hover:bg-secondary/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomApply}
                  disabled={!range?.from || !range?.to}
                  className="rounded-md px-3 py-1.5 text-xs bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AdminDateFilter;
