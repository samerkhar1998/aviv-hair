import { addMinutes, isBefore } from 'date-fns';
export type Slot = { start: Date; end: Date };

export function generateSlotsForDay(
  windows: { start: Date; end: Date }[],
  durationMin: number,
  bufferMin: number,
  existing: { start: Date; end: Date }[],
  stepMinutes: number
): Slot[] {
  const out: Slot[] = [];
  for (const w of windows) {
    let cur = new Date(w.start);
    while (isBefore(addMinutes(cur, durationMin + bufferMin), w.end) || +addMinutes(cur, durationMin + bufferMin) === +w.end) {
      const s = { start: new Date(cur), end: addMinutes(cur, durationMin + bufferMin) };
      const overlaps = existing.some(a => !(s.end <= a.start || s.start >= a.end));
      if (!overlaps) out.push(s);
      cur = addMinutes(cur, stepMinutes);
    }
  }
  return out;
}