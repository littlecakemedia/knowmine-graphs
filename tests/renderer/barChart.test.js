import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeBarChart } from '../../src/renderer/barChart.js';
import { gradient } from '../../src/helpers/colors.js';

describe('makeBarChart', () => {
  test('produces correct type and payload', () => {
    const dto = makeBarChart({ values: [1, 2, 3] });
    assert.equal(dto.type, 'BarChart');
    assert.deepEqual(dto.payload.values, [1, 2, 3]);
  });

  test('applies default barColor', () => {
    const dto = makeBarChart({ values: [10] });
    assert.deepEqual(dto.payload.barColor, gradient.blue);
  });

  test('accepts custom barColor', () => {
    const color = { type: 'Fill', primaryColor: '#FF0000' };
    const dto = makeBarChart({ values: [5], barColor: color });
    assert.deepEqual(dto.payload.barColor, color);
  });

  test('includes envelope fields with defaults', () => {
    const dto = makeBarChart({ values: [1] });
    assert.equal(dto.version, '1.0');
    assert.equal(dto.refreshInterval, 30);
    assert.equal(dto.name, null);
    assert.equal(dto.backgroundType, 'NONE');
  });

  test('sets name when provided', () => {
    const dto = makeBarChart({ name: 'My Chart', values: [1] });
    assert.equal(dto.name, 'My Chart');
  });

  test('sets highlightIndex and highlightColor', () => {
    const color = { type: 'Fill', primaryColor: '#FF8C00' };
    const dto = makeBarChart({ values: [1, 2, 3], highlightIndex: 1, highlightColor: color });
    assert.equal(dto.payload.highlightIndex, 1);
    assert.deepEqual(dto.payload.highlightColor, color);
  });

  test('fromDTO passes through unchanged', () => {
    const dto = makeBarChart({ values: [1] });
    assert.deepEqual(makeBarChart.fromDTO(dto), dto);
  });
});
