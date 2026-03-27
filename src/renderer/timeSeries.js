/**
 * TimeSeriesLineChart renderer — type: "TimeSeriesLineChart" (2×1)
 *
 * Time series line chart with a horizontally-applied gradient on the line and
 * a vertical gradient fill below it. Features an optional background grid.
 * Suitable for real-time or historical data with a technical dashboard aesthetic.
 */

import { buildEnvelope } from './_envelope.js';
import { validateValues, validateColorSpec } from '../helpers/validate.js';
import { gradient, fadeToTransparent, fill } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.name]
 * @param {number[]} opts.values - Chronologically ordered values (minimum 2)
 * @param {import('../../types.d.ts').ColorSpec} opts.lineColor - Horizontal gradient on the line
 * @param {import('../../types.d.ts').ColorSpec} opts.areaColor - Vertical gradient fill below the line
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.gridColor] - Required if showGrid is true
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.glowColor] - Required if showGlow is true
 * @param {number} [opts.lineWidth=2.5]
 * @param {boolean} [opts.showGrid=true]
 * @param {boolean} [opts.smoothingEnabled=true]
 * @param {boolean} [opts.showGlow=false]
 * @param {number} [opts.gridRows=4]
 * @param {number} [opts.gridColumns=6]
 * @param {number} [opts.horizontalPadding=12]
 * @param {number} [opts.verticalPadding=10]
 * @param {string[]|null} [opts.labels]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.labelColor]
 * @param {string[]|null} [opts.xAxisLabels] - N labels distributed geometrically across the canvas width (priority over labels)
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.xAxisLabelColor]
 * @param {string[]|null} [opts.yAxisLabels] - Used only with LEFT/RIGHT/BOTH. Ignored in AUTO mode.
 * @param {'NONE'|'AUTO'|'LEFT'|'RIGHT'|'BOTH'|null} [opts.yAxisPosition]
 *   - absent/"NONE": no labels, auto-scale
 *   - "AUTO": auto-scale, labels auto-generated from actual range (yAxisLabels ignored)
 *   - "LEFT"/"RIGHT"/"BOTH": fixed scale if yMin+yMax provided, otherwise auto-scale
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.yAxisLabelColor]
 * @param {number|null} [opts.yMin] - Scale minimum. Required for fixed scale (LEFT/RIGHT/BOTH).
 * @param {number|null} [opts.yMax] - Scale maximum. Required for fixed scale (LEFT/RIGHT/BOTH).
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @param {string|null} [opts.yAxisUnit] - Unit label appended to each Y-axis label (e.g. '%', 'MB/s'). Default: null.
 * @returns {import('../../types.d.ts').TimeSeriesLineChartDTO}
 */
export function makeTimeSeriesLineChart({
  name = null,
  values,
  lineColor = gradient.blue,
  areaColor = fadeToTransparent('#00FFFF'),
  gridColor = { type: 'Fill', primaryColor: '#FFFFFF26' },
  glowColor = null,
  lineWidth = 2.5,
  showGrid = true,
  smoothingEnabled = true,
  showGlow = false,
  gridRows = 4,
  gridColumns = 6,
  horizontalPadding = 12,
  verticalPadding = 10,
  labels = null,
  labelColor = null,
  xAxisLabels = null,
  xAxisLabelColor = null,
  yAxisLabels = null,
  yAxisPosition = null,
  yAxisLabelColor = null,
  yMin = null,
  yMax = null,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = null,
  backgroundType = 'NONE',
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
  yAxisUnit = null,
} = {}) {
  validateValues(values, 'values', 2);
  validateColorSpec(lineColor, 'lineColor');
  validateColorSpec(areaColor, 'areaColor');

  const payload = {
    values,
    lineColor,
    areaColor,
    gridColor,
    glowColor,
    lineWidth,
    showGrid,
    smoothingEnabled,
    showGlow,
    gridRows,
    gridColumns,
    horizontalPadding,
    verticalPadding,
    labels,
    labelColor,
    xAxisLabels,
    xAxisLabelColor,
    yAxisLabels,
    yAxisPosition,
    yAxisLabelColor,
    yMin,
    yMax,
    nameFont,
    namePosition,
    yAxisUnit,
  };

  return buildEnvelope({ name, type: 'TimeSeriesLineChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeTimeSeriesLineChart.fromDTO = (dto) => dto;
