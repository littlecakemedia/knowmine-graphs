/**
 * Monitoring orchestrator.
 *
 * Starts a periodic collection loop that gathers server metrics
 * and stores them in the in-memory ring buffer store.
 *
 * The monitoring layer is entirely optional — you can use the
 * renderer and helpers without ever importing this module.
 *
 * @example
 * import { startMonitoring } from 'knowmine-graphs/monitoring';
 *
 * const { stop } = startMonitoring({ intervalMs: 5000 });
 * // later...
 * stop();
 */

import { store } from './store/memoryStore.js';
import { collectCpu } from './collectors/cpu.js';
import { collectMemory } from './collectors/memory.js';
import { collectDiskIO } from './collectors/diskIO.js';
import { collectNetwork } from './collectors/network.js';
import { collectDiskUsage } from './collectors/diskUsage.js';
import { collectLoadAverage } from './collectors/loadAverage.js';
import { collectEventLoopLag, startEventLoopMonitor, stopEventLoopMonitor } from './collectors/eventLoop.js';
import { collectGC, startGCMonitor, stopGCMonitor } from './collectors/gc.js';

let intervalId = null;

/**
 * @typedef {'cpu'|'memory'|'diskIO'|'network'|'diskUsage'|'loadAverage'|'eventLoop'|'gc'} CollectorName
 */

/**
 * All available collector names.
 * @type {CollectorName[]}
 */
export const ALL_COLLECTORS = [
  'cpu',
  'memory',
  'diskIO',
  'network',
  'diskUsage',
  'loadAverage',
  'eventLoop',
  'gc',
];

/**
 * Starts the monitoring loop.
 *
 * @param {object} [opts]
 * @param {number} [opts.intervalMs=10000]       - Collection interval in milliseconds
 * @param {number} [opts.bufferSize=360]          - Samples retained per metric
 * @param {CollectorName[]} [opts.collectors]     - Collectors to enable (default: all)
 * @param {string} [opts.diskPath='/']            - Filesystem path for disk usage collection
 * @returns {{ stop: () => void }}                - Object with a stop() method
 */
export function startMonitoring({
  intervalMs = 10000,
  bufferSize = 360,
  collectors = ALL_COLLECTORS,
  diskPath = '/',
} = {}) {
  if (intervalId) stopMonitoring();

  store.init({ bufferSize });

  const enabled = new Set(collectors);

  // Start sub-monitors that require their own initialisation
  if (enabled.has('eventLoop')) startEventLoopMonitor();
  if (enabled.has('gc')) startGCMonitor();

  const tick = async () => {
    if (enabled.has('cpu')) store.push('cpu', collectCpu());
    if (enabled.has('memory')) store.push('memory', collectMemory());
    if (enabled.has('diskIO')) store.push('diskIO', collectDiskIO());
    if (enabled.has('network')) store.push('network', collectNetwork());
    if (enabled.has('loadAverage')) store.push('loadAverage', collectLoadAverage());
    if (enabled.has('eventLoop')) store.push('eventLoop', collectEventLoopLag());
    if (enabled.has('gc')) store.push('gc', collectGC());
    if (enabled.has('diskUsage')) {
      try {
        store.push('diskUsage', await collectDiskUsage(diskPath));
      } catch {
        // diskUsage is async; silently skip on error
      }
    }
  };

  // Run immediately, then on interval
  tick();
  intervalId = setInterval(tick, intervalMs);

  return { stop: stopMonitoring };
}

/**
 * Stops the monitoring loop and clears all stored data.
 * Safe to call even if monitoring is not running.
 */
export function stopMonitoring() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  stopEventLoopMonitor();
  stopGCMonitor();
  store.clear();
}

/**
 * Returns true if monitoring is currently active.
 * @returns {boolean}
 */
export function isMonitoring() {
  return intervalId !== null;
}
