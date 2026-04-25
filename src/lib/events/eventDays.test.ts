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

  it('merges multiple rows with the same date into one multi-slot day', () => {
    const out = normalizeEventDays([
      { date: '2026-05-01', slots: [{ startTime: '12:00', endTime: '22:00' }] },
      { date: '2026-05-01', slots: [{ startTime: '19:00', endTime: '22:00', label: 'Live: Band' }] },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].date).toBe('2026-05-01');
    expect(out[0].isMultiSlot).toBe(true);
    expect(out[0].slots).toEqual([
      { startTime: '12:00', endTime: '22:00' },
      { startTime: '19:00', endTime: '22:00', label: 'Live: Band' },
    ]);
  });

  it('keeps distinct dates separate while merging same-date rows', () => {
    const out = normalizeEventDays([
      { date: '2026-05-01', slots: [{ startTime: '12:00', endTime: '22:00' }] },
      { date: '2026-05-02', slots: [{ startTime: '15:00', endTime: '20:00' }] },
      { date: '2026-05-01', slots: [{ startTime: '19:00', endTime: '22:00', label: 'Band' }] },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].date).toBe('2026-05-01');
    expect(out[0].isMultiSlot).toBe(true);
    expect(out[0].slots.map(s => s.startTime)).toEqual(['12:00', '19:00']);
    expect(out[1].date).toBe('2026-05-02');
    expect(out[1].isMultiSlot).toBe(false);
  });
});
