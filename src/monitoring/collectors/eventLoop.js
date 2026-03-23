/**
 * Event loop lag collector (Node.js specific).
 * Uses perf_hooks.monitorEventLoopDelay() to measure how much the event loop
 * is falling behind schedule. A high lag indicates the loop is blocked by
 * heavy synchronous work.
 *
 * Must be started via startEventLoopMonitor() before the first collect call.
 * startMonitoring() handles this automatically.
 */

import { monitorEventLoopDelay } from 'perf_hooks';

let histogram = null;

/**
 * Starts the event loop delay histogram.
 * Idempotent — safe to call multiple times.
 * @param {number} [resolution=10] - Sampling resolution in milliseconds
 */
export function startEventLoopMonitor(resolution = 10) {
  if (histogram) return;
  histogram = monitorEventLoopDelay({ resolution });
  histogram.enable();
}

/**
 * Stops and destroys the event loop delay histogram.
 */
export function stopEventLoopMonitor() {
  if (histogram) {
    histogram.disable();
    histogram = null;
  }
}

/**
 * @typedef {object} EventLoopSnapshot
 * @property {number} meanMs   - Mean event loop lag in milliseconds
 * @property {number} maxMs    - Max event loop lag in milliseconds
 * @property {number} minMs    - Min event loop lag in milliseconds
 * @property {number} p99Ms    - 99th percentile lag in milliseconds
 */

/**
 * Returns event loop lag metrics since the last call.
 * Resets histogram after reading to give per-interval stats.
 *
 * Returns zeroes if the monitor has not been started yet.
 * @returns {EventLoopSnapshot}
 */
export function collectEventLoopLag() {
  if (!histogram) {
    return { meanMs: 0, maxMs: 0, minMs: 0, p99Ms: 0 };
  }

  const NS_TO_MS = 1e6;

  const snapshot = {
    meanMs: parseFloat((histogram.mean / NS_TO_MS).toFixed(3)),
    maxMs: parseFloat((histogram.max / NS_TO_MS).toFixed(3)),
    minMs: parseFloat((histogram.min / NS_TO_MS).toFixed(3)),
    p99Ms: parseFloat((histogram.percentile(99) / NS_TO_MS).toFixed(3)),
  };

  histogram.reset();
  return snapshot;
}
