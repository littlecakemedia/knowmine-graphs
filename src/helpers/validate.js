/**
 * Optional input validation for KnowMine graph renderers.
 *
 * Validation is DISABLED by default for production performance.
 * Enable it during development to catch misconfigurations early.
 *
 * @example
 * import { enableValidation } from 'knowmine-graphs';
 * enableValidation(); // call once at app startup
 */

let validationEnabled = false;

/** Enables input validation. Call once at application startup in development. */
export function enableValidation() {
  validationEnabled = true;
}

/** Disables input validation (default state). */
export function disableValidation() {
  validationEnabled = false;
}

/** Returns whether validation is currently enabled. */
export function isValidationEnabled() {
  return validationEnabled;
}

function assert(condition, message) {
  if (validationEnabled && !condition) {
    throw new Error(`[knowmine-graphs] ${message}`);
  }
}

/**
 * Validates a ColorSpec object.
 * @param {*} value
 * @param {string} fieldName
 */
export function validateColorSpec(value, fieldName) {
  if (!validationEnabled) return;
  assert(value !== null && value !== undefined, `${fieldName} is required`);
  assert(typeof value === 'object', `${fieldName} must be a ColorSpec object`);
  assert(
    value.type === 'Fill' || value.type === 'Gradient',
    `${fieldName}.type must be "Fill" or "Gradient", got "${value.type}"`
  );
  assert(
    typeof value.primaryColor === 'string',
    `${fieldName}.primaryColor must be a string`
  );
  if (value.type === 'Gradient') {
    assert(
      typeof value.secondaryColor === 'string',
      `${fieldName}.secondaryColor is required when type is "Gradient"`
    );
  }
}

/**
 * Validates an array of numbers.
 * @param {*} values
 * @param {string} [fieldName='values']
 * @param {number} [minLength=1]
 */
export function validateValues(values, fieldName = 'values', minLength = 1) {
  if (!validationEnabled) return;
  assert(Array.isArray(values), `${fieldName} must be an array`);
  assert(
    values.length >= minLength,
    `${fieldName} must have at least ${minLength} element(s), got ${values?.length ?? 0}`
  );
  values.forEach((v, i) =>
    assert(typeof v === 'number', `${fieldName}[${i}] must be a number, got ${typeof v}`)
  );
}

/**
 * Validates a progress value in the [0, 1] range.
 * @param {*} progress
 */
export function validateProgress(progress) {
  if (!validationEnabled) return;
  assert(typeof progress === 'number', `progress must be a number, got ${typeof progress}`);
  assert(progress >= 0 && progress <= 1, `progress must be between 0 and 1, got ${progress}`);
}

/**
 * Validates that all series in a stacked bar have the same number of values.
 * @param {Array<{ values: number[] }>} series
 */
export function validateSeriesLengths(series) {
  if (!validationEnabled) return;
  assert(Array.isArray(series) && series.length > 0, 'series must be a non-empty array');
  const len = series[0]?.values?.length;
  assert(typeof len === 'number', 'series[0].values must be an array');
  series.forEach((s, i) => {
    assert(Array.isArray(s.values), `series[${i}].values must be an array`);
    assert(
      s.values.length === len,
      `All series must have the same number of values. series[${i}] has ${s.values.length}, expected ${len}`
    );
  });
}

/**
 * Validates a RadialGauge range (minValue < maxValue, value in range).
 * @param {{ value: number, minValue: number, maxValue: number }} opts
 */
export function validateGaugeRange({ value, minValue, maxValue }) {
  if (!validationEnabled) return;
  assert(typeof minValue === 'number', 'minValue must be a number');
  assert(typeof maxValue === 'number', 'maxValue must be a number');
  assert(minValue < maxValue, `minValue (${minValue}) must be less than maxValue (${maxValue})`);
  assert(typeof value === 'number', 'value must be a number');
}

/**
 * Validates the refreshInterval envelope field.
 * @param {*} refreshInterval
 */
export function validateRefreshInterval(refreshInterval) {
  if (!validationEnabled) return;
  if (refreshInterval === undefined || refreshInterval === null) return;
  assert(typeof refreshInterval === 'number', 'refreshInterval must be a number');
  assert(refreshInterval >= 5 && refreshInterval <= 60, 'refreshInterval must be between 5 and 60 seconds');
}
