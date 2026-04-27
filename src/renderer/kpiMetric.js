/**
 * KPIMetric renderer — type: "KPIMetric" (1×1)
 *
 * KPI display widget showing a primary numeric value with an optional unit,
 * trend indicator (up/down/neutral), and an embedded sparkline for historical context.
 */

import { buildEnvelope } from './_envelope.js';
import { validateColorSpec } from '../helpers/validate.js';
import { gradient, fill, fadeToTransparent, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.name]
 * @param {number} opts.value - Primary KPI value
 * @param {import('../../types.d.ts').ColorSpec} [opts.valueColor]
 * @param {string|null} [opts.unit] - Unit of measure (e.g. 'km', 'bpm', '°C')
 * @param {number|null} [opts.trendPercentage] - Absolute percentage change
 * @param {'up'|'down'|'neutral'} [opts.trendDirection='neutral']
 * @param {number[]} [opts.sparklineValues=[]] - Historical values (min 2 if showSparkline)
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.trendUpColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.trendDownColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.sparklineColor]
 * @param {boolean} [opts.isInt=false] - Round and display without decimals
 * @param {boolean} [opts.showSparkline=false]
 * @param {boolean} [opts.showGlow=false]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').KPIMetricDTO}
 */
export function makeKPIMetric({
  name = null,
  value,
  valueColor = { type: 'Fill', primaryColor: '#FFFFFF' },
  unit = null,
  trendPercentage = null,
  trendDirection = 'neutral',
  sparklineValues = [],
  trendUpColor = { type: 'Fill', primaryColor: '#00FF00' },
  trendDownColor = { type: 'Fill', primaryColor: '#FF0000' },
  sparklineColor = fadeToTransparent('#00FFFF'),
  isInt = false,
  showSparkline = false,
  showGlow = false,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  validateColorSpec(valueColor, 'valueColor');

  const payload = {
    value,
    valueColor,
    unit,
    trendPercentage,
    trendDirection,
    sparklineValues,
    trendUpColor,
    trendDownColor,
    sparklineColor,
    isInt,
    showSparkline,
    showGlow,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'KPIMetric', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeKPIMetric.fromDTO = (dto) => dto;
