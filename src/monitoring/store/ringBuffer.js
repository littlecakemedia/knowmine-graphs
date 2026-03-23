/**
 * Fixed-size circular buffer (ring buffer) for time-series data.
 * Oldest entries are automatically overwritten when the buffer is full.
 * O(1) push, O(n) toArray.
 */
export class RingBuffer {
  #data;
  #size;
  #head = 0;
  #count = 0;

  /**
   * @param {number} size - Maximum number of entries to retain
   */
  constructor(size) {
    if (size < 1) throw new Error('RingBuffer size must be at least 1');
    this.#size = size;
    this.#data = new Array(size);
  }

  /**
   * Inserts a value. Overwrites the oldest entry when full.
   * @param {*} value
   */
  push(value) {
    this.#data[this.#head] = value;
    this.#head = (this.#head + 1) % this.#size;
    if (this.#count < this.#size) this.#count++;
  }

  /**
   * Returns all stored values in insertion order (oldest first).
   * @returns {Array}
   */
  toArray() {
    if (this.#count < this.#size) {
      return this.#data.slice(0, this.#count);
    }
    return [
      ...this.#data.slice(this.#head),
      ...this.#data.slice(0, this.#head),
    ];
  }

  /**
   * Returns the last n entries in insertion order.
   * @param {number} [n=1]
   * @returns {Array}
   */
  last(n = 1) {
    return this.toArray().slice(-n);
  }

  /** Number of stored entries. */
  get length() {
    return this.#count;
  }

  /** Maximum capacity. */
  get capacity() {
    return this.#size;
  }

  /** Returns true if the buffer has reached maximum capacity. */
  get isFull() {
    return this.#count === this.#size;
  }

  /** Removes all entries. */
  clear() {
    this.#data = new Array(this.#size);
    this.#head = 0;
    this.#count = 0;
  }
}
