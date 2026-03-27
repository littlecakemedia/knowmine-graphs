/**
 * Time-axis label helper for monitoring charts.
 * Generates human-readable time labels from an array of timestamped entries.
 *
 * Format is chosen automatically based on the time range covered by the entries:
 *   - range ≤ 5 minutes  →  "HH:MM:SS"  (seconds visible, avoids rounding artifacts)
 *   - range >  5 minutes  →  "HH:MM"     (minutes sufficient, cleaner labels)
 */

const FIVE_MINUTES_MS = 5 * 60 * 1000;

/**
 * Generates N time labels evenly distributed across the time range of the entries.
 * The label format is selected automatically based on the covered range:
 * ≤ 5 min → "HH:MM:SS", > 5 min → "HH:MM".
 * @param {Array<{ timestamp: number }>} entries - Entries with Unix-ms timestamps
 * @param {number} [count=4] - Number of labels to generate
 * @returns {string[]} Array of time strings, length = count (or [] if entries.length < 2)
 */
export function makeTimeAxisLabels(entries, count = 4) {
  if (entries.length < 2) return [];
  const first = entries[0].timestamp;
  const last = entries[entries.length - 1].timestamp;
  const rangeMs = last - first;
  const showSeconds = rangeMs <= FIVE_MINUTES_MS;
  const result = [];
  for (let i = 0; i < count; i++) {
    const ts = first + rangeMs * i / (count - 1);
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (showSeconds) {
      const ss = String(d.getSeconds()).padStart(2, '0');
      result.push(`${hh}:${mm}:${ss}`);
    } else {
      result.push(`${hh}:${mm}`);
    }
  }
  return result;
}
