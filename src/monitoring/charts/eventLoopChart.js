/**
 * Ready-to-use event loop lag charts.
 * Shows Node.js event loop delay over time — a key indicator of event loop
 * blocking due to synchronous heavy work.
 */

import { store } from '../store/memoryStore.js';
import { makeTimeSeriesLineChart } from '../../renderer/timeSeries.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeRadialGauge } from '../../renderer/radialGauge.js';
import { gradient, fill, solidColor, fadeToTransparent, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';

/**
 * Returns a TimeSeriesLineChart of event loop mean lag (ms) over time.
 * A healthy Node.js server should show lag < 10ms.
 * @param {object} [opts]
 * @param {string} [opts.name='Event Loop Lag']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.warnMs=10]   - Warn threshold in ms
 * @param {number} [opts.criticalMs=50] - Critical threshold in ms
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} TimeSeriesLineChart DTO
 */
export function eventLoopTimeSeriesChart({
  name = 'Event Loop Lag',
  maxPoints = 60,
  warnMs = 10,
  criticalMs = 50,
  refreshInterval = 10,
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
} = {}) {
  const entries = store.last('eventLoop', maxPoints);
  const values = entries.length
    ? entries.map(e => e.value?.meanMs ?? 0)
    : [0, 0];

  const max = Math.max(...values, criticalMs);

  return makeTimeSeriesLineChart({
    name,
    values,
    lineColor: gradient.neon,
    areaColor: fadeToTransparent('#00FFCC'),
    gridColor: { type: 'Fill', primaryColor: '#FFFFFF1A' },
    showGrid: true,
    yAxisLabels: makeYAxisLabels(0, max, 3, 0),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a RadialGauge DTO showing the current event loop mean lag.
 * @param {object} [opts]
 * @param {string} [opts.name='Loop Lag']
 * @param {number} [opts.maxMs=100] - Full-scale value in ms
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function eventLoopGaugeChart({
  name = 'Loop Lag',
  maxMs = 100,
  refreshInterval = 10,
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
} = {}) {
  const entries = store.last('eventLoop', 1);
  const lag = entries[0]?.value?.meanMs ?? 0;

  return makeRadialGauge({
    name,
    value: Math.min(lag, maxMs),
    minValue: 0,
    maxValue: maxMs,
    thresholds: [
      { value: 10, color: solidColor('#00FF88') },
      { value: 50, color: solidColor('#FF8C00') },
      { value: maxMs, color: solidColor('#FF4444') },
    ],
    gaugeColor: gradient.neon,
    gaugeBackgroundColor: fill.dimWhiteLow,
    gapAngle: 120,
    lineWidth: 14,
    label: 'ms',
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
