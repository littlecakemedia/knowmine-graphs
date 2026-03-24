/**
 * AreaChart renderer — type: "AreaChart" (2×1)
 *
 * Area chart with a top line and a vertically-gradient fill below it.
 * Ideal for showing trends over time with emphasis on the area under the curve.
 */

import { buildEnvelope } from './_envelope.js';
import { validateValues, validateColorSpec } from '../helpers/validate.js';
import { gradient, fadeToTransparent, fill } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.nome]
 * @param {number[]} opts.values - Chronological values (minimum 2)
 * @param {import('../../types.d.ts').ColorSpec} opts.lineColor
 * @param {import('../../types.d.ts').ColorSpec} opts.areaColor - Gradient fill (opaque → transparent)
 * @param {number|null} [opts.baselineValue] - Defaults to min value in the array
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.glowColor]
 * @param {number} [opts.lineWidth=2.5]
 * @param {boolean} [opts.smoothingEnabled=true]
 * @param {boolean} [opts.showGlow=false]
 * @param {number} [opts.horizontalPadding=12]
 * @param {number} [opts.verticalPadding=10]
 * @param {string[]|null} [opts.labels]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.labelColor]
 * @param {string[]|null} [opts.yAxisLabels]
 * @param {string|null} [opts.yAxisPosition]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.yAxisLabelColor]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').AreaChartDTO}
 */
export function makeAreaChart({
  nome = null,
  values,
  lineColor = { type: 'Fill', primaryColor: '#00FFFF' },
  areaColor = fadeToTransparent('#00FFFF'),
  baselineValue = null,
  glowColor = null,
  lineWidth = 2.5,
  smoothingEnabled = true,
  showGlow = false,
  horizontalPadding = 12,
  verticalPadding = 10,
  labels = null,
  labelColor = null,
  yAxisLabels = null,
  yAxisPosition = null,
  yAxisLabelColor = null,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = null,
  backgroundType = 'NONE',
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  validateValues(values, 'values', 2);
  validateColorSpec(lineColor, 'lineColor');
  validateColorSpec(areaColor, 'areaColor');

  const payload = {
    values,
    baselineValue,
    lineColor,
    areaColor,
    glowColor,
    lineWidth,
    smoothingEnabled,
    showGlow,
    horizontalPadding,
    verticalPadding,
    labels,
    labelColor,
    yAxisLabels,
    yAxisPosition,
    yAxisLabelColor,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ nome, type: 'AreaChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeAreaChart.fromDTO = (dto) => dto;
