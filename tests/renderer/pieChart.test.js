import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makePieChart, makeSlice } from '../../src/renderer/pieChart.js';

describe('makePieChart', () => {
  const slices = [
    { value: 40, color: { type: 'Fill', primaryColor: '#FF0000' }, label: 'A', labelColor: null },
    { value: 60, color: { type: 'Fill', primaryColor: '#00FF00' }, label: 'B', labelColor: null },
  ];

  test('produces correct type', () => {
    const dto = makePieChart({ slices });
    assert.equal(dto.type, 'PieChart');
  });

  test('payload contains slices', () => {
    const dto = makePieChart({ slices });
    assert.deepEqual(dto.payload.slices, slices);
  });

  test('defaults innerRadiusRatio to 0', () => {
    const dto = makePieChart({ slices });
    assert.equal(dto.payload.innerRadiusRatio, 0.0);
  });

  test('accepts custom innerRadiusRatio', () => {
    const dto = makePieChart({ slices, innerRadiusRatio: 0.5 });
    assert.equal(dto.payload.innerRadiusRatio, 0.5);
  });
});

describe('makeSlice', () => {
  test('builds a slice with defaults', () => {
    const slice = makeSlice({ value: 50, color: { type: 'Fill', primaryColor: '#FFFFFF' } });
    assert.equal(slice.value, 50);
    assert.equal(slice.label, null);
    assert.equal(slice.labelColor, null);
  });

  test('accepts label', () => {
    const slice = makeSlice({ value: 30, color: { type: 'Fill', primaryColor: '#000000' }, label: 'X' });
    assert.equal(slice.label, 'X');
  });
});
