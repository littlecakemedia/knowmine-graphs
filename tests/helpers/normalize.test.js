import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  normalizeRange,
  normalizeSum,
  makeYAxisLabels,
  clamp,
  round,
  formatBytes,
  toPercent,
} from '../../src/helpers/normalize.js';

describe('normalizeRange', () => {
  test('normalizes to [0, 1]', () => {
    const result = normalizeRange([0, 50, 100]);
    assert.deepEqual(result, [0, 0.5, 1]);
  });

  test('handles flat array (all same value)', () => {
    const result = normalizeRange([5, 5, 5]);
    assert.deepEqual(result, [0, 0, 0]);
  });
});

describe('normalizeSum', () => {
  test('makes values sum to 1', () => {
    const result = normalizeSum([1, 1, 2]);
    const sum = result.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 1) < 1e-10);
  });

  test('handles all-zero array', () => {
    const result = normalizeSum([0, 0, 0]);
    assert.deepEqual(result, [0, 0, 0]);
  });
});

describe('makeYAxisLabels', () => {
  test('produces correct number of labels', () => {
    const labels = makeYAxisLabels(0, 100, 3);
    assert.equal(labels.length, 3);
  });

  test('first label is min, last is max', () => {
    const labels = makeYAxisLabels(10, 22, 3);
    assert.equal(labels[0], '10');
    assert.equal(labels[2], '22');
  });

  test('respects decimal places', () => {
    const labels = makeYAxisLabels(0, 1, 3, 2);
    assert.equal(labels[1], '0.50');
  });
});

describe('clamp', () => {
  test('clamps below min', () => assert.equal(clamp(-5, 0, 100), 0));
  test('clamps above max', () => assert.equal(clamp(200, 0, 100), 100));
  test('passes through value in range', () => assert.equal(clamp(50, 0, 100), 50));
});

describe('round', () => {
  test('rounds to 2 decimal places by default', () => {
    assert.equal(round(3.14159), 3.14);
  });

  test('rounds to specified decimal places', () => {
    assert.equal(round(3.14159, 4), 3.1416);
  });
});

describe('formatBytes', () => {
  test('formats 0 bytes', () => assert.equal(formatBytes(0), '0 B'));
  test('formats kilobytes', () => assert.equal(formatBytes(1024), '1 KB'));
  test('formats megabytes', () => assert.equal(formatBytes(1024 * 1024), '1 MB'));
  test('formats gigabytes', () => assert.equal(formatBytes(1024 ** 3), '1 GB'));
});

describe('toPercent', () => {
  test('calculates percentage', () => assert.equal(toPercent(50, 200), 25));
  test('handles zero total', () => assert.equal(toPercent(10, 0), 0));
});
