/**
 * BarChart renderer — type: "BarChart" (2×1)
 *
 * Vertical bar chart with gradient support, optional single-bar highlight,
 * and configurable corner radius.
 */

import { buildEnvelope } from './_envelope.js';
import { validateValues, validateColorSpec } from '../helpers/validate.js';
import { gradient } from '../helpers/colors.js';

/**
 * Generates a BarChart DTO compatible with the KnowMine widget.
 *
 * @param {object} opts
 * @param {string|null} [opts.nome] - Widget display name
 * @param {number[]} opts.values - Bar values (at least one)
 * @param {import('../../types.d.ts').ColorSpec} [opts.barColor] - Bar color/gradient
 * @param {number|null} [opts.highlightIndex] - 0-based index of the highlighted bar
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.highlightColor] - Color for the highlighted bar
 * @param {string[]|null} [opts.labels] - Labels below each bar
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.labelColor] - Label text color
 * @param {string[]|null} [opts.yAxisLabels] - Y-axis labels (bottom to top)
 * @param {string|null} [opts.yAxisPosition] - 'LEFT' | 'RIGHT' | 'BOTH'
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.yAxisLabelColor]
 * @param {number} [opts.barSpacing=4]
 * @param {number} [opts.cornerRadius=6]
 * @param {boolean} [opts.showGlow=false]
 * @param {number} [opts.horizontalPadding=12]
 * @param {number} [opts.verticalPadding=10]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP_LEFT']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').BarChartDTO}
 */
export function makeBarChart({
  nome = null,
  values,
  barColor = gradient.blue,
  highlightIndex = null,
  highlightColor = null,
  labels = null,
  labelColor = null,
  yAxisLabels = null,
  yAxisPosition = null,
  yAxisLabelColor = null,
  barSpacing = 4,
  cornerRadius = 6,
  showGlow = false,
  horizontalPadding = 12,
  verticalPadding = 10,
  nameFont = null,
  namePosition = 'TOP_LEFT',
  backgroundColor = null,
  backgroundType = 'NONE',
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
    barSpacing,
    cornerRadius,
    showGlow,
    horizontalPadding,
    verticalPadding,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ nome, type: 'BarChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

/**
 * Pass-through for pre-built BarChart DTO objects.
 * Use when you already have a fully formed DTO.
 * @param {import('../../types.d.ts').BarChartDTO} dto
 * @returns {import('../../types.d.ts').BarChartDTO}
 */
makeBarChart.fromDTO = (dto) => dto;
