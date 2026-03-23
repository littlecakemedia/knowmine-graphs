import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeAreaChart } from '../../src/renderer/areaChart.js';

describe('makeAreaChart', () => {
  test('produces correct type', () => {
    const dto = makeAreaChart({ values: [1, 2, 3] });
    assert.equal(dto.type, 'AreaChart');
  });

  test('payload contains values', () => {
    const dto = makeAreaChart({ values: [10, 20, 30] });
    assert.deepEqual(dto.payload.values, [10, 20, 30]);
  });

  test('smoothingEnabled defaults to true', () => {
    const dto = makeAreaChart({ values: [1, 2] });
    assert.equal(dto.payload.smoothingEnabled, true);
  });

  test('accepts baselineValue', () => {
    const dto = makeAreaChart({ values: [5, 10, 15], baselineValue: 3 });
    assert.equal(dto.payload.baselineValue, 3);
  });

  test('accepts labels and yAxis config', () => {
    const dto = makeAreaChart({
      values: [1, 2, 3],
      labels: ['A', 'B', 'C'],
      yAxisLabels: ['0', '2', '4'],
      yAxisPosition: 'LEFT',
    });
    assert.deepEqual(dto.payload.labels, ['A', 'B', 'C']);
    assert.equal(dto.payload.yAxisPosition, 'LEFT');
  });
});
