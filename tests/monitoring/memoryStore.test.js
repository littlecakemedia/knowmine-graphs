import { test, describe, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { store } from '../../src/monitoring/store/memoryStore.js';

describe('memoryStore', () => {
  beforeEach(() => store.init({ bufferSize: 10 }));

  test('starts empty after init', () => {
    assert.equal(store.keys().length, 0);
  });

  test('push creates a buffer and stores a sample', () => {
    store.push('cpu', 42);
    assert.equal(store.count('cpu'), 1);
  });

  test('get returns samples with timestamp and value', () => {
    store.push('cpu', 75);
    const samples = store.get('cpu');
    assert.equal(samples.length, 1);
    assert.ok(typeof samples[0].timestamp === 'number');
    assert.equal(samples[0].value, 75);
  });

  test('last(key, n) returns the last n samples', () => {
    for (let i = 1; i <= 5; i++) store.push('mem', i);
    const last2 = store.last('mem', 2);
    assert.equal(last2.length, 2);
    assert.equal(last2[1].value, 5);
  });

  test('values() extracts raw values', () => {
    store.push('cpu', 10);
    store.push('cpu', 20);
    store.push('cpu', 30);
    assert.deepEqual(store.values('cpu'), [10, 20, 30]);
  });

  test('values(key, maxPoints) limits results', () => {
    for (let i = 1; i <= 5; i++) store.push('cpu', i);
    const vals = store.values('cpu', 3);
    assert.equal(vals.length, 3);
    assert.equal(vals[2], 5); // most recent
  });

  test('keys() lists registered metrics', () => {
    store.push('cpu', 1);
    store.push('network', 2);
    assert.ok(store.keys().includes('cpu'));
    assert.ok(store.keys().includes('network'));
  });

  test('clear(key) clears a specific metric', () => {
    store.push('cpu', 1);
    store.push('mem', 2);
    store.clear('cpu');
    assert.equal(store.count('cpu'), 0);
    assert.equal(store.count('mem'), 1);
  });

  test('clear() clears all metrics', () => {
    store.push('cpu', 1);
    store.push('mem', 2);
    store.clear();
    assert.equal(store.keys().length, 0);
  });

  test('get returns empty array for unknown key', () => {
    assert.deepEqual(store.get('unknown'), []);
  });

  test('respects bufferSize cap', () => {
    store.init({ bufferSize: 3 });
    for (let i = 1; i <= 6; i++) store.push('cpu', i);
    assert.equal(store.count('cpu'), 3);
    assert.deepEqual(store.values('cpu'), [4, 5, 6]);
  });
});
