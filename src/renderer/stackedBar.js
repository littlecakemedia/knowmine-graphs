/**
 * StackedBarChart renderer — type: "StackedBarChart" (2×1)
 *
 * Stacked vertical bar chart with multiple series. Each series contributes to
 * the total height of each bar. Useful for part-to-whole relationships across
 * multiple categories.
 */

import { buildEnvelope } from './_envelope.js';
import { validateSeriesLengths, validateColorSpec } from '../helpers/validate.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.nome]
 * @param {import('../../types.d.ts').SeriesSpec[]} opts.series - First = bottom segment, last = top segment
 * @param {number} [opts.cornerRadius=6]
 * @param {number} [opts.barSpacing=4]
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
 * @returns {import('../../types.d.ts').StackedBarChartDTO}
 */
export function makeStackedBarChart({
  nome = null,
  series,
  cornerRadius = 6,
  barSpacing = 4,
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
  validateSeriesLengths(series);

  const payload = {
    series,
    cornerRadius,
    barSpacing,
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

  return buildEnvelope({ nome, type: 'StackedBarChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

/**
 * Helper to build a single series entry.
 * @param {number[]} values
 * @param {import('../../types.d.ts').ColorSpec} color
 * @returns {import('../../types.d.ts').SeriesSpec}
 */
export function makeSeries(values, color) {
  return { values, color };
}

makeStackedBarChart.fromDTO = (dto) => dto;
