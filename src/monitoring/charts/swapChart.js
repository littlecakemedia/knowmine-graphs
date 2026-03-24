/**
 * Ready-to-use swap usage charts.
 * Returns a KPIMetric DTO for swap used in MB and a RadialGauge for swap percentage.
 * Both charts return a 'N/A' placeholder on non-Linux platforms or when no swap is configured.
 */

import { store } from '../store/memoryStore.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeRadialGauge } from '../../renderer/radialGauge.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';

/**
 * Returns a KPIMetric DTO showing current swap used in MB with a sparkline.
 * @param {object} [opts]
 * @param {string} [opts.nome='Swap Used']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} KPIMetric DTO
 */
export function swapKPIChart({
  nome = 'Swap Used',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('swap', maxPoints);
  const current = entries[entries.length - 1]?.value;

  if (!current?.available) {
    return makeKPIMetric({
      nome,
      value: 0,
      valueColor: { type: 'Fill', primaryColor: '#FFFFFF99' },
      unit: 'N/A',
      isInt: true,
      backgroundColor,
      backgroundType,
      refreshInterval,
    });
  }

  const usedMB    = current.usedBytes / 1024 / 1024;
  const sparkline = entries.map(e => (e.value?.usedBytes ?? 0) / 1024 / 1024);

  const prevBytes = entries[entries.length - 2]?.value?.usedBytes;
  const currBytes = current.usedBytes;
  const trendPct  = prevBytes && prevBytes > 0
    ? Math.abs(((currBytes - prevBytes) / prevBytes) * 100)
    : null;
  const trendDir  = prevBytes
    ? (currBytes > prevBytes ? 'up' : currBytes < prevBytes ? 'down' : 'neutral')
    : 'neutral';

  return makeKPIMetric({
    nome,
    value: parseFloat(usedMB.toFixed(0)),
    valueColor: { type: 'Fill', primaryColor: '#FFFFFF' },
    unit: 'MB',
    trendPercentage: trendPct !== null ? parseFloat(trendPct.toFixed(1)) : null,
    trendDirection: trendDir,
    sparklineValues: sparkline,
    trendUpColor:   { type: 'Fill', primaryColor: '#FF4444' },
    trendDownColor: { type: 'Fill', primaryColor: '#00FF88' },
    sparklineColor: fadeToTransparent('#FF8C00'),
    isInt: true,
    showSparkline: sparkline.length >= 2,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a RadialGauge DTO showing current swap usage percentage with color thresholds.
 * Thresholds: green < 30 %, orange < 70 %, red ≤ 100 %.
 * Returns a placeholder gauge when swap is unavailable.
 * @param {object} [opts]
 * @param {string} [opts.nome='Swap']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function swapGaugeChart({
  nome = 'Swap',
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('swap', 1);
  const snap    = entries[0]?.value;
  const value   = snap?.available ? (snap.usedPercent ?? 0) : 0;

  return makeRadialGauge({
    nome,
    value,
    minValue: 0,
    maxValue: 100,
    thresholds: [
      { value: 30,  color: { type: 'Fill', primaryColor: '#00FF88' } },
      { value: 70,  color: { type: 'Fill', primaryColor: '#FF8C00' } },
      { value: 100, color: { type: 'Fill', primaryColor: '#FF4444' } },
    ],
    gaugeColor: gradient.amber,
    gaugeBackgroundColor: fill.dimWhiteLow,
    gapAngle: 120,
    lineWidth: 14,
    label: snap?.available ? 'SWAP' : 'N/A',
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
