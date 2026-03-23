/**
 * Ready-to-use Node.js heap usage chart.
 * Returns a KPIMetric DTO showing current heap usage with a sparkline,
 * and an AreaChart for heap trend over time.
 */

import { store } from '../store/memoryStore.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels, formatBytes } from '../../helpers/normalize.js';

/**
 * Returns a KPIMetric DTO for current heap used vs heap total.
 * @param {object} [opts]
 * @param {string} [opts.nome='Heap']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} KPIMetric DTO
 */
export function heapKPIChart({
  nome = 'Heap',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', maxPoints);
  const current = entries[entries.length - 1]?.value?.process;
  const heapUsedMB = current ? current.heapUsed / 1024 / 1024 : 0;
  const sparkline = entries.map(e => (e.value?.process?.heapUsed ?? 0) / 1024 / 1024);

  const previous = entries[entries.length - 2]?.value?.process?.heapUsed;
  const current_ = current?.heapUsed ?? 0;
  const trendPct = previous && previous > 0
    ? Math.abs(((current_ - previous) / previous) * 100)
    : null;
  const trendDir = previous ? (current_ > previous ? 'up' : current_ < previous ? 'down' : 'neutral') : 'neutral';

  return makeKPIMetric({
    nome,
    value: parseFloat(heapUsedMB.toFixed(1)),
    valueColor: { type: 'Fill', primaryColor: '#FFFFFF' },
    unit: 'MB',
    trendPercentage: trendPct !== null ? parseFloat(trendPct.toFixed(1)) : null,
    trendDirection: trendDir,
    sparklineValues: sparkline,
    trendUpColor: { type: 'Fill', primaryColor: '#FF8C00' },
    trendDownColor: { type: 'Fill', primaryColor: '#00FF88' },
    sparklineColor: fadeToTransparent('#800080'),
    isInt: false,
    showSparkline: sparkline.length >= 2,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns an AreaChart of heap used (in MB) over time.
 * @param {object} [opts]
 * @param {string} [opts.nome='Heap Used']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function heapAreaChart({
  nome = 'Heap Used',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', maxPoints);
  const values = entries.length
    ? entries.map(e => parseFloat(((e.value?.process?.heapUsed ?? 0) / 1024 / 1024).toFixed(2)))
    : [0, 0];

  const max = Math.max(...values, 1);

  return makeAreaChart({
    nome,
    values,
    lineColor: { type: 'Fill', primaryColor: '#CC66FF' },
    areaColor: fadeToTransparent('#CC66FF'),
    yAxisLabels: makeYAxisLabels(0, max, 3, 0),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
