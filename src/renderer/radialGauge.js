/**
 * RadialGauge renderer — type: "RadialGauge" (1×1)
 *
 * Arc-based gauge with configurable opening angle. Displays the numeric value
 * at the center. Supports color thresholds and optional graduation ticks.
 */

import { buildEnvelope } from './_envelope.js';
import { validateGaugeRange, validateColorSpec } from '../helpers/validate.js';
import { gradient, fill } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.name]
 * @param {number} opts.value - Current value (clamped to [minValue, maxValue])
 * @param {number} opts.minValue
 * @param {number} opts.maxValue
 * @param {import('../../types.d.ts').ColorSpec} [opts.gaugeColor] - Arc color (ignored when threshold active)
 * @param {import('../../types.d.ts').ThresholdSpec[]} [opts.thresholds=[]]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.gaugeBackgroundColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.glowColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.valueTextColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.tickColor]
 * @param {number} [opts.gapAngle=120] - 0=full circle, 120=tachometer, 180=semicircle
 * @param {number} [opts.lineWidth=14]
 * @param {boolean} [opts.showTicks=false]
 * @param {boolean} [opts.showGlow=false]
 * @param {string|null} [opts.label] - Descriptive text below the value
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').RadialGaugeDTO}
 */
export function makeRadialGauge({
  name = null,
  value,
  minValue,
  maxValue,
  gaugeColor = gradient.blue,
  thresholds = [],
  gaugeBackgroundColor = { type: 'Fill', primaryColor: '#FFFFFF26' },
  glowColor = null,
  valueTextColor = { type: 'Fill', primaryColor: '#FFFFFF' },
  tickColor = { type: 'Fill', primaryColor: '#FFFFFF66' },
  gapAngle = 120,
  lineWidth = 14,
  showTicks = false,
  showGlow = false,
  label = null,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = null,
  backgroundType = 'NONE',
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  validateGaugeRange({ value, minValue, maxValue });
  validateColorSpec(gaugeColor, 'gaugeColor');

  const payload = {
    value,
    minValue,
    maxValue,
    gaugeColor,
    thresholds,
    gaugeBackgroundColor,
    glowColor,
    valueTextColor,
    tickColor,
    gapAngle,
    lineWidth,
    showTicks,
    showGlow,
    label,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'RadialGauge', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

/**
 * Helper to build a single threshold spec.
 * @param {number} value - Upper bound of this threshold zone
 * @param {import('../../types.d.ts').ColorSpec} color
 * @returns {import('../../types.d.ts').ThresholdSpec}
 */
export function makeThreshold(value, color) {
  return { value, color };
}

makeRadialGauge.fromDTO = (dto) => dto;
