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
 * @param {string|null} [opts.name]
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
 * @param {boolean} [opts.showGrid=false]
 * @param {number} [opts.gridRows=4]
 * @param {number} [opts.gridColumns=6]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.gridColor]
 * @param {string[]|null} [opts.xAxisLabels] - N labels distributed geometrically across the canvas width (priority over labels)
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.xAxisLabelColor]
 * @param {string[]|null} [opts.yAxisLabels] - Used only with LEFT/RIGHT/BOTH. Ignored in AUTO mode.
 * @param {string|null} [opts.yAxisUnit] - Unit suffix appended to every Y-axis label (e.g. 'KB/s', 'MB', '%'). null = no unit.
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
 * @returns {import('../../types.d.ts').AreaChartDTO}
 */
export function makeAreaChart({
  name = null,
  values,
  lineColor = { type: 'Fill', primaryColor: '#00FFFF' },
  areaColor = fadeToTransparent('#00FFFF'),
  baselineValue = null,
  glowColor = null,
  lineWidth = 2.5,
  smoothingEnabled = true,
  showGlow = false,
  showGrid = false,
  gridRows = 4,
  gridColumns = 6,
  gridColor = { type: 'Fill', primaryColor: '#FFFFFF26' },
  horizontalPadding = 12,
  verticalPadding = 10,
  labels = null,
  labelColor = null,
  xAxisLabels = null,
  xAxisLabelColor = null,
  yAxisLabels = null,
  yAxisUnit = null,
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
    showGrid,
    gridRows,
    gridColumns,
    gridColor,
    horizontalPadding,
    verticalPadding,
    labels,
    labelColor,
    xAxisLabels,
    xAxisLabelColor,
    yAxisLabels,
    yAxisUnit,
    yAxisPosition,
    yAxisLabelColor,
    yMin,
    yMax,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'AreaChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeAreaChart.fromDTO = (dto) => dto;
