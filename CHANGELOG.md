# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Breaking Changes

- **`ramAreaChart` → `ramAreaPercentChart`** — renamed to align with the `*Percent` / `*Size` suffix convention used by the gauge variants. Any consumer importing `ramAreaChart` must update to `ramAreaPercentChart`.
- **`swapAreaChart` → `swapAreaPercentChart`** — same rename rationale. Any consumer importing `swapAreaChart` must update to `swapAreaPercentChart`.

### Added

- **`ramAreaSizeChart()`** — time-series AreaChart of RAM usage as an absolute value (MB or GB). Unit is auto-selected based on total RAM (`MB` if < 1024 MB, `GB` with 1 decimal otherwise). Y-axis is fixed from 0 to total RAM in the chosen unit.
- **`swapAreaSizeChart()`** — time-series AreaChart of swap usage as an absolute value (MB or GB). Same unit logic as `ramAreaSizeChart`. Returns a flat zero placeholder on non-Linux platforms or when no swap is configured.
- **`yAxisUnit` field on `makeAreaChart`** — optional `string | null` parameter (default `null`). When set, the unit string is appended to the topmost Y-axis label (e.g. `"1024 KB/s"`) so consumers know the unit without embedding it in every label. iOS uses this field to widen the Y-axis label area dynamically.
- **`yAxisUnit` field on `makeBarChart`** — optional `string | null` parameter (default `null`). Same behaviour as `makeAreaChart`: the unit suffix is appended to every Y-axis label and iOS widens the Y-axis column from 28pt to 44pt when the field is set.
- **`yAxisUnit` field on `makeStackedBarChart`** — optional `string | null` parameter (default `null`). Same behaviour as `makeAreaChart` and `makeBarChart`: the unit suffix is appended to every Y-axis label and iOS widens the Y-axis column from 28pt to 44pt when the field is set.

### Changed

- **`networkRxChart` → `networkRxAreaChart`** — renamed to carry the `*AreaChart` suffix, consistent with `ramAreaSizeChart`, `swapAreaSizeChart`, `heapAreaChart`, etc. Any consumer importing `networkRxChart` must update the import.
- **`networkTxChart` → `networkTxAreaChart`** — same rename rationale.
- **Monitoring charts now populate `yAxisUnit`** — charts with absolute (non-percentage) scales pass the appropriate unit to `makeAreaChart`:
  - `networkRxAreaChart` / `networkTxAreaChart` → `'KB/s'`
  - `diskIOAreaChart` → `'MB/s'`
  - `diskIOStackedChart` → `'MB/s'`
  - `ramAreaSizeChart` → `'MB'` or `'GB'` (matches the auto-selected unit)
  - `swapAreaSizeChart` → `'MB'` or `'GB'` (matches the auto-selected unit)
  - `heapAreaChart` → `'MB'`
  - Percentage charts (`ramAreaPercentChart`, `swapAreaPercentChart`, `cpuTimeSeriesChart`) leave `yAxisUnit: null`.

### Migration

```js
// Before
import { ramAreaChart, swapAreaChart } from 'knowmine-graphs/monitoring';

// After
import { ramAreaPercentChart, swapAreaPercentChart } from 'knowmine-graphs/monitoring';
```

---

## [2.1.0] — 2026-03-25

### Changed

- **`cpuTimeSeriesChart`** — default scale is now fixed **0–100 %** (`yMin: 0`, `yMax: 100`) with Y labels on **both sides** (`yAxisPosition: 'BOTH'`). Previously the chart had no fixed scale and labels only on the left.

### Added

- **`cpuTimeSeriesChart({ auto })`** — new boolean option (default `false`). When `true`, switches to `yAxisPosition: 'AUTO'` with no fixed min/max, fitting the Y axis to the actual data range.

---

## [2.0.0] — 2026-03-25

### Breaking Changes

- **`dto.nome` → `dto.name`** in the response envelope — the JSON field returned by all renderer functions is now `name` instead of `nome`. Any consumer reading `dto.nome` must update to `dto.name`. This applies to all chart types.

### Migration

```json
// Before (1.x)
{ "nome": "Widget Title", "type": "BarChart", ... }

// After (2.0)
{ "name": "Widget Title", "type": "BarChart", ... }
```

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
