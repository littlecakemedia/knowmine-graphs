import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { RingBuffer } from '../../src/monitoring/store/ringBuffer.js';

describe('RingBuffer', () => {
  test('throws on size < 1', () => {
    assert.throws(() => new RingBuffer(0));
  });

  test('starts empty', () => {
    const rb = new RingBuffer(3);
    assert.equal(rb.length, 0);
    assert.deepEqual(rb.toArray(), []);
  });

  test('push adds elements', () => {
    const rb = new RingBuffer(3);
    rb.push(1);
    rb.push(2);
    assert.equal(rb.length, 2);
    assert.deepEqual(rb.toArray(), [1, 2]);
  });

  test('maintains insertion order', () => {
    const rb = new RingBuffer(5);
    [10, 20, 30, 40, 50].forEach(v => rb.push(v));
    assert.deepEqual(rb.toArray(), [10, 20, 30, 40, 50]);
  });

  test('overwrites oldest entry when full', () => {
    const rb = new RingBuffer(3);
    rb.push(1); rb.push(2); rb.push(3);
    rb.push(4); // overwrites 1
    assert.deepEqual(rb.toArray(), [2, 3, 4]);
  });

  test('isFull is true when at capacity', () => {
    const rb = new RingBuffer(2);
    rb.push('a');
    assert.equal(rb.isFull, false);
    rb.push('b');
    assert.equal(rb.isFull, true);
  });

  test('last(n) returns last n entries', () => {
    const rb = new RingBuffer(5);
    [1, 2, 3, 4, 5].forEach(v => rb.push(v));
    assert.deepEqual(rb.last(3), [3, 4, 5]);
  });

  test('last(1) returns last entry as array', () => {
    const rb = new RingBuffer(5);
    rb.push(99);
    assert.deepEqual(rb.last(1), [99]);
  });

  test('clear resets the buffer', () => {
    const rb = new RingBuffer(3);
    rb.push(1); rb.push(2);
    rb.clear();
    assert.equal(rb.length, 0);
    assert.deepEqual(rb.toArray(), []);
  });

  test('capacity reports the max size', () => {
    const rb = new RingBuffer(10);
    assert.equal(rb.capacity, 10);
  });

  test('wraps around correctly after multiple rotations', () => {
    const rb = new RingBuffer(3);
    for (let i = 1; i <= 9; i++) rb.push(i);
    assert.deepEqual(rb.toArray(), [7, 8, 9]);
  });
});
