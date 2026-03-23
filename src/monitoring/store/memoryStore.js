/**
 * In-memory time-series store backed by per-metric RingBuffers.
 * All data lives in RAM and is automatically evicted via the ring buffer.
 * No persistence, no external dependencies.
 */

import { RingBuffer } from './ringBuffer.js';

let defaultBufferSize = 360;
const buffers = new Map();

export const store = {
  /**
   * Initialises (or resets) the store.
   * Call this before startMonitoring() if you need custom buffer sizes.
   * @param {object} [opts]
   * @param {number} [opts.bufferSize=360] - Samples retained per metric
   */
  init({ bufferSize = 360 } = {}) {
    defaultBufferSize = bufferSize;
    buffers.clear();
  },

  /**
   * Pushes a sample for a named metric.
   * A RingBuffer is created automatically on first use.
   * @param {string} key - Metric name (e.g. 'cpu', 'memory')
   * @param {*} value - Any serialisable value
   */
  push(key, value) {
    if (!buffers.has(key)) {
      buffers.set(key, new RingBuffer(defaultBufferSize));
    }
    buffers.get(key).push({ timestamp: Date.now(), value });
  },

  /**
   * Returns all stored samples for a metric in chronological order.
   * Each entry is `{ timestamp: number, value: * }`.
   * @param {string} key
   * @returns {Array<{ timestamp: number, value: * }>}
   */
  get(key) {
    return buffers.get(key)?.toArray() ?? [];
  },

  /**
   * Returns the last n samples for a metric in chronological order.
   * @param {string} key
   * @param {number} [n=1]
   * @returns {Array<{ timestamp: number, value: * }>}
   */
  last(key, n = 1) {
    return buffers.get(key)?.last(n) ?? [];
  },

  /**
   * Returns just the raw values (without timestamps) for a metric.
   * Useful for feeding directly into chart renderers.
   * @param {string} key
   * @param {number} [maxPoints] - Limit to the last N samples
   * @returns {number[]}
   */
  values(key, maxPoints) {
    const entries = maxPoints ? this.last(key, maxPoints) : this.get(key);
    return entries.map(e => e.value);
  },

  /**
   * Clears a specific metric buffer, or all buffers if no key is given.
   * @param {string} [key]
   */
  clear(key) {
    if (key) {
      buffers.get(key)?.clear();
    } else {
      buffers.clear();
    }
  },

  /** Returns all registered metric keys. */
  keys() {
    return [...buffers.keys()];
  },

  /**
   * Returns the number of stored samples for a metric.
   * @param {string} key
   * @returns {number}
   */
  count(key) {
    return buffers.get(key)?.length ?? 0;
  },
};
