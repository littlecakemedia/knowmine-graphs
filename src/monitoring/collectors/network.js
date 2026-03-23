/**
 * Network I/O collector (Linux only).
 * Reads /proc/net/dev and computes RX/TX throughput in bytes/sec
 * between successive calls. Loopback (lo) is excluded.
 *
 * Returns { supported: false } on non-Linux platforms.
 * Returns zero rates on the first call.
 */

import { readFileSync } from 'fs';

let prevStats = null;
let prevTime = null;

/**
 * @typedef {object} NetworkIOSnapshot
 * @property {boolean} supported
 * @property {number} [rxBytesPerSec]  - Received bytes per second
 * @property {number} [txBytesPerSec]  - Transmitted bytes per second
 * @property {number} [rxMBPerSec]
 * @property {number} [txMBPerSec]
 * @property {Record<string, { rxBytesPerSec: number, txBytesPerSec: number }>} [interfaces]
 */

function readProcNetDev() {
  const content = readFileSync('/proc/net/dev', 'utf8');
  const lines = content.trim().split('\n').slice(2); // skip two header lines
  const stats = {};

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 10) continue;

    const iface = parts[0].replace(':', '');
    if (iface === 'lo') continue; // skip loopback

    stats[iface] = {
      rxBytes: parseInt(parts[1], 10),
      txBytes: parseInt(parts[9], 10),
    };
  }

  return stats;
}

/**
 * Returns network RX/TX throughput since the last call.
 * @returns {NetworkIOSnapshot}
 */
export function collectNetwork() {
  let current;
  try {
    current = readProcNetDev();
  } catch {
    return { supported: false };
  }

  const now = Date.now();

  if (!prevStats || !prevTime) {
    prevStats = current;
    prevTime = now;
    return { supported: true, rxBytesPerSec: 0, txBytesPerSec: 0, rxMBPerSec: 0, txMBPerSec: 0, interfaces: {} };
  }

  const elapsedSec = (now - prevTime) / 1000;
  if (elapsedSec <= 0) return { supported: true, rxBytesPerSec: 0, txBytesPerSec: 0, rxMBPerSec: 0, txMBPerSec: 0, interfaces: {} };

  let totalRx = 0;
  let totalTx = 0;
  const interfaces = {};

  for (const iface of Object.keys(current)) {
    if (prevStats[iface]) {
      const rx = Math.max(0, current[iface].rxBytes - prevStats[iface].rxBytes);
      const tx = Math.max(0, current[iface].txBytes - prevStats[iface].txBytes);
      const rxRate = Math.round(rx / elapsedSec);
      const txRate = Math.round(tx / elapsedSec);
      totalRx += rxRate;
      totalTx += txRate;
      interfaces[iface] = { rxBytesPerSec: rxRate, txBytesPerSec: txRate };
    }
  }

  prevStats = current;
  prevTime = now;

  return {
    supported: true,
    rxBytesPerSec: totalRx,
    txBytesPerSec: totalTx,
    rxMBPerSec: parseFloat((totalRx / 1024 / 1024).toFixed(2)),
    txMBPerSec: parseFloat((totalTx / 1024 / 1024).toFixed(2)),
    interfaces,
  };
}

/** Resets internal state (useful for testing). */
export function resetNetworkCollector() {
  prevStats = null;
  prevTime = null;
}
