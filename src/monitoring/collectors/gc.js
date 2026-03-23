/**
 * Garbage Collection stats collector (Node.js specific).
 * Uses PerformanceObserver to track GC events.
 * Accumulated stats are reset after each collect() call, giving
 * per-interval counters.
 *
 * Must be started via startGCMonitor() before the first collect call.
 * startMonitoring() handles this automatically.
 */

import { PerformanceObserver } from 'perf_hooks';

let observer = null;
let stats = { count: 0, totalDurationMs: 0, lastDurationMs: 0 };

/**
 * Starts the GC PerformanceObserver.
 * Idempotent — safe to call multiple times.
 */
export function startGCMonitor() {
  if (observer) return;

  observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      stats.count++;
      stats.totalDurationMs += entry.duration;
      stats.lastDurationMs = parseFloat(entry.duration.toFixed(3));
    }
  });

  observer.observe({ type: 'gc', buffered: true });
}

/**
 * Stops and disconnects the GC observer.
 */
export function stopGCMonitor() {
  if (observer) {
    observer.disconnect();
    observer = null;
    stats = { count: 0, totalDurationMs: 0, lastDurationMs: 0 };
  }
}

/**
 * @typedef {object} GCSnapshot
 * @property {number} count             - Number of GC events in the interval
 * @property {number} totalDurationMs   - Total GC pause time in this interval (ms)
 * @property {number} lastDurationMs    - Duration of the most recent GC event (ms)
 * @property {number} avgDurationMs     - Average GC pause duration (ms), 0 if no events
 */

/**
 * Returns GC stats accumulated since the last call and resets the counters.
 * @returns {GCSnapshot}
 */
export function collectGC() {
  if (!observer) startGCMonitor();

  const snapshot = {
    count: stats.count,
    totalDurationMs: parseFloat(stats.totalDurationMs.toFixed(3)),
    lastDurationMs: stats.lastDurationMs,
    avgDurationMs: stats.count > 0
      ? parseFloat((stats.totalDurationMs / stats.count).toFixed(3))
      : 0,
  };

  // Reset for next interval
  stats = { count: 0, totalDurationMs: 0, lastDurationMs: 0 };

  return snapshot;
}
