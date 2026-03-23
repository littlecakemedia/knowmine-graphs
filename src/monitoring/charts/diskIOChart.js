/**
 * Ready-to-use disk I/O charts.
 * Returns a StackedBarChart or AreaChart showing read/write throughput over time.
 * Linux only — returns a placeholder KPIMetric on unsupported platforms.
 */

import { store } from '../store/memoryStore.js';
import { makeStackedBarChart, makeSeries } from '../../renderer/stackedBar.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';

function toMB(bytes) {
  return parseFloat((bytes / 1024 / 1024).toFixed(2));
}

/**
 * Returns a StackedBarChart DTO showing disk read (bottom) and write (top) MB/s.
 * @param {object} [opts]
 * @param {string} [opts.nome='Disk I/O']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} StackedBarChart DTO
 */
export function diskIOStackedChart({
  nome = 'Disk I/O',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('diskIO', maxPoints);

  if (!entries.length || entries[0]?.value?.supported === false) {
    return makeKPIMetric({
      nome,
      value: 0,
      valueColor: fill.dimWhite,
      unit: 'N/A',
      backgroundColor,
      backgroundType,
      refreshInterval,
    });
  }

  const reads = entries.map(e => toMB(e.value?.readBytesPerSec ?? 0));
  const writes = entries.map(e => toMB(e.value?.writeBytesPerSec ?? 0));
  const max = Math.max(...reads, ...writes, 1);

  return makeStackedBarChart({
    nome,
    series: [
      makeSeries(reads, gradient.blue),
      makeSeries(writes, gradient.sunset),
    ],
    yAxisLabels: makeYAxisLabels(0, max, 3, 1),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns an AreaChart DTO of total disk throughput (read + write) over time.
 * @param {object} [opts]
 * @param {string} [opts.nome='Disk Throughput']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function diskIOAreaChart({
  nome = 'Disk Throughput',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('diskIO', maxPoints);
  const values = entries.length && entries[0]?.value?.supported !== false
    ? entries.map(e => toMB((e.value?.readBytesPerSec ?? 0) + (e.value?.writeBytesPerSec ?? 0)))
    : [0, 0];

  const max = Math.max(...values, 1);

  return makeAreaChart({
    nome,
    values,
    lineColor: { type: 'Fill', primaryColor: '#FFD700' },
    areaColor: fadeToTransparent('#FFD700'),
    yAxisLabels: makeYAxisLabels(0, max, 3, 1),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
