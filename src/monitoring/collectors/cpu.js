/**
 * CPU usage collector.
 * Calculates aggregate CPU usage percentage across all cores
 * by comparing successive os.cpus() readings.
 *
 * Returns 0 on the first call (no previous reading to compare against).
 */

import os from 'os';

let prevCpuTimes = null;

function readCpuTimes() {
  return os.cpus().map(cpu => ({
    total: Object.values(cpu.times).reduce((a, b) => a + b, 0),
    idle: cpu.times.idle,
  }));
}

/**
 * Returns the current aggregate CPU usage percentage (0–100).
 * @returns {number}
 */
export function collectCpu() {
  const current = readCpuTimes();

  if (!prevCpuTimes) {
    prevCpuTimes = current;
    return 0;
  }

  let totalDelta = 0;
  let idleDelta = 0;

  current.forEach((cpu, i) => {
    totalDelta += cpu.total - prevCpuTimes[i].total;
    idleDelta += cpu.idle - prevCpuTimes[i].idle;
  });

  prevCpuTimes = current;

  if (totalDelta === 0) return 0;
  return parseFloat(((1 - idleDelta / totalDelta) * 100).toFixed(2));
}

/** Resets the internal state (useful for testing). */
export function resetCpuCollector() {
  prevCpuTimes = null;
}
