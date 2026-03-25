/**
 * knowmine-graphs — Basic Usage Examples
 *
 * Demonstrates how to generate KnowMine-compatible widget DTOs.
 * Run: node examples/basic.js
 */

import {
  makeBarChart,
  makePieChart, makeSlice,
  makeAreaChart,
  makeTimeSeriesLineChart,
  makeStackedBarChart, makeSeries,
  makeRadialGauge, makeThreshold,
  makeRadialGaugeLarge,
  makeCircularProgress,
  makeKPIMetric,
  gradient, fill, palette,
  solidColor, gradientColor, fadeToTransparent,
  makeYAxisLabels,
} from '../src/index.js';

// --- BarChart ---

const barChart = makeBarChart({
  name: 'Monthly Sales',
  values: [8, 14, 10, 18, 12, 22],
  barColor: gradient.blue,
  highlightIndex: 5,
  highlightColor: fill.orange,
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  yAxisLabels: makeYAxisLabels(0, 22, 3),
  yAxisPosition: 'LEFT',
  yAxisLabelColor: fill.dimWhite,
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
  refreshInterval: 30,
});

console.log('BarChart:', JSON.stringify(barChart, null, 2));

// --- PieChart ---

const pieChart = makePieChart({
  name: 'Expense Breakdown',
  slices: [
    makeSlice({ value: 40, color: gradient.blue, label: 'Rent', labelColor: solidColor('#00FFFF') }),
    makeSlice({ value: 35, color: gradient.sunset, label: 'Food', labelColor: solidColor('#FF8C00') }),
    makeSlice({ value: 25, color: gradient.purple, label: 'Other', labelColor: solidColor('#CC66FF') }),
  ],
  innerRadiusRatio: 0.5,
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

console.log('\nPieChart:', JSON.stringify(pieChart, null, 2));

// --- AreaChart ---

const areaChart = makeAreaChart({
  name: 'Weekly Temperature',
  values: [12, 15, 13, 18, 16, 22, 20],
  lineColor: solidColor('#00FFFF'),
  areaColor: fadeToTransparent('#00FFFF'),
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  yAxisLabels: makeYAxisLabels(10, 22, 3),
  yAxisPosition: 'LEFT',
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

console.log('\nAreaChart:', JSON.stringify(areaChart, null, 2));

// --- RadialGauge ---

const gauge = makeRadialGauge({
  name: 'CPU Usage',
  value: 72,
  minValue: 0,
  maxValue: 100,
  thresholds: [
    makeThreshold(40, solidColor('#00FF00')),
    makeThreshold(80, solidColor('#FF8C00')),
    makeThreshold(100, solidColor('#FF0000')),
  ],
  gaugeColor: gradient.blue,
  label: 'CPU',
  gapAngle: 120,
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

console.log('\nRadialGauge:', JSON.stringify(gauge, null, 2));

// --- CircularProgress ---

const progress = makeCircularProgress({
  name: 'Goal Completion',
  progress: 0.72,
  label: '72%',
  caption: 'Goal',
  captionPosition: 'below',
  ringColor: gradient.blue,
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

console.log('\nCircularProgress:', JSON.stringify(progress, null, 2));

// --- KPIMetric with palette key ---

const kpi = makeKPIMetric({
  name: 'Steps Today',
  value: 8432,
  valueColor: { type: 'Fill', primaryColor: palette.text }, // resolves to user's page text color
  unit: 'steps',
  trendPercentage: 12.3,
  trendDirection: 'up',
  sparklineValues: [3200, 4100, 3800, 5600, 6200, 7400, 8432],
  isInt: true,
  showSparkline: true,
  backgroundColor: { type: 'Fill', primaryColor: '#1A1A2E' },
  backgroundType: 'ROUND_RECT',
});

console.log('\nKPIMetric:', JSON.stringify(kpi, null, 2));
