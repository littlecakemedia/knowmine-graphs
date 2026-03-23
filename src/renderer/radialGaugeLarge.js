/**
 * RadialGaugeLarge renderer — type: "RadialGaugeLarge" (2×1)
 *
 * Multi-gauge widget showing 2 or 3 side-by-side radial gauges on a single
 * 2×1 widget with a shared title.
 * Omit gauge3 to render a 2-gauge layout.
 */

import { buildEnvelope } from './_envelope.js';

/**
 * @param {object} opts
 * @param {string|null} [opts.nome]
 * @param {import('../../types.d.ts').GaugeSpec} opts.gauge1 - Left gauge
 * @param {import('../../types.d.ts').GaugeSpec} opts.gauge2 - Center (3) or right (2) gauge
 * @param {import('../../types.d.ts').GaugeSpec|null} [opts.gauge3] - Optional right gauge
 * @param {import('../../types.d.ts').FontModel|null} [opts.nameFont]
 * @param {string} [opts.namePosition='TOP_LEFT']
 * @param {import('../../types.d.ts').ColorSpec|null} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='NONE']
 * @param {string|null} [opts.borderColor]
 * @param {string|null} [opts.shadowColor]
 * @param {number} [opts.refreshInterval=30]
 * @returns {import('../../types.d.ts').RadialGaugeLargeDTO}
 */
export function makeRadialGaugeLarge({
  nome = null,
  gauge1,
  gauge2,
  gauge3 = null,
  nameFont = null,
  namePosition = 'TOP_LEFT',
  backgroundColor = null,
  backgroundType = 'NONE',
  borderColor = null,
  shadowColor = null,
  refreshInterval = 30,
} = {}) {
  const payload = {
    gauge1,
    gauge2,
    ...(gauge3 !== null ? { gauge3 } : {}),
    nameFont,
    namePosition,
  };

  return buildEnvelope({ nome, type: 'RadialGaugeLarge', payload, refreshInterval, backgroundColor, backgroundType, borderColor, shadowColor });
}

makeRadialGaugeLarge.fromDTO = (dto) => dto;
