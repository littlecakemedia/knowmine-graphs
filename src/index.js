/**
 * knowmine-graphs
 *
 * Node.js library to generate JSON data sources for KnowMine dashboard
 * graph widgets. Used by backend APIs that power graph widgets in the
 * KnowMine app (https://knowmine.littlecakemedia.com).
 *
 * @module knowmine-graphs
 */

// --- Renderers ---
export { makeBarChart } from './renderer/barChart.js';
export { makePieChart, makeSlice } from './renderer/pieChart.js';
export { makeAreaChart } from './renderer/areaChart.js';
export { makeTimeSeriesLineChart } from './renderer/timeSeries.js';
export { makeStackedBarChart, makeSeries } from './renderer/stackedBar.js';
export { makeRadialGauge, makeThreshold } from './renderer/radialGauge.js';
export { makeRadialGaugeLarge } from './renderer/radialGaugeLarge.js';
export { makeCircularProgress } from './renderer/circularProgress.js';
export { makeKPIMetric } from './renderer/kpiMetric.js';

// --- Helpers ---
export { gradient, fill, palette, solidColor, gradientColor, fadeToTransparent } from './helpers/colors.js';
export { normalizeRange, normalizeSum, makeYAxisLabels, clamp, round, formatBytes, toPercent } from './helpers/normalize.js';
export { enableValidation, disableValidation, isValidationEnabled } from './helpers/validate.js';
