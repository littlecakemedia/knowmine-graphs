# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.1.0] — 2026-03-25

### Added

- **`swapAreaChart()`** — new time-series AreaChart for swap usage percentage over time (Linux only; returns a flat zero chart when swap is unavailable). Completes the swap chart set: `swapKPIChart`, `swapGaugeChart`, `swapAreaChart`
- **`'swap'` added to `CollectorName`** in `types.d.ts` — was previously missing
- **Monitoring chart type declarations** in `types.d.ts` for all RAM and swap chart functions

### Changed

- **`memoryGaugeChart` → `ramGaugeChart`** — renamed for consistency with the `ram*` naming convention
- **`memoryAreaChart` → `ramAreaChart`** — renamed for consistency
- RAM and swap charts now use a uniform naming scheme: `ram{GaugeChart,AreaChart,KPIChart}` and `swap{KPIChart,GaugeChart,AreaChart}`
- Monitoring index comments updated to reflect the `RAM` / `Swap` grouping
- **`nome` parameter renamed to `name`** across all renderer and monitoring chart functions — the DTO output field (`dto.nome`) is unchanged, only the JS input parameter name changed to follow the English-only source code convention
- **`cpuChart` → `cpuTimeSeriesChart`** — renamed to carry the chart-type suffix like all other monitoring functions (`ramGaugeChart`, `heapAreaChart`, etc.)

### Migration

```js
// Before — chart function names
import { memoryGaugeChart, memoryAreaChart, ramKPIChart } from 'knowmine-graphs/monitoring';

// After — chart function names
import { ramGaugeChart, ramAreaChart, ramKPIChart } from 'knowmine-graphs/monitoring';

// Before — nome parameter
makeBarChart({ nome: 'My Widget', values: [...] });

// After — name parameter (DTO output dto.nome is unchanged)
makeBarChart({ name: 'My Widget', values: [...] });

// Before — cpuChart
import { cpuChart } from 'knowmine-graphs/monitoring';
cpuChart();

// After — cpuTimeSeriesChart
import { cpuTimeSeriesChart } from 'knowmine-graphs/monitoring';
cpuTimeSeriesChart();
```

---

## [1.0.0] — 2026-03-23

### Added

- **Renderer layer** — 9 chart types: `BarChart`, `PieChart`, `AreaChart`, `TimeSeriesLineChart`, `StackedBarChart`, `RadialGauge`, `RadialGaugeLarge`, `CircularProgress`, `KPIMetric`
- **Helpers** — color presets (`gradient`, `fill`, `palette`), factory functions (`solidColor`, `gradientColor`, `fadeToTransparent`), normalization utilities (`normalizeRange`, `normalizeSum`, `makeYAxisLabels`, `clamp`, `round`, `formatBytes`, `toPercent`), optional input validation (`enableValidation`)
- **Monitoring layer** (`knowmine-graphs/monitoring`) — 8 metric collectors: CPU, Memory, Disk I/O, Network I/O, Disk Usage, Load Average, Event Loop Lag, GC Stats
- **Monitoring charts** — 16 ready-made chart functions powered by live server metrics
- **In-memory store** — `RingBuffer`-backed time-series store with automatic eviction
- **TypeScript definitions** — full type coverage in `types.d.ts`
- **Unit tests** — 115 tests using the Node.js built-in test runner (zero dependencies)
- **Examples** — `basic.js` and `monitoring.js`
