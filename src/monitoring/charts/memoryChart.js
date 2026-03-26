/**
 * Ready-to-use system RAM usage charts.
 * Exports ramGaugePercentChart(), ramGaugeSizeChart(), ramKPIChart(),
 * ramAreaPercentChart(), ramAreaSizeChart() — all scoped to RAM/memory.
 */

import { store } from '../store/memoryStore.js';
import { makeRadialGauge } from '../../renderer/radialGauge.js';
import { makeKPIMetric } from '../../renderer/kpiMetric.js';
import { makeAreaChart } from '../../renderer/areaChart.js';
import { gradient, fill, fadeToTransparent } from '../../helpers/colors.js';
import { makeYAxisLabels, formatBytes } from '../../helpers/normalize.js';

/**
 * Returns a RadialGauge DTO showing current RAM usage as a percentage (0–100).
 * Color thresholds: green < 60 %, orange < 85 %, red ≤ 100 %.
 * @param {object} [opts]
 * @param {string} [opts.name='RAM']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function ramGaugePercentChart({
  name = 'RAM',
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', 1);
  const snap = entries[0]?.value ?? { usedPercent: 0 };

  return makeRadialGauge({
    name,
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
    unit: '%',
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a RadialGauge DTO showing current RAM usage as an absolute value.
 * The unit is chosen automatically based on current usage:
 *   - usedMB < 1024  →  integer MB  (e.g. 512 MB)
 *   - usedMB ≥ 1024  →  1-decimal GB (e.g. 1.4 GB)
 * The gauge scale (minValue/maxValue) always matches the chosen unit.
 * Color thresholds mirror ramGaugePercentChart (60 %/85 %/100 % of total RAM).
 * @param {object} [opts]
 * @param {string} [opts.name='RAM']
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} RadialGauge DTO
 */
export function ramGaugeSizeChart({
  name = 'RAM',
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', 1);
  const snap = entries[0]?.value ?? { usedBytes: 0, totalBytes: 1 };

  const usedMB  = snap.usedBytes  / 1024 / 1024;
  const totalMB = snap.totalBytes / 1024 / 1024;

  const useGB = usedMB >= 1024;
  const value    = useGB ? parseFloat((usedMB  / 1024).toFixed(1)) : Math.round(usedMB);
  const maxValue = useGB ? parseFloat((totalMB / 1024).toFixed(1)) : Math.round(totalMB);
  const unit     = useGB ? 'GB' : 'MB';

  const t60  = useGB ? parseFloat(((totalMB * 0.60) / 1024).toFixed(1)) : Math.round(totalMB * 0.60);
  const t85  = useGB ? parseFloat(((totalMB * 0.85) / 1024).toFixed(1)) : Math.round(totalMB * 0.85);

  return makeRadialGauge({
    name,
    value,
    minValue: 0,
    maxValue,
    thresholds: [
      { value: t60,      color: { type: 'Fill', primaryColor: '#00FF88' } },
      { value: t85,      color: { type: 'Fill', primaryColor: '#FF8C00' } },
      { value: maxValue, color: { type: 'Fill', primaryColor: '#FF4444' } },
    ],
    gaugeColor: gradient.neon,
    gaugeBackgroundColor: fill.dimWhiteLow,
    gapAngle: 120,
    lineWidth: 14,
    label: 'RAM',
    unit,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a KPIMetric DTO showing current system RAM used in MB with a sparkline.
 * @param {object} [opts]
 * @param {string} [opts.name='RAM Used']
 * @param {number} [opts.maxPoints=30]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} KPIMetric DTO
 */
export function ramKPIChart({
  name = 'RAM Used',
  maxPoints = 30,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries  = store.last('memory', maxPoints);
  const current  = entries[entries.length - 1]?.value;
  const usedMB   = current ? current.usedBytes / 1024 / 1024 : 0;
  const sparkline = entries.map(e => (e.value?.usedBytes ?? 0) / 1024 / 1024);

  const prevBytes = entries[entries.length - 2]?.value?.usedBytes;
  const currBytes = current?.usedBytes ?? 0;
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
    trendUpColor:   { type: 'Fill', primaryColor: '#FF8C00' },
    trendDownColor: { type: 'Fill', primaryColor: '#00FF88' },
    sparklineColor: fadeToTransparent('#00FFCC'),
    isInt: true,
    showSparkline: sparkline.length >= 2,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}

/**
 * Returns a time-series AreaChart of RAM usage percentage over time.
 * @param {object} [opts]
 * @param {string} [opts.name='RAM Usage']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function ramAreaPercentChart({
  name = 'RAM Usage',
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
    name,
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

/**
 * Returns a time-series AreaChart of RAM usage as an absolute value (MB or GB) over time.
 * The unit is chosen automatically based on total RAM:
 *   - totalMB < 1024  →  integer MB  (e.g. 512 MB)
 *   - totalMB ≥ 1024  →  1-decimal GB (e.g. 1.4 GB)
 * Y-axis is scaled from 0 to totalRAM in the chosen unit.
 * @param {object} [opts]
 * @param {string} [opts.name='RAM Size']
 * @param {number} [opts.maxPoints=60]
 * @param {number} [opts.refreshInterval=10]
 * @param {object} [opts.backgroundColor]
 * @param {string} [opts.backgroundType='ROUND_RECT']
 * @returns {object} AreaChart DTO
 */
export function ramAreaSizeChart({
  name = 'RAM Size',
  maxPoints = 60,
  refreshInterval = 10,
  backgroundColor = { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType = 'ROUND_RECT',
} = {}) {
  const entries = store.last('memory', maxPoints);

  const latestSnap = entries[entries.length - 1]?.value;
  const totalBytes = latestSnap?.totalBytes ?? 0;
  const totalMB = totalBytes / 1024 / 1024;
  const useGB = totalMB >= 1024;

  const toUnit = (bytes) => {
    const mb = bytes / 1024 / 1024;
    return useGB ? parseFloat((mb / 1024).toFixed(1)) : Math.round(mb);
  };

  const maxValue = useGB ? parseFloat((totalMB / 1024).toFixed(1)) : Math.round(totalMB);
  const unit = useGB ? 'GB' : 'MB';

  const values = entries.length
    ? entries.map(e => toUnit(e.value?.usedBytes ?? 0))
    : [0, 0];

  return makeAreaChart({
    name,
    values,
    lineColor: { type: 'Fill', primaryColor: '#00BFFF' },
    areaColor: fadeToTransparent('#00BFFF'),
    yAxisLabels: makeYAxisLabels(0, maxValue, 3),
    yAxisPosition: 'LEFT',
    yAxisLabelColor: fill.dimWhite,
    yMin: 0,
    yMax: maxValue || 1,
    backgroundColor,
    backgroundType,
    refreshInterval,
  });
}
