/**
 * knowmine-graphs — Monitoring Layer Example
 *
 * Shows how to start monitoring and generate chart DTOs from live server metrics.
 * Run: node examples/monitoring.js
 *
 * NOTE: Disk I/O, Network, and Load Average require Linux.
 */

import { startMonitoring, stopMonitoring } from '../src/monitoring/startMonitoring.js';
import {
  cpuChart,
  memoryGaugeChart, memoryAreaChart,
  heapKPIChart, heapAreaChart,
  diskIOStackedChart,
  networkRxChart, networkTxChart,
  loadAverageBarChart, loadAverageGaugeChart,
  eventLoopTimeSeriesChart, eventLoopGaugeChart,
  gcPauseBarChart, gcKPIChart,
} from '../src/monitoring/index.js';

console.log('Starting monitoring...');

const { stop } = startMonitoring({
  intervalMs: 2000,       // collect every 2 seconds
  bufferSize: 60,         // keep last 60 samples (~2 min at 2s interval)
  collectors: ['cpu', 'memory', 'loadAverage', 'eventLoop', 'gc'],
  // diskIO, network, diskUsage omitted for cross-platform compat in this example
});

// Wait 3 seconds to accumulate a few readings, then generate charts
setTimeout(() => {
  console.log('\n--- Generated Chart DTOs ---\n');

  const charts = {
    cpu: cpuChart({ nome: 'CPU Last 2 min', maxPoints: 30 }),
    memoryGauge: memoryGaugeChart(),
    memoryArea: memoryAreaChart(),
    heap: heapKPIChart(),
    heapArea: heapAreaChart(),
    eventLoopSeries: eventLoopTimeSeriesChart(),
    eventLoopGauge: eventLoopGaugeChart(),
    gcPause: gcPauseBarChart(),
    gcKPI: gcKPIChart(),
    ...(process.platform !== 'win32' ? { loadAverage: loadAverageBarChart() } : {}),
  };

  for (const [name, dto] of Object.entries(charts)) {
    console.log(`[${name}] type=${dto.type}, values=${Array.isArray(dto.payload.values) ? dto.payload.values.length + ' pts' : 'N/A'}`);
  }

  // Example: print the CPU chart as full JSON (to feed directly to an HTTP response)
  console.log('\nFull CPU chart DTO:');
  console.log(JSON.stringify(charts.cpu, null, 2));

  stop();
  console.log('\nMonitoring stopped.');
}, 3000);
