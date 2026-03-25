/**
 * Ready-to-use CPU usage chart.
 * Returns a TimeSeriesLineChart DTO populated with CPU samples from the store.
 */

import { store } from '../store/memoryStore.js';
import { makeTimeSeriesLineChart } from '../../renderer/timeSeries.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';

/**
 * @param {object} [opts]
 * @param {string} [opts.name='CPU Usage']
 * @param {number} [opts.maxPoints=60] - Number of recent samples to display
 * @param {object} [opts.lineColor]
 * @param {object} [opts.areaColor]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @param {number} [opts.refreshInterval=10]
 * @returns {object} TimeSeriesLineChart DTO
 */
export function cpuTimeSeriesChart({
  name = 'CPU Usage',
  maxPoints = 60,
  lineColor = gradient.blue,
  areaColor = fadeToTransparent('#00FFFF'),
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
  refreshInterval = 10,
} = {}) {
  const entries = store.last('cpu', maxPoints);
  const values = entries.length ? entries.map(e => e.value) : [0, 0];

  return makeTimeSeriesLineChart({
    name,
    values,
    lineColor,
    areaColor,
    gridColor: { type: 'Fill', primaryColor: '#FFFFFF1A' },
    showGrid: true,
    yAxisLabels: makeYAxisLabels(0, 100, 3),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
