/**
 * Ready-to-use system memory usage chart.
 * Returns a RadialGaugeLarge DTO with RAM usage gauge and a secondary KPI.
 * Also exports memoryAreaChart() for a time-series area view.
 */

import { store } from '../store/memoryStore.js';
import { makeRadialGauge } from '../../renderer/radialGauge.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels, formatBytes } from '../../helpers/normalize.js';

/**
 * Returns a RadialGauge DTO showing current RAM usage percentage.
 * @param {object} [opts]
 * @param {string} [opts.nome='Memory']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function memoryGaugeChart({
  nome = 'Memory',
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', 1);
  const snap = entries[0]?.value ?? { usedPercent: 0 };

  return makeRadialGauge({
    nome,
    value: snap.usedPercent ?? 0,
    minValue: 0,
    maxValue: 100,
    thresholds: [
      { value: 60, color: { type: 'Fill', primaryColor: '#00FF88' } },
      { value: 85, color: { type: 'Fill', primaryColor: '#FF8C00' } },
      { value: 100, color: { type: 'Fill', primaryColor: '#FF4444' } },
    ],
    gaugeColor: gradient.neon,
    gaugeBackgroundColor: fill.dimWhiteLow,
    gapAngle: 120,
    lineWidth: 14,
    label: 'RAM',
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a time-series AreaChart of RAM usage over time.
 * @param {object} [opts]
 * @param {string} [opts.nome='RAM Usage']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function memoryAreaChart({
  nome = 'RAM Usage',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', maxPoints);
  const values = entries.length
    ? entries.map(e => e.value?.usedPercent ?? 0)
    : [0, 0];

  return makeAreaChart({
    nome,
    values,
    lineColor: { type: 'Fill', primaryColor: '#00FFCC' },
    areaColor: fadeToTransparent('#00FFCC'),
    yAxisLabels: makeYAxisLabels(0, 100, 3),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
