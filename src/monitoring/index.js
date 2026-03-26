/**
 * knowmine-graphs/monitoring
 *
 * Optional monitoring layer for server-level metrics.
 * Import from 'knowmine-graphs/monitoring'.
 *
 * The core renderer (import from 'knowmine-graphs') does NOT require this module.
 *
 * @example
 * import { startMonitoring, cpuTimeSeriesChart } from 'knowmine-graphs/monitoring';
 *
 * startMonitoring({ intervalMs: 5000 });
 * const dto = cpuTimeSeriesChart();
 * res.json(dto);
 */

// Orchestrator
export { startMonitoring, stopMonitoring, isMonitoring, ALL_COLLECTORS } from './startMonitoring.js';

// Store (for direct access to raw samples)
export { store } from './store/memoryStore.js';

// Charts — CPU
export { cpuTimeSeriesChart } from './charts/cpuChart.js';

// Charts — RAM
export { ramGaugePercentChart, ramGaugeSizeChart, ramKPIChart, ramAreaPercentChart, ramAreaSizeChart } from './charts/memoryChart.js';

// Charts — Swap
export { swapKPIChart, swapGaugePercentChart, swapGaugeSizeChart, swapAreaPercentChart, swapAreaSizeChart } from './charts/swapChart.js';

// Charts — Heap
export { heapKPIChart, heapAreaChart } from './charts/heapChart.js';

// Charts — Disk I/O
export { diskIOStackedChart, diskIOAreaChart } from './charts/diskIOChart.js';

// Charts — Network
export { networkRxChart, networkTxChart } from './charts/networkChart.js';

// Charts — Load Average
export { loadAverageBarChart, loadAverageGaugeChart } from './charts/loadAverageChart.js';

// Charts — Event Loop
export { eventLoopTimeSeriesChart, eventLoopGaugeChart } from './charts/eventLoopChart.js';

// Charts — GC
export { gcPauseBarChart, gcKPIChart, gcFrequencyAreaChart } from './charts/gcChart.js';

// Collectors (for custom integrations)
export { collectCpu } from './collectors/cpu.js';
export { collectMemory } from './collectors/memory.js';
export { collectSwap } from './collectors/swap.js';
export { collectDiskIO } from './collectors/diskIO.js';
export { collectNetwork } from './collectors/network.js';
export { collectDiskUsage } from './collectors/diskUsage.js';
export { collectLoadAverage } from './collectors/loadAverage.js';
export { collectEventLoopLag } from './collectors/eventLoop.js';
export { collectGC } from './collectors/gc.js';
