/**
 * PieChart renderer — type: "PieChart" (1×1, 2×1)
 *
 * Full pie or donut chart. In the 2×1 format a legend is shown on the right
 * with up to 5 slices (extras aggregated as "Others").
 */

import { buildEnvelope } from './_envelope.js';
import { gradient, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.name]
 * @param {import('../../types.d.ts').SliceSpec[]} opts.slices
 * @param {number} [opts.innerRadiusRatio=0.0] - 0 = full pie, 0.5 = donut, max 0.9
 * @param {number} [opts.sliceSpacing=3]
 * @param {number} [opts.outerPadding=10]
 * @param {boolean} [opts.showGlow=false]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.glowColor]
 * @param {boolean} [opts.showPercentage=false]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').PieChartDTO}
 */
export function makePieChart({
  name = null,
  slices,
  innerRadiusRatio = 0.0,
  sliceSpacing = 3,
  outerPadding = 10,
  showGlow = false,
  glowColor = null,
  showPercentage = false,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  const payload = {
    slices,
    innerRadiusRatio,
    sliceSpacing,
    outerPadding,
    showGlow,
    glowColor,
    showPercentage,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'PieChart', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

/**
 * Helper to build a single pie slice.
 * @param {object} opts
 * @param {number} opts.value
 * @param {import('../../types.d.ts').ColorSpec} opts.color
 * @param {string|null} [opts.label]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.labelColor]
 * @returns {import('../../types.d.ts').SliceSpec}
 */
export function makeSlice({ value, color = gradient.blue, label = null, labelColor = null }) {
  return { value, color, label, labelColor };
}

makePieChart.fromDTO = (dto) => dto;
