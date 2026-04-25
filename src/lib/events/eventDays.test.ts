import { describe, it, expect } from 'vitest';
import { normalizeEventDays } from './eventDays';

describe('normalizeEventDays', () => {
  it('returns empty array for undefined input', () => {
    expect(normalizeEventDays(undefined)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(normalizeEventDays([])).toEqual([]);
  });

  it('preserves a single-slot day and marks isMultiSlot false', () => {
    const out = normalizeEventDays([
      { date: '2026-05-01', slots: [{ startTime: '15:00', endTime: '20:00' }] },
    ]);
    expect(out).toEqual([
      {
        date: '2026-05-01',
        slots: [{ startTime: '15:00', endTime: '20:00' }],
        isMultiSlot: false,
      },
    ]);
  });

  it('marks a multi-slot day and sorts slots by startTime', () => {
    const out = normalizeEventDays([
      {
        date: '2026-05-01',
        slots: [
          { startTime: '19:00', endTime: '22:00', label: 'Band' },
          { startTime: '12:00', endTime: '22:00', label: 'Hauptevent' },
        ],
      },
    ]);
    expect(out[0].isMultiSlot).toBe(true);
    expect(out[0].slots.map(s => s.startTime)).toEqual(['12:00', '19:00']);
    expect(out[0].slots[0].label).toBe('Hauptevent');
  });

  it('handles a day with empty slots array', () => {
    const out = normalizeEventDays([{ date: '2026-05-01', slots: [] }]);
    expect(out).toEqual([{ date: '2026-05-01', slots: [], isMultiSlot: false }]);
  });

  it('does not mutate the input', () => {
    const input = [{
      date: '2026-05-01',
      slots: [
        { startTime: '19:00', endTime: '22:00', label: 'B' },
        { startTime: '12:00', endTime: '22:00', label: 'A' },
      ],
    }];
    const before = JSON.stringify(input);
    normalizeEventDays(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
