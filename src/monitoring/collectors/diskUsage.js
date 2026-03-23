/**
 * Disk usage collector.
 * Reports total/used/free space for a filesystem path.
 *
 * Uses fs.statfs (Node >= 18.15.0) with a fallback to the `df` CLI tool
 * for older Node 18 patch versions.
 */

import { statfs } from 'fs/promises';
import { execFileSync } from 'child_process';

/**
 * @typedef {object} DiskUsageSnapshot
 * @property {boolean} supported
 * @property {string}  [path]
 * @property {number}  [totalBytes]
 * @property {number}  [freeBytes]
 * @property {number}  [usedBytes]
 * @property {number}  [usedPercent]
 * @property {string}  [totalFormatted]  - e.g. '120 GB'
 * @property {string}  [usedFormatted]
 * @property {string}  [freeFormatted]
 */

function formatGb(bytes) {
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

async function fromStatfs(path) {
  try {
    const stats = await statfs(path);
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;
    const used = total - free;
    return { path, total, free, used };
  } catch {
    return null;
  }
}

function fromDf(path) {
  try {
    const output = execFileSync('df', ['-k', path], { encoding: 'utf8', timeout: 3000 });
    const parts = output.trim().split('\n')[1].trim().split(/\s+/);
    const total = parseInt(parts[1], 10) * 1024;
    const used = parseInt(parts[2], 10) * 1024;
    const free = parseInt(parts[3], 10) * 1024;
    return { path, total, free, used };
  } catch {
    return null;
  }
}

/**
 * Returns disk usage for the given path.
 * @param {string} [path='/'] - Filesystem path to inspect
 * @returns {Promise<DiskUsageSnapshot>}
 */
export async function collectDiskUsage(path = '/') {
  const result = (await fromStatfs(path)) ?? fromDf(path);

  if (!result) return { supported: false };

  const { total, free, used } = result;
  const usedPercent = total > 0 ? parseFloat(((used / total) * 100).toFixed(2)) : 0;

  return {
    supported: true,
    path,
    totalBytes: total,
    freeBytes: free,
    usedBytes: used,
    usedPercent,
    totalFormatted: formatGb(total),
    usedFormatted: formatGb(used),
    freeFormatted: formatGb(free),
  };
}
