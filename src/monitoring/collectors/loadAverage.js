/**
 * Load average collector.
 * Returns the Unix 1-minute, 5-minute, and 15-minute load averages via os.loadavg().
 *
 * NOTE: On Windows, os.loadavg() always returns [0, 0, 0].
 * The collector marks the result as unsupported on that platform.
 */

import os from 'os';

/**
 * @typedef {object} LoadAverageSnapshot
 * @property {boolean} supported
 * @property {number}  [one]     - 1-minute load average
 * @property {number}  [five]    - 5-minute load average
 * @property {number}  [fifteen] - 15-minute load average
 */

/**
 * Returns the system load averages.
 * @returns {LoadAverageSnapshot}
 */
export function collectLoadAverage() {
  if (process.platform === 'win32') {
    return { supported: false };
  }

  const [one, five, fifteen] = os.loadavg();

  return {
    supported: true,
    one: parseFloat(one.toFixed(2)),
    five: parseFloat(five.toFixed(2)),
    fifteen: parseFloat(fifteen.toFixed(2)),
  };
}
