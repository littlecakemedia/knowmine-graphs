import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeKPIMetric } from '../../src/renderer/kpiMetric.js';

describe('makeKPIMetric', () => {
  test('produces correct type', () => {
    const dto = makeKPIMetric({ value: 8432 });
    assert.equal(dto.type, 'KPIMetric');
  });

  test('payload contains value', () => {
    const dto = makeKPIMetric({ value: 42 });
    assert.equal(dto.payload.value, 42);
  });

  test('trendDirection defaults to neutral', () => {
    const dto = makeKPIMetric({ value: 100 });
    assert.equal(dto.payload.trendDirection, 'neutral');
  });

  test('accepts unit', () => {
    const dto = makeKPIMetric({ value: 3.14, unit: 'km' });
    assert.equal(dto.payload.unit, 'km');
  });

  test('showSparkline defaults to false', () => {
    const dto = makeKPIMetric({ value: 0 });
    assert.equal(dto.payload.showSparkline, false);
  });

  test('isInt defaults to false', () => {
    const dto = makeKPIMetric({ value: 1.5 });
    assert.equal(dto.payload.isInt, false);
  });

  test('accepts trend data', () => {
    const dto = makeKPIMetric({
      value: 100,
      trendPercentage: 12.5,
      trendDirection: 'up',
      sparklineValues: [80, 85, 90, 95, 100],
      showSparkline: true,
    });
    assert.equal(dto.payload.trendPercentage, 12.5);
    assert.equal(dto.payload.trendDirection, 'up');
    assert.equal(dto.payload.showSparkline, true);
    assert.equal(dto.payload.sparklineValues.length, 5);
  });
});
