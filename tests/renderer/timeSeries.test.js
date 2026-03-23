import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeTimeSeriesLineChart } from '../../src/renderer/timeSeries.js';

describe('makeTimeSeriesLineChart', () => {
  test('produces correct type', () => {
    const dto = makeTimeSeriesLineChart({ values: [1, 2, 3] });
    assert.equal(dto.type, 'TimeSeriesLineChart');
  });

  test('showGrid defaults to true', () => {
    const dto = makeTimeSeriesLineChart({ values: [1, 2] });
    assert.equal(dto.payload.showGrid, true);
  });

  test('gridRows and gridColumns have defaults', () => {
    const dto = makeTimeSeriesLineChart({ values: [1, 2] });
    assert.equal(dto.payload.gridRows, 4);
    assert.equal(dto.payload.gridColumns, 6);
  });

  test('accepts custom grid config', () => {
    const dto = makeTimeSeriesLineChart({ values: [1, 2, 3], gridRows: 6, gridColumns: 8 });
    assert.equal(dto.payload.gridRows, 6);
    assert.equal(dto.payload.gridColumns, 8);
  });
});
