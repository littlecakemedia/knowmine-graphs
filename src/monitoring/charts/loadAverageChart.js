/**
 * Ready-to-use load average charts.
 * Shows 1m / 5m / 15m load averages.
 * Linux/macOS only — returns a placeholder on Windows.
 */

import { store } from '../store/memoryStore.js';
import { makeBarChart } from '../../renderer/barChart.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeRadialGaugeLarge } from '../../renderer/radialGaugeLarge.js';
import { gradient, fill, solidColor, fadeToTransparent } from '../../helpers/colors.js';
import os from 'os';

const cpuCount = os.cpus().length;

/**
 * Returns a BarChart DTO showing the last 1m, 5m, 15m load averages as bars.
 * The max scale is the number of CPU cores (load > cores = overloaded).
 * @param {object} [opts]
 * @param {string} [opts.nome='Load Average']
 * @param {number} [opts.refreshInterval=30]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} BarChart DTO
 */
export function loadAverageBarChart({
  nome = 'Load Average',
  refreshInterval = 30,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('loadAverage', 1);
  const snap = entries[0]?.value;

  if (!snap?.supported) {
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

  return makeBarChart({
    nome,
    values: [snap.one, snap.five, snap.fifteen],
    labels: ['1m', '5m', '15m'],
    barColor: gradient.neon,
    // Highlight the 1m bar if it exceeds the CPU core count (overload indicator)
    highlightIndex: snap.one > cpuCount ? 0 : null,
    highlightColor: { type: 'Fill', primaryColor: '#FF4444' },
    labelColor: fill.dimWhite,
    cornerRadius: 6,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a RadialGaugeLarge DTO with 3 gauges: 1m / 5m / 15m load.
 * Scale max = number of CPU cores.
 * @param {object} [opts]
 * @param {string} [opts.nome='System Load']
 * @param {number} [opts.refreshInterval=30]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGaugeLarge DTO
 */
export function loadAverageGaugeChart({
  nome = 'System Load',
  refreshInterval = 30,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('loadAverage', 1);
  const snap = entries[0]?.value;

  if (!snap?.supported) {
    return makeKPIMetric({ nome, value: 0, valueColor: fill.dimWhite, unit: 'N/A', backgroundColor, backgroundType, refreshInterval });
  }

  const gaugeSpec = (value, label) => ({
    value,
    minValue: 0,
    maxValue: cpuCount,
    gaugeColor: gradient.neon,
    gaugeBackgroundColor: fill.dimWhiteLow,
    thresholds: [
      { value: cpuCount * 0.7, color: solidColor('#00FF88') },
      { value: cpuCount * 0.9, color: solidColor('#FF8C00') },
      { value: cpuCount, color: solidColor('#FF4444') },
    ],
    valueTextColor: fill.white,
    gapAngle: 120,
    lineWidth: 12,
    label,
  });

  return makeRadialGaugeLarge({
    nome,
    gauge1: gaugeSpec(snap.one, '1m'),
    gauge2: gaugeSpec(snap.five, '5m'),
    gauge3: gaugeSpec(snap.fifteen, '15m'),
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
