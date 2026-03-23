/**
 * Disk I/O collector (Linux only).
 * Reads /proc/diskstats and computes read/write throughput in bytes/sec
 * between successive calls.
 *
 * Returns { supported: false } on non-Linux platforms.
 * Returns zero rates on the first call (no previous reading to compare against).
 */

import { readFileSync } from 'fs';

let prevStats = null;
let prevTime = null;

const SECTOR_SIZE_BYTES = 512;

/**
 * @typedef {object} DiskIOSnapshot
 * @property {boolean} supported
 * @property {number} [readBytesPerSec]
 * @property {number} [writeBytesPerSec]
 * @property {number} [readMBPerSec]
 * @property {number} [writeMBPerSec]
 */

function readProcDiskstats() {
  const content = readFileSync('/proc/diskstats', 'utf8');
  const stats = {};

  for (const line of content.trim().split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 14) continue;

    const device = parts[2];

    // Skip partition entries (e.g. sda1, nvme0n1p1) — keep only base devices
    if (/\d+$/.test(device) && /^[a-z]+\d+p\d+$/.test(device)) continue;
    if (/^[a-z]+\d+[a-z]$/.test(device)) continue; // e.g. sda1 → skip

    stats[device] = {
      sectorsRead: parseInt(parts[5], 10),
      sectorsWritten: parseInt(parts[9], 10),
    };
  }

  return stats;
}

/**
 * Returns disk read/write throughput since the last call.
 * @returns {DiskIOSnapshot}
 */
export function collectDiskIO() {
  let current;
  try {
    current = readProcDiskstats();
  } catch {
    return { supported: false };
  }

  const now = Date.now();

  if (!prevStats || !prevTime) {
    prevStats = current;
    prevTime = now;
    return { supported: true, readBytesPerSec: 0, writeBytesPerSec: 0, readMBPerSec: 0, writeMBPerSec: 0 };
  }

  const elapsedSec = (now - prevTime) / 1000;
  if (elapsedSec <= 0) return { supported: true, readBytesPerSec: 0, writeBytesPerSec: 0, readMBPerSec: 0, writeMBPerSec: 0 };

  let totalSectorsRead = 0;
  let totalSectorsWritten = 0;

  for (const device of Object.keys(current)) {
    if (prevStats[device]) {
      totalSectorsRead += current[device].sectorsRead - prevStats[device].sectorsRead;
      totalSectorsWritten += current[device].sectorsWritten - prevStats[device].sectorsWritten;
    }
  }

  prevStats = current;
  prevTime = now;

  const readBytesPerSec = Math.max(0, Math.round((totalSectorsRead * SECTOR_SIZE_BYTES) / elapsedSec));
  const writeBytesPerSec = Math.max(0, Math.round((totalSectorsWritten * SECTOR_SIZE_BYTES) / elapsedSec));

  return {
    supported: true,
    readBytesPerSec,
    writeBytesPerSec,
    readMBPerSec: parseFloat((readBytesPerSec / 1024 / 1024).toFixed(2)),
    writeMBPerSec: parseFloat((writeBytesPerSec / 1024 / 1024).toFixed(2)),
  };
}

/** Resets internal state (useful for testing). */
export function resetDiskIOCollector() {
  prevStats = null;
  prevTime = null;
}
