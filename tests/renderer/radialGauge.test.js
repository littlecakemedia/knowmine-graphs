import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeRadialGauge, makeThreshold } from '../../src/renderer/radialGauge.js';
import { fill } from '../../src/helpers/colors.js';

describe('makeRadialGauge', () => {
  test('produces correct type', () => {
    const dto = makeRadialGauge({ value: 50, minValue: 0, maxValue: 100 });
    assert.equal(dto.type, 'RadialGauge');
  });

  test('payload contains value and range', () => {
    const dto = makeRadialGauge({ value: 72, minValue: 0, maxValue: 100 });
    assert.equal(dto.payload.value, 72);
    assert.equal(dto.payload.minValue, 0);
    assert.equal(dto.payload.maxValue, 100);
  });

  test('defaults gapAngle to 120', () => {
    const dto = makeRadialGauge({ value: 0, minValue: 0, maxValue: 10 });
    assert.equal(dto.payload.gapAngle, 120);
  });

  test('accepts thresholds', () => {
    const thresholds = [
      makeThreshold(50, { type: 'Fill', primaryColor: '#00FF00' }),
      makeThreshold(100, { type: 'Fill', primaryColor: '#FF0000' }),
    ];
    const dto = makeRadialGauge({ value: 30, minValue: 0, maxValue: 100, thresholds });
    assert.equal(dto.payload.thresholds.length, 2);
  });

  test('accepts label', () => {
    const dto = makeRadialGauge({ value: 50, minValue: 0, maxValue: 100, label: 'CPU' });
    assert.equal(dto.payload.label, 'CPU');
  });

  test('unit defaults to null', () => {
    const dto = makeRadialGauge({ value: 50, minValue: 0, maxValue: 100 });
    assert.equal(dto.payload.unit, null);
  });

  test('accepts unit', () => {
    const dto = makeRadialGauge({ value: 72, minValue: 0, maxValue: 100, unit: '%' });
    assert.equal(dto.payload.unit, '%');
  });
});

describe('makeThreshold', () => {
  test('builds a threshold object', () => {
    const t = makeThreshold(80, fill.orange);
    assert.equal(t.value, 80);
    assert.deepEqual(t.color, fill.orange);
  });
});
