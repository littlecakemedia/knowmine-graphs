/**
 * Ready-to-use swap usage charts.
 * Exports swapKPIChart(), swapGaugeChart(), swapAreaChart() — all scoped to swap.
 * All charts return a 'N/A' / zero placeholder on non-Linux platforms or when no swap is configured.
 */

import { store } from '../store/memoryStore.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeRadialGauge } from '../../renderer/radialGauge.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';

/**
 * Returns a KPIMetric DTO showing current swap used in MB with a sparkline.
 * @param {object} [opts]
 * @param {string} [opts.name='Swap Used']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} KPIMetric DTO
 */
export function swapKPIChart({
  name = 'Swap Used',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('swap', maxPoints);
  const current = entries[entries.length - 1]?.value;

  if (!current?.available) {
    return makeKPIMetric({
      name,
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
    name,
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
 * @param {string} [opts.name='Swap']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function swapGaugeChart({
  name = 'Swap',
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('swap', 1);
  const snap    = entries[0]?.value;
  const value   = snap?.available ? (snap.usedPercent ?? 0) : 0;

  return makeRadialGauge({
    name,
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

/**
 * Returns a time-series AreaChart of swap usage percentage over time.
 * Returns a flat zero chart when swap is unavailable (non-Linux or no swap configured).
 * @param {object} [opts]
 * @param {string} [opts.name='Swap Usage']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function swapAreaChart({
  name = 'Swap Usage',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('swap', maxPoints);
  const available = entries[entries.length - 1]?.value?.available ?? false;
  const values = available && entries.length
    ? entries.map(e => e.value?.usedPercent ?? 0)
    : [0, 0];

  return makeAreaChart({
    name,
    values,
    lineColor: { type: 'Fill', primaryColor: '#FF8C00' },
    areaColor: fadeToTransparent('#FF8C00'),
    yAxisLabels: makeYAxisLabels(0, 100, 3),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
