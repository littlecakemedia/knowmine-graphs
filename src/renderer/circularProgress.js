/**
 * CircularProgress renderer — type: "CircularProgress" (1×1)
 *
 * Full 360° ring showing a progress value from 0 to 1.
 * Ideal for goal completion, download progress, battery level, or any
 * percentage-based metric.
 */

import { buildEnvelope } from './_envelope.js';
import { validateProgress, validateColorSpec } from '../helpers/validate.js';
import { gradient, fill, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../helpers/colors.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.name]
 * @param {number} opts.progress - Progress value from 0.0 to 1.0
 * @param {import('../../types.d.ts').ColorSpec} [opts.ringColor]
 * @param {string|null} [opts.label] - Main center text (auto-percentage if omitted)
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.ringBackgroundColor]
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.valueColor]
 * @param {string|null} [opts.caption] - Secondary text adjacent to the value
 * @param {'above'|'below'} [opts.captionPosition='below']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.captionColor]
 * @param {number} [opts.lineWidth=14]
 * @param {boolean} [opts.showValue=true]
 * @param {boolean} [opts.showGlow=false]
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').CircularProgressDTO}
 */
export function makeCircularProgress({
  name = null,
  progress,
  ringColor = gradient.blue,
  label = null,
  ringBackgroundColor = { type: 'Fill', primaryColor: '#FFFFFF26' },
  valueColor = { type: 'Fill', primaryColor: '#FFFFFF' },
  caption = null,
  captionPosition = 'below',
  captionColor = { type: 'Fill', primaryColor: '#FFFFFF99' },
  lineWidth = 14,
  showValue = true,
  showGlow = false,
  nameFont = null,
  namePosition = 'TOP',
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  validateProgress(progress);
  validateColorSpec(ringColor, 'ringColor');

  const payload = {
    progress,
    label,
    ringColor,
    ringBackgroundColor,
    valueColor,
    caption,
    captionPosition,
    captionColor,
    lineWidth,
    showValue,
    showGlow,
    nameFont,
    namePosition,
  };

  return buildEnvelope({ name, type: 'CircularProgress', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeCircularProgress.fromDTO = (dto) => dto;
