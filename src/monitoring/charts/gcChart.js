/**
 * Ready-to-use Garbage Collection charts.
 * Shows GC frequency and pause duration over time.
 */

import { store } from '../store/memoryStore.js';
import { makeBarChart } from '../../renderer/barChart.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { gradient, fill, solidColor, fadeToTransparent, APP_DEFAULT_BACKGROUND, APP_DEFAULT_BACKGROUND_TYPE } from '../../helpers/colors.js';
import { makeYAxisLabels } from '../../helpers/normalize.js';

/**
 * Returns a BarChart of GC pause duration (ms) per interval.
 * @param {object} [opts]
 * @param {string} [opts.name='GC Pauses']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} BarChart DTO
 */
export function gcPauseBarChart({
  name = 'GC Pauses',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
} = {}) {
  const entries = store.last('gc', maxPoints);
  const values = entries.length
    ? entries.map(e => e.value?.totalDurationMs ?? 0)
    : [0];

  const max = Math.max(...values, 1);

  return makeBarChart({
    name,
    values,
    barColor: gradient.purple,
    cornerRadius: 4,
    yAxisLabels: makeYAxisLabels(0, max, 3, 1),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a KPIMetric DTO showing GC count and average pause duration.
 * @param {object} [opts]
 * @param {string} [opts.name='GC Stats']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} KPIMetric DTO
 */
export function gcKPIChart({
  name = 'GC Stats',
  refreshInterval = 10,
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
} = {}) {
  const entries = store.last('gc', 30);
  const current = entries[entries.length - 1]?.value ?? { count: 0, avgDurationMs: 0 };
  const sparkline = entries.map(e => e.value?.count ?? 0);

  return makeKPIMetric({
    name,
    value: current.avgDurationMs ?? 0,
    valueColor: { type: 'Fill', primaryColor: '#CC66FF' },
    unit: 'ms/gc',
    sparklineValues: sparkline,
    sparklineColor: fadeToTransparent('#800080'),
    isInt: false,
    showSparkline: sparkline.length >= 2,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns an AreaChart of GC event count over time.
 * @param {object} [opts]
 * @param {string} [opts.name='GC Frequency']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function gcFrequencyAreaChart({
  name = 'GC Frequency',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = APP_DEFAULT_BACKGROUND,
  backgroundType = APP_DEFAULT_BACKGROUND_TYPE,
} = {}) {
  const entries = store.last('gc', maxPoints);
  const values = entries.length
    ? entries.map(e => e.value?.count ?? 0)
    : [0, 0];

  const max = Math.max(...values, 1);

  return makeAreaChart({
    name,
    values,
    lineColor: solidColor('#CC66FF'),
    areaColor: fadeToTransparent('#CC66FF'),
    yAxisLabels: makeYAxisLabels(0, max, 3, 0),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
