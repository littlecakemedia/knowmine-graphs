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
 * @param {boolean} [opts.auto=false]
 *   - false (default): fixed scale 0–100%, Y labels on BOTH sides
 *   - true: scale auto-fit to current data range, labels AUTO
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
  auto = false,
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
    yAxisLabels: auto ? null : makeYAxisLabels(0, 100, 3),
    yAxisPosition: auto ? 'AUTO' : 'BOTH',
    yAxisLabelColor: fill.dimWhite,
    yMin: auto ? null : 0,
    yMax: auto ? null : 100,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
