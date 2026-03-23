/**
 * Memory collector.
 * Reports system-level memory (via os module) and process-level heap
 * (via process.memoryUsage()).
 */

import os from 'os';

/**
 * @typedef {object} MemorySnapshot
 * @property {number} totalBytes       - Total system RAM in bytes
 * @property {number} freeBytes        - Free system RAM in bytes
 * @property {number} usedBytes        - Used system RAM in bytes
 * @property {number} usedPercent      - Used RAM as percentage of total (0–100)
 * @property {object} process          - Node.js process memory
 * @property {number} process.rss      - Resident set size in bytes
 * @property {number} process.heapTotal - Total V8 heap size in bytes
 * @property {number} process.heapUsed  - Used V8 heap in bytes
 * @property {number} process.external  - Memory used by C++ objects
 * @property {number} process.arrayBuffers - ArrayBuffer allocations in bytes
 */

/**
 * Returns a snapshot of system and process memory usage.
 * @returns {MemorySnapshot}
 */
export function collectMemory() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const { rss, heapTotal, heapUsed, external, arrayBuffers } = process.memoryUsage();

  return {
    totalBytes: total,
    freeBytes: free,
    usedBytes: used,
    usedPercent: parseFloat(((used / total) * 100).toFixed(2)),
    process: {
      rss,
      heapTotal,
      heapUsed,
      external,
      arrayBuffers,
    },
  };
}
