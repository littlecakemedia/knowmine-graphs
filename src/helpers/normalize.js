/**
 * Data normalization and utility functions for KnowMine graph widgets.
 */

/**
 * Normalizes an array of values to the [0, 1] range.
 * @param {number[]} values
 * @returns {number[]}
 */
export function normalizeRange(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0);
  return values.map(v => (v - min) / range);
}

/**
 * Normalizes an array of values so they sum to 1 (proportional weights).
 * @param {number[]} values
 * @returns {number[]}
 */
export function normalizeSum(values) {
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return values.map(() => 0);
  return values.map(v => v / total);
}

/**
 * Generates evenly spaced Y-axis label strings between min and max.
 * Labels are ordered from bottom (min) to top (max), as required by the spec.
 *
 * @param {number} min - Minimum axis value
 * @param {number} max - Maximum axis value
 * @param {number} [steps=3] - Total number of labels (including endpoints)
 * @param {number} [decimals=0] - Decimal places for each label
 * @returns {string[]}
 *
 * @example
 * makeYAxisLabels(0, 100, 3) // ['0', '50', '100']
 * makeYAxisLabels(10, 22, 3) // ['10', '16', '22']
 */
export function makeYAxisLabels(min, max, steps = 3, decimals = 0) {
  if (steps < 2) return [min.toFixed(decimals)];
  const labels = [];
  const step = (max - min) / (steps - 1);
  for (let i = 0; i < steps; i++) {
    labels.push((min + step * i).toFixed(decimals));
  }
  return labels;
}

/**
 * Clamps a value between min and max (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a given number of decimal places.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Formats bytes into a human-readable string (B, KB, MB, GB, TB).
 * @param {number} bytes
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${round(bytes / k ** i, decimals)} ${sizes[i]}`;
}

/**
 * Calculates the percentage of a value relative to a total.
 * @param {number} value
 * @param {number} total
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function toPercent(value, total, decimals = 2) {
  if (total === 0) return 0;
  return round((value / total) * 100, decimals);
}
