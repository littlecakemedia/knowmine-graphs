/**
 * BarChart renderer — type: "BarChart" (2×1)
 *
 * Vertical bar chart with gradient support, optional single-bar highlight,
 * and configurable corner radius.
 */

import { buildEnvelope } from './_envelope.js';
import { validateValues, validateColorSpec } from '../helpers/validate.js';
import { gradient, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../helpers/colors.js';

/**
 * Generates a BarChart DTO compatible with the KnowMine widget.
 *
 * @param {object} opts
 * @param {string|null} [opts.name] - Widget display name
 * @param {number[]} opts.values - Bar values (at least one)
 * @param {import('../../types.d.ts').ColorSpec} [opts.barColor] - Bar color/gradient
 * @param {number|null} [opts.highlightIndex] - 0-based index of the highlighted bar
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.highlightColor] - Color for the highlighted bar
 * @param {string[]|null} [opts.labels] - Labels below each bar
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.labelColor] - Label text color
 * @param {string[]|null} [opts.yAxisLabels] - Used only with LEFT/RIGHT/BOTH. Ignored in AUTO mode.
 * @param {'NONE'|'AUTO'|'LEFT'|'RIGHT'|'BOTH'|null} [opts.yAxisPosition]
 *   - absent/"NONE": no labels, auto-scale
 *   - "AUTO": auto-scale, labels auto-generated from actual range (yAxisLabels ignored)
 *   - "LEFT"/"RIGHT"/"BOTH": fixed scale if yMin+yMax provided, otherwise auto-scale
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.yAxisLabelColor]
 * @param {number|null} [opts.yMin] - Scale minimum. Required for fixed scale (LEFT/RIGHT/BOTH).
 * @param {number|null} [opts.yMax] - Scale maximum. Required for fixed scale (LEFT/RIGHT/BOTH).
 * @param {number} [opts.barSpacing=4]
 * @param {number} [opts.cornerRadius=6]
 * @param {boolean} [opts.showGlow=false]
 * @param {number} [opts.horizontalPadding=12]
 * @param {number} [opts.verticalPadding=10]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').BarChartDTO}
 */
export function makeBarChart({
  name = null,
  values,
  barColor = gradient.blue,
  highlightIndex = null,
  highlightColor = null,
  labels = null,
  labelColor = null,
  yAxisLabels = null,
  yAxisPosition = null,
  yAxisLabelColor = null,
  yMin = null,
  yMax = null,
  yAxisUnit = null,
  barSpacing = 4,
  cornerRadius = 6,
  showGlow = false,
  horizontalPadding = 12,
  verticalPadding = 10,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  validateValues(values, 'values', 1);
  validateColorSpec(barColor, 'barColor');

  const payload = {
    values,
    barColor,
    highlightIndex,
    highlightColor,
    labels,
    labelColor,
    yAxisLabels,
    yAxisPosition,
    yAxisLabelColor,
    yMin,
    yMax,
    yAxisUnit,
    barSpacing,
    cornerRadius,
    showGlow,
    horizontalPadding,
    verticalPadding,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'BarChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

/**
 * Pass-through for pre-built BarChart DTO objects.
 * Use when you already have a fully formed DTO.
 * @param {import('../../types.d.ts').BarChartDTO} dto
 * @returns {import('../../types.d.ts').BarChartDTO}
 */
makeBarChart.fromDTO = (dto) => dto;
