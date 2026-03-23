import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { makeCircularProgress } from '../../src/renderer/circularProgress.js';

describe('makeCircularProgress', () => {
  test('produces correct type', () => {
    const dto = makeCircularProgress({ progress: 0.72 });
    assert.equal(dto.type, 'CircularProgress');
  });

  test('payload contains progress value', () => {
    const dto = makeCircularProgress({ progress: 0.5 });
    assert.equal(dto.payload.progress, 0.5);
  });

  test('showValue defaults to true', () => {
    const dto = makeCircularProgress({ progress: 0.3 });
    assert.equal(dto.payload.showValue, true);
  });

  test('captionPosition defaults to below', () => {
    const dto = makeCircularProgress({ progress: 0.3, caption: 'Goal' });
    assert.equal(dto.payload.captionPosition, 'below');
  });

  test('accepts above captionPosition', () => {
    const dto = makeCircularProgress({ progress: 0.3, caption: 'Goal', captionPosition: 'above' });
    assert.equal(dto.payload.captionPosition, 'above');
  });

  test('lineWidth defaults to 14', () => {
    const dto = makeCircularProgress({ progress: 1 });
    assert.equal(dto.payload.lineWidth, 14);
  });
});
