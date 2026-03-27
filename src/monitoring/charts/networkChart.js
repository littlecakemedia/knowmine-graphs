/**
 * Ready-to-use network I/O charts.
 * Shows RX (download) and TX (upload) bandwidth over time.
 * Linux only — returns a placeholder on unsupported platforms.
 */

import { store } from '../store/memoryStore.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { makeBarChart } from '../../renderer/barChart.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { gradient, fill, fadeToTransparent, solidColor } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';
import { makeTimeAxisLabels } from '../helpers/timeLabels.js';

function toKB(bytes) {
  return parseFloat((bytes / 1024).toFixed(2));
}

/**
 * Returns an AreaChart showing inbound (RX) bandwidth in KB/s.
 * @param {object} [opts]
 * @param {string} [opts.name='Network RX']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function networkRxAreaChart({
  name = 'Network RX',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('network', maxPoints);

  if (!entries.length || entries[0]?.value?.supported === false) {
    return makeKPIMetric({ name, value: 0, valueColor: fill.dimWhite, unit: 'N/A', backgroundColor, backgroundType, refreshInterval });
  }

  const values = entries.map(e => toKB(e.value?.rxBytesPerSec ?? 0));
  const max = Math.max(...values, 1);

  return makeAreaChart({
    name,
    values,
    lineColor: solidColor('#00FFCC'),
    areaColor: fadeToTransparent('#00FFCC'),
    showGrid: true,
    yAxisLabels: makeYAxisLabels(0, max, 3, 0),
    yAxisUnit: 'KB/s',
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    xAxisLabels: makeTimeAxisLabels(entries, 4),
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns an AreaChart showing outbound (TX) bandwidth in KB/s.
 * @param {object} [opts]
 * @param {string} [opts.name='Network TX']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function networkTxAreaChart({
  name = 'Network TX',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('network', maxPoints);

  if (!entries.length || entries[0]?.value?.supported === false) {
    return makeKPIMetric({ name, value: 0, valueColor: fill.dimWhite, unit: 'N/A', backgroundColor, backgroundType, refreshInterval });
  }

  const values = entries.map(e => toKB(e.value?.txBytesPerSec ?? 0));
  const max = Math.max(...values, 1);

  return makeAreaChart({
    name,
    values,
    lineColor: solidColor('#FF8C00'),
    areaColor: fadeToTransparent('#FF8C00'),
    showGrid: true,
    yAxisLabels: makeYAxisLabels(0, max, 3, 0),
    yAxisUnit: 'KB/s',
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    xAxisLabels: makeTimeAxisLabels(entries, 4),
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
