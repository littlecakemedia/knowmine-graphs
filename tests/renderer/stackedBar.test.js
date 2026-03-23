import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeStackedBarChart, makeSeries } from '../../src/renderer/stackedBar.js';
import { gradient } from '../../src/helpers/colors.js';

describe('makeStackedBarChart', () => {
  const series = [
    makeSeries([1, 2, 3], gradient.blue),
    makeSeries([4, 5, 6], gradient.sunset),
  ];

  test('produces correct type', () => {
    const dto = makeStackedBarChart({ series });
    assert.equal(dto.type, 'StackedBarChart');
  });

  test('payload contains series', () => {
    const dto = makeStackedBarChart({ series });
    assert.equal(dto.payload.series.length, 2);
  });

  test('defaults cornerRadius to 6', () => {
    const dto = makeStackedBarChart({ series });
    assert.equal(dto.payload.cornerRadius, 6);
  });
});

describe('makeSeries', () => {
  test('builds a series object', () => {
    const s = makeSeries([10, 20], gradient.blue);
    assert.deepEqual(s.values, [10, 20]);
    assert.deepEqual(s.color, gradient.blue);
  });
});
