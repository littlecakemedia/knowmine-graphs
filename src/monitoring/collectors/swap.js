/**
 * Swap collector.
 * Reports system-level swap usage by reading /proc/meminfo on Linux.
 * Returns zeroed values with available: false on non-Linux platforms.
 */

import { readFileSync } from 'fs';
import { platform } from 'os';

/**
 * @typedef {object} SwapSnapshot
 * @property {number}  totalBytes   - Total swap space in bytes
 * @property {number}  freeBytes    - Free swap space in bytes
 * @property {number}  usedBytes    - Used swap space in bytes
 * @property {number}  usedPercent  - Used swap as percentage of total (0–100)
 * @property {boolean} available    - false when swap data cannot be read (non-Linux or no swap)
 */

/**
 * Returns a snapshot of system swap usage.
 * @returns {SwapSnapshot}
 */
export function collectSwap() {
  if (platform() !== 'linux') {
    return { totalBytes: 0, freeBytes: 0, usedBytes: 0, usedPercent: 0, available: false };
  }

  try {
    const content = readFileSync('/proc/meminfo', 'utf8');

    const parseKB = (key) => {
      const match = content.match(new RegExp(`^${key}:\\s+(\\d+)\\s+kB`, 'm'));
      return match ? parseInt(match[1], 10) * 1024 : 0;
    };

    const total = parseKB('SwapTotal');
    const free  = parseKB('SwapFree');
    const used  = total - free;

    return {
      totalBytes:  total,
      freeBytes:   free,
      usedBytes:   used,
      usedPercent: total > 0 ? parseFloat(((used / total) * 100).toFixed(2)) : 0,
      available:   total > 0,
    };
  } catch {
    return { totalBytes: 0, freeBytes: 0, usedBytes: 0, usedPercent: 0, available: false };
  }
}
