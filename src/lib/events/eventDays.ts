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
  return days.map(d => {
    const sorted = [...(d.slots ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return {
      date: d.date,
      slots: sorted,
      isMultiSlot: sorted.length > 1,
    };
  });
}
