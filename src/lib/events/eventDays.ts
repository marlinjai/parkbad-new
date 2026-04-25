export interface Slot {
  startTime: string;
  endTime: string;
  label?: string;
}

export interface EventDay {
  date: string;
  slots: Slot[];
}

export interface NormalizedDay {
  date: string;
  slots: Slot[];
  isMultiSlot: boolean;
}

export function normalizeEventDays(days: EventDay[] | undefined): NormalizedDay[] {
  if (!days) return [];

  // Group rows with the same date so multiple eventDays entries for one day
  // (e.g. "1.5.2026 12-22" + "1.5.2026 19-22 Live: Band") render as a single
  // multi-slot day with both slots stacked. Insertion order of dates is
  // preserved (Map iteration follows insertion).
  const byDate = new Map<string, Slot[]>();
  for (const d of days) {
    const merged = byDate.get(d.date) ?? [];
    merged.push(...(d.slots ?? []));
    byDate.set(d.date, merged);
  }

  return Array.from(byDate, ([date, slots]) => {
    const sorted = [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      date,
      slots: sorted,
      isMultiSlot: sorted.length > 1,
    };
  });
}
