import { test, describe, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  enableValidation,
  disableValidation,
  isValidationEnabled,
  validateColorSpec,
  validateValues,
  validateProgress,
  validateSeriesLengths,
  validateGaugeRange,
} from '../../src/helpers/validate.js';

describe('validation toggle', () => {
  afterEach(() => disableValidation());

  test('is disabled by default', () => {
    assert.equal(isValidationEnabled(), false);
  });

  test('can be enabled', () => {
    enableValidation();
    assert.equal(isValidationEnabled(), true);
  });

  test('does not throw when disabled', () => {
    disableValidation();
    assert.doesNotThrow(() => validateValues(null)); // null would normally throw
  });
});

describe('validateColorSpec (enabled)', () => {
  beforeEach(() => enableValidation());
  afterEach(() => disableValidation());

  test('passes for valid Fill ColorSpec', () => {
    assert.doesNotThrow(() =>
      validateColorSpec({ type: 'Fill', primaryColor: '#FF0000' }, 'color')
    );
  });

  test('passes for valid Gradient ColorSpec', () => {
    assert.doesNotThrow(() =>
      validateColorSpec({ type: 'Gradient', primaryColor: '#FF0000', secondaryColor: '#0000FF' }, 'color')
    );
  });

  test('throws for missing secondaryColor on Gradient', () => {
    assert.throws(() =>
      validateColorSpec({ type: 'Gradient', primaryColor: '#FF0000' }, 'color')
    );
  });

  test('throws for invalid type', () => {
    assert.throws(() =>
      validateColorSpec({ type: 'Unknown', primaryColor: '#FF0000' }, 'color')
    );
  });
});

describe('validateValues (enabled)', () => {
  beforeEach(() => enableValidation());
  afterEach(() => disableValidation());

  test('passes for valid array', () => {
    assert.doesNotThrow(() => validateValues([1, 2, 3]));
  });

  test('throws for non-array', () => {
    assert.throws(() => validateValues('not an array'));
  });

  test('throws for empty array when minLength=1', () => {
    assert.throws(() => validateValues([]));
  });

  test('throws if element is not a number', () => {
    assert.throws(() => validateValues([1, 'two', 3]));
  });
});

describe('validateProgress (enabled)', () => {
  beforeEach(() => enableValidation());
  afterEach(() => disableValidation());

  test('passes for 0', () => assert.doesNotThrow(() => validateProgress(0)));
  test('passes for 1', () => assert.doesNotThrow(() => validateProgress(1)));
  test('passes for 0.5', () => assert.doesNotThrow(() => validateProgress(0.5)));
  test('throws for -0.1', () => assert.throws(() => validateProgress(-0.1)));
  test('throws for 1.1', () => assert.throws(() => validateProgress(1.1)));
});

describe('validateSeriesLengths (enabled)', () => {
  beforeEach(() => enableValidation());
  afterEach(() => disableValidation());

  test('passes for equal-length series', () => {
    assert.doesNotThrow(() =>
      validateSeriesLengths([{ values: [1, 2] }, { values: [3, 4] }])
    );
  });

  test('throws for mismatched series lengths', () => {
    assert.throws(() =>
      validateSeriesLengths([{ values: [1, 2] }, { values: [3, 4, 5] }])
    );
  });
});

describe('validateGaugeRange (enabled)', () => {
  beforeEach(() => enableValidation());
  afterEach(() => disableValidation());

  test('passes for valid range', () => {
    assert.doesNotThrow(() => validateGaugeRange({ value: 50, minValue: 0, maxValue: 100 }));
  });

  test('throws when minValue >= maxValue', () => {
    assert.throws(() => validateGaugeRange({ value: 0, minValue: 100, maxValue: 0 }));
  });
});
